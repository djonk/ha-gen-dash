"""API endpoints for Gen-Dash integration."""
from __future__ import annotations

import json
import logging
from typing import Any

import aiohttp
from aiohttp import web

from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceNotFound
from homeassistant.helpers import config_entry_registry

from .const import DOMAIN, CONF_AGENT_ID
from .entity_analyzer import EntityAnalyzer

_LOGGER = logging.getLogger(__name__)

# Master prompt template for the AI dashboard generator
MASTER_PROMPT_TEMPLATE = """
You are an expert Home Assistant Lovelace dashboard designer. Your task is to generate a beautiful, functional dashboard configuration in YAML format based on the user's request and the available entities.

## RULES AND GUIDELINES:

1. **Output Format**: Return ONLY valid YAML configuration for a Lovelace dashboard view.
2. **Card Types**: Prefer modern card types like:
   - `tile` cards for entity controls
   - `area` cards for room-based grouping
   - `mushroom` cards for compact, beautiful displays
   - `picture-elements` for spatial layouts
   - `grid` and `vertical-stack` for organization
3. **Best Practices**:
   - Group entities by area/room when possible
   - Use appropriate card types for each entity domain
   - Include state information and controls where relevant
   - Make the layout responsive and visually appealing
   - Add titles and organize content logically

## CARD TOOLBOX:

**For Lights**: Use `tile` cards with brightness and color controls
**For Sensors**: Use `tile` or `mushroom` cards showing current state
**For Switches**: Use `tile` cards with toggle functionality
**For Climate**: Use `tile` cards with temperature controls
**For Media Players**: Use `tile` cards with playback controls
**For Cameras**: Use `picture-entity` or `picture-glance` cards
**For Grouping**: Use `area` cards or `vertical-stack` for organization

## AVAILABLE ENTITIES:

The following entities are available in this Home Assistant instance, with area information (both official and inferred):

```json
{entity_data}
```

## USER REQUEST:

{user_prompt}

## RESPONSE:

Generate a complete Lovelace dashboard view configuration in YAML format that fulfills the user's request using the available entities. Make it beautiful, functional, and well-organized.
"""


class GenDashGenerateView(HomeAssistantView):
    """API view for generating dashboards."""

    url = "/api/gen_dash/generate"
    name = "api:gen_dash:generate"

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the API view."""
        self.hass = hass

    async def post(self, request: web.Request) -> web.Response:
        """Handle POST requests to generate dashboard configuration."""
        try:
            # Parse the request body
            data = await request.json()
            user_prompt = data.get("prompt", "")
            config_entry_id = data.get("config_entry_id")
            
            if not user_prompt:
                return web.json_response(
                    {"error": "No prompt provided"}, 
                    status=400
                )
            
            if not config_entry_id:
                return web.json_response(
                    {"error": "No config entry ID provided"}, 
                    status=400
                )
            
            # Get the config entry to retrieve the agent_id
            config_entry_registry_instance = config_entry_registry.async_get(self.hass)
            config_entry = config_entry_registry_instance.async_get_entry(config_entry_id)
            
            if not config_entry or config_entry.domain != DOMAIN:
                return web.json_response(
                    {"error": "Invalid config entry"}, 
                    status=400
                )
            
            agent_id = config_entry.data.get(CONF_AGENT_ID)
            if not agent_id:
                return web.json_response(
                    {"error": "No agent configured"}, 
                    status=400
                )
            
            # Verify the agent exists
            agent_state = self.hass.states.get(agent_id)
            if not agent_state:
                return web.json_response(
                    {"error": f"Agent {agent_id} not found"}, 
                    status=404
                )
            
            _LOGGER.info("Generating dashboard for prompt: %s", user_prompt[:100])
            
            # Analyze entities using EntityAnalyzer
            entity_analyzer = EntityAnalyzer(self.hass)
            enriched_entities = await entity_analyzer.analyze_entities()
            
            # Convert entity data to JSON for the prompt
            entity_data_json = json.dumps(enriched_entities, indent=2)
            
            # Construct the master prompt
            master_prompt = MASTER_PROMPT_TEMPLATE.format(
                entity_data=entity_data_json,
                user_prompt=user_prompt
            )
            
            _LOGGER.debug("Master prompt length: %d characters", len(master_prompt))
            
            # Call the conversation service
            try:
                response = await self.hass.services.async_call(
                    "conversation",
                    "process",
                    {
                        "agent_id": agent_id,
                        "text": master_prompt,
                    },
                    blocking=True,
                    return_response=True,
                )
                
                # Extract the response text
                response_text = response.get("response", {}).get("speech", {}).get("plain", {}).get("speech", "")
                
                if not response_text:
                    return web.json_response(
                        {"error": "No response from conversation agent"}, 
                        status=500
                    )
                
                # Try to extract YAML from the response
                # The AI might wrap the YAML in code blocks or add explanation text
                yaml_config = self._extract_yaml_from_response(response_text)
                
                if not yaml_config:
                    return web.json_response(
                        {"error": "Could not extract valid YAML from response"}, 
                        status=500
                    )
                
                _LOGGER.info("Successfully generated dashboard configuration")
                
                return web.json_response({
                    "yaml": yaml_config,
                    "entities_analyzed": len(enriched_entities),
                    "agent_used": agent_id,
                })
                
            except ServiceNotFound:
                return web.json_response(
                    {"error": "Conversation service not available"}, 
                    status=503
                )
            except Exception as e:
                _LOGGER.error("Error calling conversation service: %s", str(e))
                return web.json_response(
                    {"error": f"Conversation service error: {str(e)}"}, 
                    status=500
                )
                
        except json.JSONDecodeError:
            return web.json_response(
                {"error": "Invalid JSON in request body"}, 
                status=400
            )
        except Exception as e:
            _LOGGER.error("Unexpected error in dashboard generation: %s", str(e))
            return web.json_response(
                {"error": f"Internal server error: {str(e)}"}, 
                status=500
            )

    def _extract_yaml_from_response(self, response_text: str) -> str | None:
        """
        Extract YAML configuration from the AI response.
        
        The AI might wrap the YAML in markdown code blocks or add explanatory text.
        This method tries to extract the clean YAML configuration.
        """
        # Try to find YAML wrapped in code blocks
        import re
        
        # Pattern 1: YAML wrapped in ```yaml or ```
        yaml_pattern = r'```(?:yaml|yml)?\s*\n(.*?)\n```'
        match = re.search(yaml_pattern, response_text, re.DOTALL | re.IGNORECASE)
        
        if match:
            return match.group(1).strip()
        
        # Pattern 2: Look for lines starting with common YAML keys
        lines = response_text.split('\n')
        yaml_lines = []
        in_yaml = False
        
        for line in lines:
            stripped = line.strip()
            
            # Start of YAML (common top-level keys)
            if any(stripped.startswith(key + ':') for key in ['title', 'type', 'path', 'cards', 'icon', 'badges']):
                in_yaml = True
            
            # Stop if we hit markdown or explanatory text
            if in_yaml and (stripped.startswith('#') and not stripped.startswith('# ') or 
                           stripped.startswith('Note:') or stripped.startswith('This ')):
                break
            
            if in_yaml:
                yaml_lines.append(line)
        
        if yaml_lines:
            return '\n'.join(yaml_lines).strip()
        
        # Pattern 3: If no code blocks, try to extract everything that looks like YAML
        # This is a fallback for cases where the AI doesn't use code blocks
        yaml_candidates = []
        for line in lines:
            if ':' in line and not line.strip().startswith('#') and not any(
                word in line.lower() for word in ['here', 'this', 'configuration', 'example', 'note']
            ):
                yaml_candidates.append(line)
        
        if yaml_candidates:
            return '\n'.join(yaml_candidates).strip()
        
        # If we can't extract structured YAML, return the original response
        # and let the frontend handle the parsing
        return response_text.strip() 