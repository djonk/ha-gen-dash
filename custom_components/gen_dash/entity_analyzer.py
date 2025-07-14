"""Entity analyzer for Gen-Dash integration."""
from __future__ import annotations

import logging
import re
from typing import Any, Dict, List

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry, device_registry, entity_registry

_LOGGER = logging.getLogger(__name__)

# Common area keywords for NLP-based inference
AREA_KEYWORDS = {
    "kitchen": ["kitchen", "kitch", "cook", "fridge", "oven", "dishwasher", "microwave"],
    "living_room": ["living", "lr", "lounge", "family", "tv", "sofa", "couch"],
    "bedroom": ["bedroom", "bed", "br", "master", "guest", "sleep"],
    "bathroom": ["bathroom", "bath", "toilet", "shower", "washroom", "restroom"],
    "garage": ["garage", "car", "parking", "workshop"],
    "office": ["office", "desk", "computer", "work", "study"],
    "dining_room": ["dining", "dinner", "eat", "table"],
    "basement": ["basement", "cellar", "downstairs", "lower"],
    "attic": ["attic", "upstairs", "upper", "loft"],
    "outdoor": ["outdoor", "outside", "garden", "yard", "patio", "deck", "pool"],
    "laundry": ["laundry", "wash", "dryer", "washer", "utility"],
    "hallway": ["hallway", "hall", "corridor", "entrance", "entry"],
    "closet": ["closet", "wardrobe", "storage"]
}


class EntityAnalyzer:
    """Analyzes Home Assistant entities and enriches them with area information."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the entity analyzer."""
        self.hass = hass
        self._area_registry = area_registry.async_get(hass)
        self._entity_registry = entity_registry.async_get(hass)
        self._device_registry = device_registry.async_get(hass)

    async def analyze_entities(self) -> List[Dict[str, Any]]:
        """
        Analyze all entities in Home Assistant and return enriched entity data.
        
        This method fetches all entities and enriches them with:
        - Official area_id (if assigned)
        - Inferred area (using NLP on friendly_name and entity_id)
        - Enhanced attributes for dashboard generation
        
        Returns:
            List of enriched entity dictionaries
        """
        enriched_entities = []
        all_states = self.hass.states.async_all()
        
        _LOGGER.info("Analyzing %d entities for dashboard generation", len(all_states))
        
        for state in all_states:
            entity_id = state.entity_id
            
            # Get entity registry entry for additional metadata
            entity_entry = self._entity_registry.async_get(entity_id)
            
            # Get official area_id (if available)
            official_area_id = None
            if entity_entry:
                # Try to get area from entity directly
                if entity_entry.area_id:
                    official_area_id = entity_entry.area_id
                # If not, try to get from device
                elif entity_entry.device_id:
                    device_entry = self._device_registry.async_get(entity_entry.device_id)
                    if device_entry and device_entry.area_id:
                        official_area_id = device_entry.area_id
            
            # Infer area using NLP if no official area is assigned
            inferred_area = None
            if not official_area_id:
                inferred_area = self._infer_area_from_entity(entity_id, state.attributes.get("friendly_name", ""))
            
            # Get area name (for official area)
            area_name = None
            if official_area_id:
                area_entry = self._area_registry.async_get_area(official_area_id)
                if area_entry:
                    area_name = area_entry.name
            
            # Create enriched entity dictionary
            enriched_entity = {
                "entity_id": entity_id,
                "state": state.state,
                "attributes": dict(state.attributes),
                "domain": entity_id.split(".")[0],
                "area_id": official_area_id,
                "area_name": area_name,
                "inferred_area": inferred_area,
                "friendly_name": state.attributes.get("friendly_name", entity_id),
                "last_changed": state.last_changed.isoformat(),
                "last_updated": state.last_updated.isoformat(),
                "primary_function": self._get_primary_function(entity_id),
            }
            
            enriched_entities.append(enriched_entity)
        
        # Sort entities by domain, then by area (official first, then inferred)
        enriched_entities.sort(
            key=lambda x: (
                x["domain"],
                x["area_name"] or x["inferred_area"] or "zz_unassigned",
                x["friendly_name"]
            )
        )
        
        _LOGGER.info(
            "Entity analysis complete. Found %d entities with areas, %d with inferred areas",
            len([e for e in enriched_entities if e["area_id"]]),
            len([e for e in enriched_entities if e["inferred_area"] and not e["area_id"]])
        )
        
        return enriched_entities

    def _infer_area_from_entity(self, entity_id: str, friendly_name: str) -> str | None:
        """
        Infer the area of an entity using NLP techniques on entity_id and friendly_name.
        
        This method uses keyword matching to guess the area based on:
        1. Entity ID patterns (e.g., 'sensor.kitchen_temperature')
        2. Friendly name content (e.g., 'Kitchen Temperature Sensor')
        3. Common naming conventions
        
        Args:
            entity_id: The entity ID to analyze
            friendly_name: The friendly name to analyze
            
        Returns:
            Inferred area name or None if no area can be inferred
        """
        # Combine entity_id and friendly_name for analysis
        # Remove domain prefix and convert to lowercase
        entity_name = entity_id.split(".", 1)[1].lower()
        friendly_lower = friendly_name.lower()
        
        # Text to analyze (prioritize friendly name, fall back to entity name)
        text_to_analyze = f"{friendly_lower} {entity_name}"
        
        # Score each area based on keyword matches
        area_scores = {}
        
        for area_name, keywords in AREA_KEYWORDS.items():
            score = 0
            for keyword in keywords:
                # Check for exact word matches (not substrings)
                if re.search(rf'\b{re.escape(keyword)}\b', text_to_analyze):
                    score += 1
                # Check for partial matches in entity_id (common pattern: room_device)
                elif keyword in entity_name:
                    score += 0.5
        
            if score > 0:
                area_scores[area_name] = score
        
        # Return the area with the highest score
        if area_scores:
            best_area = max(area_scores, key=area_scores.get)
            _LOGGER.debug(
                "Inferred area '%s' for entity '%s' (score: %.1f)",
                best_area, entity_id, area_scores[best_area]
            )
            return best_area
        
        # Special case: check for room abbreviations in entity_id
        # Common patterns: lr_light, br_sensor, kit_temp, etc.
        room_abbreviations = {
            "lr": "living_room",
            "br": "bedroom", 
            "kit": "kitchen",
            "bath": "bathroom",
            "gar": "garage",
            "off": "office",
            "din": "dining_room",
            "base": "basement",
            "out": "outdoor",
            "hall": "hallway"
        }
        
        for abbrev, full_name in room_abbreviations.items():
            if f"{abbrev}_" in entity_name or f"_{abbrev}_" in entity_name:
                _LOGGER.debug(
                    "Inferred area '%s' for entity '%s' (abbreviation: %s)",
                    full_name, entity_id, abbrev
                )
                return full_name
        
        # No area could be inferred
        return None

    def _get_primary_function(self, entity_id: str) -> str:
        """Determine the primary function of an entity."""
        domain = entity_id.split(".")[0]
        if "light" in domain:
            return "light"
        if "switch" in domain:
            return "switch"
        if "sensor" in domain:
            return "sensor"
        if "climate" in domain:
            return "climate"
        if "media_player" in domain:
            return "media_player"
        if "camera" in domain:
            return "camera"
        if "lock" in domain:
            return "lock"
        if "cover" in domain:
            return "cover"
        return "other"