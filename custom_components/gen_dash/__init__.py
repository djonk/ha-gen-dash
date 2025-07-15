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




async def async_reload_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload config entry."""
    await async_unload_entry(hass, entry)
    await async_setup_entry(hass, entry) 