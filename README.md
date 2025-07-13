# Gen-Dash 🚀

**AI-Powered Dashboard Generator for Home Assistant**

Gen-Dash is a powerful HACS integration that leverages Home Assistant's built-in conversation agents to automatically generate beautiful Lovelace dashboards. Simply describe what you want, and Gen-Dash will analyze your entities and create a complete dashboard configuration for you.

## ✨ Features

- **🤖 AI-Powered Generation**: Uses your Home Assistant conversation agents (ChatGPT, Anthropic, etc.)
- **🏠 Smart Entity Analysis**: Automatically analyzes and categorizes all your entities
- **📍 Area Intelligence**: Infers areas for unorganized entities using NLP
- **💬 Chat Interface**: Interactive chat-based dashboard generation
- **📝 Live Preview**: Real-time YAML preview as you generate
- **📋 Easy Export**: One-click copy to clipboard
- **📱 Responsive Design**: Works on desktop and mobile
- **🎨 Modern UI**: Clean, Home Assistant-themed interface

## 📦 Installation

### Method 1: HACS (Recommended)
1. Open HACS in your Home Assistant instance
2. Go to "Integrations" 
3. Click the "+" button and search for "Gen-Dash"
4. Click "Install"
5. Restart Home Assistant

### Method 2: Manual Installation
1. Download the latest release from GitHub
2. Extract the `gen-dash` folder to your `custom_components` directory
3. Restart Home Assistant

## 🚀 Setup

### 1. Configure a Conversation Agent
First, ensure you have a conversation agent configured in Home Assistant:
- **OpenAI**: Configure the OpenAI integration with your API key
- **Anthropic**: Configure the Anthropic integration 
- **Google Generative AI**: Configure the Google integration
- **Local AI**: Set up Ollama or other local AI solutions

### 2. Install Gen-Dash Integration
1. Go to **Settings** → **Devices & Services**
2. Click **"+ Add Integration"**
3. Search for **"Gen-Dash"**
4. Select your preferred conversation agent from the dropdown
5. Click **"Submit"**

### 3. Build the Frontend (Development)
If you're installing from source:
```bash
cd custom_components/gen_dash/frontend
npm install
npm run build
```

## 🎯 Usage

### Adding the Card to Your Dashboard

1. **Edit your dashboard** in Lovelace
2. **Add a new card**
3. **Choose "Custom: Gen-Dash Card"**
4. **Configure the card** (optional):
   ```yaml
   type: gen-dash-card
   title: "AI Dashboard Generator"
   show_header: true
   ```

### Generating Dashboards

1. **Describe your dashboard** in natural language:
   - "Create a dashboard for my living room with lights and media controls"
   - "Make a security dashboard with all my cameras and sensors"
   - "Generate a climate control dashboard for upstairs"

2. **Watch the magic happen**:
   - Gen-Dash analyzes your entities
   - The AI generates appropriate card configurations
   - Live preview appears in real-time

3. **Copy and use**:
   - Click "Copy YAML" to copy the generated configuration
   - Paste into a new dashboard view
   - Enjoy your AI-generated dashboard!

## 🔧 Configuration

### Card Configuration
```yaml
type: gen-dash-card
title: "Custom Title"              # Optional: Card title
show_header: true                  # Optional: Show/hide header
config_entry_id: "abc123"          # Optional: Specific integration instance
```

### Integration Configuration
- **Agent Selection**: Choose your preferred conversation agent
- **Multiple Instances**: Configure multiple instances with different agents
- **Entity Analysis**: Automatic entity categorization and area inference

## 🧠 How It Works

### Entity Analysis
Gen-Dash uses advanced NLP techniques to analyze your entities:
- **Official Areas**: Uses existing area assignments
- **Smart Inference**: Infers areas from entity names and friendly names
- **Keyword Matching**: Recognizes common room indicators
- **Pattern Recognition**: Identifies naming conventions

### AI Prompting
The integration creates comprehensive prompts that include:
- **System Instructions**: Dashboard design guidelines
- **Entity Data**: Complete entity information with areas
- **Card Recommendations**: Appropriate card types for each entity
- **Best Practices**: Modern Lovelace patterns

### Dashboard Generation
Generated dashboards feature:
- **Modern Cards**: Tile, area, and mushroom cards
- **Logical Grouping**: Entities grouped by room/area
- **Responsive Layout**: Works on all screen sizes
- **Visual Appeal**: Clean, professional appearance

## 🎨 Examples

### Simple Request
**Input**: "Create a dashboard for my bedroom"
**Output**: Dashboard with bedroom lights, climate, and sensors

### Complex Request
**Input**: "Make a security dashboard with cameras, motion sensors, and door locks, organized by area"
**Output**: Multi-area security dashboard with appropriate cards

### Specific Requirements
**Input**: "Create a media dashboard with all my speakers and TVs, using tile cards"
**Output**: Tile-based media control dashboard

## 🔍 Troubleshooting

### Common Issues

**Q: "No conversation agents found"**
A: Configure a conversation agent (OpenAI, Anthropic, etc.) first

**Q: "Frontend not loading"**
A: Ensure you've built the frontend: `npm run build`

**Q: "Generated YAML is invalid"**
A: Try a more specific prompt or check your conversation agent

**Q: "Entities not appearing"**
A: Verify entity names and areas in your Home Assistant

### Debug Mode
Enable debug logging:
```yaml
logger:
  default: info
  logs:
    custom_components.gen_dash: debug
```

## 📄 API Reference

### Endpoint: `/api/gen_dash/generate`
**Method**: POST
**Body**:
```json
{
  "prompt": "Create a dashboard for my kitchen",
  "config_entry_id": "your_config_entry_id"
}
```

**Response**:
```json
{
  "yaml": "# Generated dashboard YAML...",
  "entities_analyzed": 42,
  "agent_used": "conversation.gpt_4"
}
```

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Home Assistant team for the excellent platform
- The community for inspiration and feedback
- AI providers for making this possible

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/gen-dash/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/gen-dash/discussions)
- **Community**: [Home Assistant Community](https://community.home-assistant.io/)

---

**Made with ❤️ for the Home Assistant community** 