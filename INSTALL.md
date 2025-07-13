# Gen-Dash Quick Installation Guide

## Prerequisites ✅

1. **Home Assistant** with HACS installed
2. **Conversation Agent** configured (OpenAI, Anthropic, Google, etc.)

## Installation Steps 🚀

### 1. Install via HACS (Recommended)
```bash
1. Open HACS → Integrations
2. Search for "Gen-Dash"
3. Install and restart Home Assistant
```

### 2. Manual Installation (Advanced)
```bash
# Copy this entire gen-dash folder to:
# custom_components/gen_dash/

# Build the frontend:
cd custom_components/gen_dash/frontend
npm install
npm run build
```

## Setup Steps 🔧

### 1. Add Integration
1. Go to **Settings** → **Devices & Services**
2. Click **"+ Add Integration"**
3. Search for **"Gen-Dash"**
4. Select your conversation agent
5. Click **"Submit"**

### 2. Add Card to Dashboard
```yaml
type: gen-dash-card
title: "AI Dashboard Generator"
```

## Usage 🎯

1. **Open the card** in your dashboard
2. **Type your request**: "Create a dashboard for my living room"
3. **Copy the generated YAML**
4. **Create a new dashboard view** with the YAML

## Common Issues 🔍

- **No agents found**: Configure OpenAI/Anthropic first
- **Frontend not loading**: Run `npm run build` in the frontend folder
- **YAML errors**: Try more specific prompts

## File Structure 📁

```
gen-dash/
├── hacs.json                          # HACS configuration
├── custom_components/gen_dash/
│   ├── __init__.py                    # Integration setup
│   ├── manifest.json                  # Integration manifest
│   ├── config_flow.py                 # UI configuration
│   ├── const.py                       # Constants
│   ├── entity_analyzer.py             # Entity analysis
│   ├── api.py                         # API endpoints
│   └── frontend/
│       ├── src/gen-dash-card.ts       # Main card component
│       ├── dist/gen-dash-card.js      # Built JavaScript
│       └── package.json               # Dependencies
```

## Ready to Use! 🎉

Your Gen-Dash integration is now ready to generate beautiful dashboards using AI! 