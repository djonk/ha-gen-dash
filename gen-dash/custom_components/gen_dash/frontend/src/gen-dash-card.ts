/**
 * Gen-Dash Card - AI-powered dashboard generator for Home Assistant
 * 
 * This Lovelace card provides a chat interface to generate dashboard
 * configurations using Home Assistant's conversation agents.
 */
import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCard, LovelaceCardConfig } from 'custom-card-helpers';

// Define the card configuration interface
interface GenDashCardConfig extends LovelaceCardConfig {
  type: 'gen-dash-card';
  title?: string;
  config_entry_id?: string;
  agent_id?: string;
  show_header?: boolean;
  compact_mode?: boolean;
}

// Define message interface for chat
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

// Define the API response interface
interface GenerationResponse {
  yaml: string;
  entities_analyzed: number;
  agent_used: string;
}

@customElement('gen-dash-card')
export class GenDashCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: GenDashCardConfig;

  // Chat state
  @state() private _conversationHistory: ChatMessage[] = [];
  @state() private _currentMessage: string = '';
  @state() private _isLoading: boolean = false;
  @state() private _generatedYaml: string = '';
  @state() private _error: string | null = null;

  // UI state
  @state() private _showCopySuccess: boolean = false;
  @state() private _entitiesAnalyzed: number = 0;
  @state() private _agentUsed: string = '';

  static styles = css`
    :host {
      display: block;
      padding: 16px;
      background: var(--card-background-color);
      border-radius: var(--ha-card-border-radius);
      box-shadow: var(--ha-card-box-shadow);
      position: relative;
    }

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--divider-color);
    }

    .header h2 {
      margin: 0;
      font-size: 1.2em;
      color: var(--primary-text-color);
    }

    .main-container {
      display: flex;
      gap: 16px;
      min-height: 400px;
    }

    .left-pane {
      flex: 1;
      min-width: 300px;
      display: flex;
      flex-direction: column;
    }

    .right-pane {
      flex: 1;
      min-width: 300px;
      display: flex;
      flex-direction: column;
    }

    .chat-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      overflow: hidden;
    }

    .chat-header {
      background: var(--secondary-background-color);
      padding: 12px;
      border-bottom: 1px solid var(--divider-color);
      font-weight: 500;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      max-height: 300px;
      min-height: 200px;
    }

    .message {
      margin-bottom: 12px;
      padding: 8px 12px;
      border-radius: 12px;
      max-width: 80%;
      word-wrap: break-word;
    }

    .message.user {
      background: var(--primary-color);
      color: var(--text-primary-color);
      margin-left: auto;
    }

    .message.assistant {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .message.system {
      background: var(--warning-color);
      color: var(--text-primary-color);
      font-style: italic;
    }

    .message.loading {
      opacity: 0.7;
    }

    .message .timestamp {
      font-size: 0.8em;
      opacity: 0.7;
      margin-top: 4px;
    }

    .chat-input {
      display: flex;
      padding: 12px;
      border-top: 1px solid var(--divider-color);
      background: var(--card-background-color);
      gap: 8px;
    }

    .chat-input input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
    }

    .chat-input input:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .chat-input button {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }

    .chat-input button:hover {
      background: var(--primary-color-dark);
    }

    .chat-input button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .preview-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      overflow: hidden;
    }

    .preview-header {
      background: var(--secondary-background-color);
      padding: 12px;
      border-bottom: 1px solid var(--divider-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .preview-title {
      font-weight: 500;
    }

    .preview-actions {
      display: flex;
      gap: 8px;
    }

    .preview-actions button {
      padding: 4px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s;
    }

    .preview-actions button:hover {
      background: var(--secondary-background-color);
    }

    .preview-actions button.success {
      background: var(--success-color);
      color: var(--text-primary-color);
      border-color: var(--success-color);
    }

    .preview-content {
      flex: 1;
      padding: 12px;
      overflow: auto;
    }

    .yaml-display {
      background: var(--code-editor-background-color, #f5f5f5);
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      padding: 12px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.4;
      white-space: pre-wrap;
      word-wrap: break-word;
      color: var(--primary-text-color);
      min-height: 200px;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--secondary-text-color);
    }

    .empty-state ha-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .error-message {
      background: var(--error-color);
      color: var(--text-primary-color);
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
    }

    .stats {
      font-size: 0.9em;
      color: var(--secondary-text-color);
      margin-top: 8px;
    }

    .loading-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--secondary-text-color);
    }

    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid var(--secondary-text-color);
      border-top: 2px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .main-container {
        flex-direction: column;
      }
      
      .left-pane, .right-pane {
        min-width: auto;
      }
    }
  `;

  public setConfig(config: GenDashCardConfig): void {
    this.config = config;
    
    // Initialize with a welcome message
    if (this._conversationHistory.length === 0) {
      this._conversationHistory = [
        {
          id: 'welcome',
          role: 'system',
          content: 'Welcome to Gen-Dash! Describe the dashboard you want to create, and I\'ll generate it for you using your Home Assistant entities.',
          timestamp: new Date(),
        }
      ];
    }
  }

  protected render() {
    if (!this.config) {
      return html`<div class="error-message">Invalid configuration</div>`;
    }

    return html`
      ${this.config.show_header !== false ? html`
        <div class="header">
          <h2>${this.config.title || 'Gen-Dash'}</h2>
        </div>
      ` : ''}
      
      ${this._error ? html`
        <div class="error-message">
          <strong>Error:</strong> ${this._error}
        </div>
      ` : ''}

      <div class="main-container">
        <div class="left-pane">
          <div class="chat-container">
            <div class="chat-header">
              Chat Interface
              ${this._isLoading ? html`
                <div class="loading-indicator">
                  <div class="loading-spinner"></div>
                  <span>Generating...</span>
                </div>
              ` : ''}
            </div>
            
            <div class="chat-messages" id="chatMessages">
              ${this._conversationHistory.map(message => html`
                <div class="message ${message.role} ${message.isLoading ? 'loading' : ''}">
                  <div class="content">${message.content}</div>
                  <div class="timestamp">
                    ${message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              `)}
            </div>
            
            <div class="chat-input">
              <input
                type="text"
                placeholder="Describe your dashboard..."
                .value=${this._currentMessage}
                @input=${this._handleInputChange}
                @keydown=${this._handleKeyDown}
                ?disabled=${this._isLoading}
              />
              <button
                @click=${this._sendMessage}
                ?disabled=${this._isLoading || !this._currentMessage.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>

        <div class="right-pane">
          <div class="preview-container">
            <div class="preview-header">
              <div class="preview-title">Live Preview</div>
              <div class="preview-actions">
                ${this._generatedYaml ? html`
                  <button
                    @click=${this._copyToClipboard}
                    class=${this._showCopySuccess ? 'success' : ''}
                  >
                    ${this._showCopySuccess ? 'Copied!' : 'Copy YAML'}
                  </button>
                  <!-- Future: Commit to Dashboard button -->
                  <!-- <button @click=${this._commitToDashboard}>
                    Commit to Dashboard
                  </button> -->
                ` : ''}
              </div>
            </div>
            
            <div class="preview-content">
              ${this._generatedYaml ? html`
                <div class="yaml-display">${this._generatedYaml}</div>
                ${this._entitiesAnalyzed > 0 ? html`
                  <div class="stats">
                    Analyzed ${this._entitiesAnalyzed} entities using ${this._agentUsed}
                  </div>
                ` : ''}
              ` : html`
                <div class="empty-state">
                  <ha-icon icon="mdi:view-dashboard-outline"></ha-icon>
                  <div>Generated dashboard YAML will appear here</div>
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _handleInputChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    this._currentMessage = target.value;
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this._sendMessage();
    }
  }

  private async _sendMessage(): Promise<void> {
    if (!this._currentMessage.trim() || this._isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: this._currentMessage,
      timestamp: new Date(),
    };

    // Add user message to history
    this._conversationHistory = [...this._conversationHistory, userMessage];
    const prompt = this._currentMessage;
    this._currentMessage = '';
    
    // Scroll to bottom of chat
    this._scrollToBottom();

    // Generate dashboard
    await this._generateDashboard(prompt);
  }

  private async _generateDashboard(prompt: string): Promise<void> {
    this._isLoading = true;
    this._error = null;

    try {
      // Get config entry ID from the config or find it
      const configEntryId = await this._getConfigEntryId();
      
      if (!configEntryId) {
        throw new Error('No Gen-Dash integration found. Please configure the integration first.');
      }

      const response = await fetch('/api/gen_dash/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          config_entry_id: configEntryId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result: GenerationResponse = await response.json();
      
      // Update the generated YAML
      this._generatedYaml = result.yaml;
      this._entitiesAnalyzed = result.entities_analyzed;
      this._agentUsed = result.agent_used;

      // Add assistant response to chat
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `✅ Dashboard generated successfully! I analyzed ${result.entities_analyzed} entities and created a configuration using ${result.agent_used}. Check the preview on the right.`,
        timestamp: new Date(),
      };

      this._conversationHistory = [...this._conversationHistory, assistantMessage];
      
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `❌ Error generating dashboard: ${this._error}`,
        timestamp: new Date(),
      };

      this._conversationHistory = [...this._conversationHistory, errorMessage];
    } finally {
      this._isLoading = false;
      this._scrollToBottom();
    }
  }

  private async _getConfigEntryId(): Promise<string | null> {
    // If explicitly configured, use that
    if (this.config.config_entry_id) {
      return this.config.config_entry_id;
    }

    // Otherwise, try to find a Gen-Dash config entry
    try {
      const response = await this.hass.callWS({
        type: 'config/config_entries/list',
      });

      const genDashEntries = response.filter((entry: any) => entry.domain === 'gen_dash');
      
      if (genDashEntries.length > 0) {
        return genDashEntries[0].entry_id;
      }
    } catch (error) {
      console.error('Error finding config entry:', error);
    }

    return null;
  }

  private async _copyToClipboard(): Promise<void> {
    if (!this._generatedYaml) return;

    try {
      await navigator.clipboard.writeText(this._generatedYaml);
      this._showCopySuccess = true;
      
      // Reset the success state after 2 seconds
      setTimeout(() => {
        this._showCopySuccess = false;
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback: create a temporary textarea and copy from it
      const textarea = document.createElement('textarea');
      textarea.value = this._generatedYaml;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      
      this._showCopySuccess = true;
      setTimeout(() => {
        this._showCopySuccess = false;
      }, 2000);
    }
  }

  private _scrollToBottom(): void {
    // Use setTimeout to ensure DOM is updated
    setTimeout(() => {
      const chatMessages = this.shadowRoot?.getElementById('chatMessages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 0);
  }

  // Future implementation for committing to dashboard
  // private async _commitToDashboard(): Promise<void> {
  //   if (!this._generatedYaml) return;
  //   
  //   try {
  //     // Parse the YAML and create a new dashboard view
  //     const yamlConfig = yaml.parse(this._generatedYaml);
  //     
  //     // Call the Lovelace config save websocket command
  //     await this.hass.callWS({
  //       type: 'lovelace/config/save',
  //       config: yamlConfig,
  //     });
  //     
  //     // Show success message
  //     this._showSuccessMessage('Dashboard committed successfully!');
  //   } catch (error) {
  //     this._error = `Failed to commit dashboard: ${error}`;
  //   }
  // }

  public getCardSize(): number {
    return 6; // Lovelace card size
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    
    if (changedProps.has('_conversationHistory')) {
      this._scrollToBottom();
    }
  }
}

// Register the custom element
customElements.define('gen-dash-card', GenDashCard);

// Add to window for Lovelace card registration
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'gen-dash-card',
  name: 'Gen-Dash Card',
  description: 'AI-powered dashboard generator',
  preview: true,
  documentationURL: 'https://github.com/your-repo/gen-dash',
});

// Register card with Lovelace
console.info(
  '%c GEN-DASH-CARD %c 1.0.0 ',
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
); 