"""The Gen-Dash integration."""
from __future__ import annotations

import logging
import os
from typing import TYPE_CHECKING

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers.typing import ConfigType

from .api import GenDashGenerateView
from .const import DOMAIN

if TYPE_CHECKING:
    from homeassistant.helpers.entity_platform import AddEntitiesCallback

_LOGGER = logging.getLogger(__name__)

# The type of hass.data[DOMAIN]
type GenDashData = dict[str, any]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Gen-Dash integration."""
    _LOGGER.info("Setting up Gen-Dash integration")
    
    # Initialize the domain data
    hass.data.setdefault(DOMAIN, {})
    
    # Register the API view
    api_view = GenDashGenerateView(hass)
    hass.http.register_view(api_view)
    
    _LOGGER.debug("Gen-Dash API view registered at %s", api_view.url)
    
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Gen-Dash from a config entry."""
    _LOGGER.info("Setting up Gen-Dash config entry: %s", entry.entry_id)
    
    # Store the config entry data
    hass.data[DOMAIN][entry.entry_id] = entry.data
    
    # Register the frontend resources
    await _register_frontend_resources(hass)
    
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    _LOGGER.info("Unloading Gen-Dash config entry: %s", entry.entry_id)
    
    # Remove the config entry data
    hass.data[DOMAIN].pop(entry.entry_id, None)
    
    # If no more config entries, clean up the domain data
    if not hass.data[DOMAIN]:
        hass.data.pop(DOMAIN, None)
    
    return True


async def _register_frontend_resources(hass: HomeAssistant) -> None:
    """Register the frontend resources (JavaScript card)."""
    try:
        # Path to the compiled JavaScript file
        integration_dir = os.path.dirname(__file__)
        frontend_dir = os.path.join(integration_dir, "frontend")
        dist_dir = os.path.join(frontend_dir, "dist")
        js_file = os.path.join(dist_dir, "gen-dash-card.js")
        
        # Check if the compiled file exists
        if not os.path.exists(js_file):
            _LOGGER.warning(
                "Frontend JavaScript file not found at %s. "
                "Make sure to build the frontend with 'npm run build'",
                js_file
            )
            return
        
        # Register the static path for serving the JavaScript file
        hass.http.register_static_path(
            "/gen-dash/gen-dash-card.js",
            js_file,
            cache_headers=False,  # Disable caching during development
        )
        
        # Register the Lovelace resource
        # Note: This registration method depends on the Home Assistant version
        # For newer versions, we might need to use a different approach
        try:
            # Try the newer method first
            from homeassistant.components.lovelace.resources import ResourceStorageCollection
            
            # This is a simplified approach - in a real implementation, you might
            # want to check if the resource is already registered
            resource_collection: ResourceStorageCollection = hass.data.get("lovelace", {}).get("resources")
            
            if resource_collection:
                # Add the resource to the collection
                await resource_collection.async_create_item({
                    "url": "/gen-dash/gen-dash-card.js",
                    "type": "module",
                })
                _LOGGER.info("Registered Gen-Dash card as Lovelace resource")
            else:
                _LOGGER.debug("Lovelace resources collection not available")
                
        except ImportError:
            # Fallback for older Home Assistant versions
            _LOGGER.debug("Using fallback method for Lovelace resource registration")
            
            # For older versions, we might need to use websocket commands
            # or other methods to register the resource
            pass
        
        # Alternative: Register using the frontend.add_extra_module_url service
        # This is another way to add custom JavaScript modules
        try:
            await hass.services.async_call(
                "frontend",
                "add_extra_module_url",
                {
                    "url": "/gen-dash/gen-dash-card.js",
                    "type": "module",
                },
                blocking=False,
            )
            _LOGGER.debug("Added Gen-Dash card via frontend service")
        except Exception as e:
            _LOGGER.debug("Could not add module via frontend service: %s", str(e))
        
        _LOGGER.info("Gen-Dash frontend resources registered successfully")
        
    except Exception as e:
        _LOGGER.error("Error registering frontend resources: %s", str(e))
        # Don't fail the setup if frontend registration fails
        # The integration can still work via API calls


async def async_reload_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload config entry."""
    await async_unload_entry(hass, entry)
    await async_setup_entry(hass, entry) 