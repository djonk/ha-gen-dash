/**
 * Gen-Dash Card - AI-powered dashboard generator for Home Assistant
 *
 * This Lovelace card provides a chat interface to generate dashboard
 * configurations using Home Assistant's conversation agents.
 */
import { LitElement, PropertyValues } from 'lit';
import { HomeAssistant, LovelaceCard, LovelaceCardConfig } from 'custom-card-helpers';
interface GenDashCardConfig extends LovelaceCardConfig {
    type: 'gen-dash-card';
    title?: string;
    config_entry_id?: string;
    agent_id?: string;
    show_header?: boolean;
    compact_mode?: boolean;
}
export declare class GenDashCard extends LitElement implements LovelaceCard {
    hass: HomeAssistant;
    config: GenDashCardConfig;
    private _conversationHistory;
    private _currentMessage;
    private _isLoading;
    private _generatedYaml;
    private _error;
    private _showCopySuccess;
    private _entitiesAnalyzed;
    private _agentUsed;
    static styles: import("lit").CSSResult;
    setConfig(config: GenDashCardConfig): void;
    protected render(): import("lit-html").TemplateResult<1>;
    private _handleInputChange;
    private _handleKeyDown;
    private _sendMessage;
    private _generateDashboard;
    private _getConfigEntryId;
    private _copyToClipboard;
    private _scrollToBottom;
    getCardSize(): number;
    protected updated(changedProps: PropertyValues): void;
}
export {};
//# sourceMappingURL=gen-dash-card.d.ts.map