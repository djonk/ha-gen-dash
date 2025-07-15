"""Config flow for Gen-Dash integration."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.selector import SelectSelector, SelectSelectorConfig, SelectSelectorMode

from .const import DOMAIN, CONF_AGENT_ID

_LOGGER = logging.getLogger(__name__)


@config_entries.HANDLERS.register(DOMAIN)
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
            entity_registry = er.async_get(self.hass)
            agent_id = user_input[CONF_AGENT_ID]
            entry = entity_registry.async_get(agent_id)

            if entry is None:
                errors[CONF_AGENT_ID] = "agent_not_found"
            else:
                title = entry.name or entry.original_name or agent_id
                return self.async_create_entry(
                    title=f"Gen-Dash ({title})",
                    data=user_input,
                )

        # Get all conversation entities (agents)
        entity_registry = er.async_get(self.hass)
        entries = er.async_entries_for_domain(entity_registry, "conversation")
        
        conversation_entities = [
            {"value": entry.entity_id, "label": entry.name or entry.entity_id}
            for entry in entries
        ]

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