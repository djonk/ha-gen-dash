"""Config flow for Gen-Dash integration."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers.selector import SelectSelector, SelectSelectorConfig, SelectSelectorMode

from .const import DOMAIN, CONF_AGENT_ID

_LOGGER = logging.getLogger(__name__)


class ConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Gen-Dash."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            # Validate the selected agent exists
            agent_id = user_input[CONF_AGENT_ID]
            agent_state = self.hass.states.get(agent_id)
            
            if agent_state is None:
                errors[CONF_AGENT_ID] = "agent_not_found"
            else:
                # Create the config entry
                return self.async_create_entry(
                    title=f"Gen-Dash ({agent_state.attributes.get('friendly_name', agent_id)})",
                    data=user_input,
                )

        # Get all conversation entities (agents)
        conversation_entities = []
        for entity_id, state in self.hass.states.async_all().items():
            if entity_id.startswith("conversation."):
                friendly_name = state.attributes.get("friendly_name", entity_id)
                conversation_entities.append({
                    "value": entity_id,
                    "label": friendly_name,
                })

        if not conversation_entities:
            return self.async_abort(reason="no_conversation_agents")

        # Create the schema with available conversation agents
        data_schema = vol.Schema({
            vol.Required(CONF_AGENT_ID): SelectSelector(
                SelectSelectorConfig(
                    options=conversation_entities,
                    mode=SelectSelectorMode.DROPDOWN,
                )
            ),
        })

        return self.async_show_form(
            step_id="user",
            data_schema=data_schema,
            errors=errors,
            description_placeholders={
                "agent_count": str(len(conversation_entities))
            },
        ) 