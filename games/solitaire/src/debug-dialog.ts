import { createCloseDialogButton, createThemeButtons, GameButton, ThemeButton } from './button';
import { DefaultDialogRenderConfig } from './dialog';
import { RuleComponent } from './rule-component';
import { RuleNames } from './rules';
import { State } from './state';
import { Coordinates, GameComponent } from './types';
import { printText } from './util';

export class DebugDialog extends GameComponent {
    textLines: string[] = [];
    buttons: GameButton[] = [];
    themeButtons: ThemeButton[] = [];
    tabButtons: GameButton[] = [];
    closeDialogButton: GameButton;

    constructor(coordinates: Coordinates) {
        super(coordinates);

        this.renderConfig = DefaultDialogRenderConfig;

        this.closeDialogButton = createCloseDialogButton();

        this.createTabs();

        this.onThemeTabButtonClick();

        State.setDialogOpen(true);
    }

    update(): void {
        this.buttons.forEach(b => {
            b.update();

            if (b.isClicked()) {
                switch (b.id) {
                    case 'free':
                        State.toggleRule(RuleNames.free);
                        this.toggleRuleComponent(RuleNames.free);
                        break;
                    case 'klondike':
                        State.toggleRule(RuleNames.klondike);
                        this.toggleRuleComponent(RuleNames.klondike);
                        break;
                    case 'reverse-klondike':
                        State.toggleRule(RuleNames.reverseKlondike);
                        this.toggleRuleComponent(RuleNames.reverseKlondike);
                        break;
                    case 'flush':
                        State.toggleRule(RuleNames.flush);
                        this.toggleRuleComponent(RuleNames.flush);
                        break;
                    case 'same-value':
                        State.toggleRule(RuleNames.sameValue);
                        this.toggleRuleComponent(RuleNames.sameValue);
                        break;
                    case 'increment-draw-size':
                        State.getPlayer().incrementPlayPileDrawSize();
                        break;
                    case 'decrement-draw-size':
                        State.getPlayer().decrementPlayPileDrawSize();
                        break;
                    case 'increment-shuffles':
                        State.getPlayer().incrementShuffles();
                        break;
                    case 'decrement-shuffles':
                        State.getPlayer().decrementShuffles();
                        break;
                    case 'increment-play-pile':
                        State.getPlayer().incrementPlayPileVisibleSize();
                        break;
                    case 'decrement-play-pile':
                        State.getPlayer().decrementPlayPileVisibleSize();
                        break;
                    case 'add-pile':
                        State.getPileContainer().createPile();
                        break;
                    case 'remove-pile':
                        State.getPileContainer().removePile();
                        break;
                    default:
                        break;
                }
            }
        });

        this.tabButtons.forEach(b => {
            b.update();

            if (b.isClicked()) {
                this.resetDialog();
                switch (b.id) {
                    case 'debug-themes-tab':
                        this.onThemeTabButtonClick();
                        break;
                    case 'debug-rules-tab':
                        this.onRulesTabButtonClick();
                        break;
                    case 'debug-debug-tab':
                        this.onDebugTabButtonClick();
                        break;
                    case 'debug-about-tab':
                        this.onAboutTabButtonClick();
                        break;
                    case 'debug-how-to-play-tab':
                        this.onHowToPlayTabButtonClick();
                        break;
                    case 'debug-reload-tab':
                        window.location.reload();
                        break;
                    default:
                        break;
                }
            }
        });

        this.themeButtons.forEach(b => {
            b.update();
        });

        this.closeDialogButton.update();
    }

    render(): void {
        this.renderDialogBackground();

        this.tabButtons.forEach(b => {
            b.render();
        });

        this.buttons.forEach(b => {
            b.render();
        });

        this.themeButtons.forEach(b => {
            b.render();
        });

        this.closeDialogButton.render();

        if (this.textLines?.length > 0) {
            this.textLines.forEach((line, index) => {
                printText(line, this.coordinates.x + 20, this.coordinates.y + 120 + index * 40, 30);
            });
        }
    }

    private renderDialogBackground(): void {
        State.getCtx().save();

        State.getCtx().fillStyle = 'rgba(0, 0, 0, 0.9)';
        State.getCtx().fillRect(
            this.coordinates.x,
            this.coordinates.y,
            DefaultDialogRenderConfig.size.width,
            DefaultDialogRenderConfig.size.height
        );

        State.getCtx().restore();
    }

    private resetDialog(): void {
        this.textLines = [];
        this.buttons = [];
        this.themeButtons = [];
    }

    private onThemeTabButtonClick(): void {
        this.textLines = ['Select a theme'];
        this.themeButtons = createThemeButtons();
    }

    private onRulesTabButtonClick(): void {
        this.textLines = ['Use this menu to turn rules on and off'];
        this.buttons.push(this.createFlushButton());
        this.buttons.push(this.createFreeButton());
        this.buttons.push(this.createKlondikeButton());
        this.buttons.push(this.createReverseKlondikeButton());
        this.buttons.push(this.createSameValueButton());
    }

    private onDebugTabButtonClick(): void {
        this.textLines = ['Use this menu to change game state and settings'];
        this.buttons.push(this.createRemovePileButton());
        this.buttons.push(this.createAddPileButton());
        this.buttons.push(this.createDecrementDrawSizeButton());
        this.buttons.push(this.createIncrementDrawSizeButton());
        this.buttons.push(this.createDecrementShufflesButton());
        this.buttons.push(this.createIncrementShufflesButton());
        this.buttons.push(this.createDecrementPlayPileButton());
        this.buttons.push(this.createIncrementPlayPileButton());
    }

    private onAboutTabButtonClick(): void {
        this.textLines = [
            'This game is currently in development by Rich McLaughlin',
            "I don't know what platforms this will be on yet.",
            'If you stumble upon this game, well good luck!'
        ];
    }

    private onHowToPlayTabButtonClick(): void {
        this.textLines = [
            'This game is based on solitaire, but the rules can change as you play',
            'You need to score the minimum points to beat a level',
            'For each level, the deck is re-shuffled and the points increase',
            'In between levels, you will get to pick a rule or deck enhancement',
            'Something something once I have bonuses setup'
        ];
    }

    private createTabs(): void {
        const themeTab = this.createTabButton({
            text: 'Themes',
            id: 'debug-themes-tab',
            x: this.coordinates.x + 20,
            y: this.coordinates.y + 20
        });

        this.tabButtons.push(themeTab);

        const rulesTab = this.createTabButton({
            text: 'Rules',
            id: 'debug-rules-tab',
            x: themeTab.coordinates.x + 20 + themeTab.size.width,
            y: this.coordinates.y + 20
        });

        this.tabButtons.push(rulesTab);

        const debugTab = this.createTabButton({
            text: 'Debug',
            id: 'debug-debug-tab',
            x: rulesTab.coordinates.x + 20 + rulesTab.size.width,
            y: this.coordinates.y + 20
        });

        this.tabButtons.push(debugTab);

        const aboutTab = this.createTabButton({
            text: 'About',
            id: 'debug-about-tab',
            x: debugTab.coordinates.x + 20 + debugTab.size.width,
            y: this.coordinates.y + 20
        });

        this.tabButtons.push(aboutTab);

        const howToPlay = this.createTabButton({
            text: 'How To Play',
            id: 'debug-how-to-play-tab',
            x: aboutTab.coordinates.x + 20 + aboutTab.size.width,
            y: this.coordinates.y + 20
        });

        this.tabButtons.push(howToPlay);

        const reloadTab = this.createTabButton({
            text: 'Reload',
            id: 'debug-reload-tab',
            x: howToPlay.coordinates.x + 20 + howToPlay.size.width,
            y: this.coordinates.y + 20
        });

        this.tabButtons.push(reloadTab);
    }

    private createTabButton(params: {
        text: string;
        id: string;
        x?: number;
        y?: number;
    }): GameButton {
        const ctx = State.getCtx();
        const padding = 20; // Padding for the button

        ctx.font = '30px New-Amsterdam';
        const textMetrics = ctx.measureText(params.text);
        const textWidth = textMetrics.width;
        const buttonWidth = textWidth + padding;
        const buttonHeight = 50;

        return new GameButton(
            { x: params.x, y: params.y },
            { width: buttonWidth, height: buttonHeight },
            params.id,
            params.text,
            padding
        );
    }

    private toggleRuleComponent(ruleName: RuleNames): void {
        const ruleComponents = State.getRuleComponents();
        const rc = ruleComponents.find(r => r.rule === ruleName);

        if (rc) {
            State.removeRuleComponent(rc);
        } else {
            State.addRuleComponent(new RuleComponent({ rule: ruleName }));
        }
    }

    private createDecrementPlayPileButton() {
        return this.createTabButton({
            text: 'Play Pile -',
            id: 'decrement-play-pile',
            x: 200,
            y: 470
        });
    }

    private createIncrementPlayPileButton() {
        return this.createTabButton({
            text: 'Play Pile +',
            id: 'increment-play-pile',
            x: 540,
            y: 470
        });
    }

    private createAddPileButton() {
        return this.createTabButton({
            text: 'Add Pile',
            id: 'add-pile',
            x: 200,
            y: 260
        });
    }

    private createRemovePileButton() {
        return this.createTabButton({
            text: 'Remove Pile',
            id: 'remove-pile',
            x: 540,
            y: 260
        });
    }

    private createDecrementDrawSizeButton() {
        return this.createTabButton({
            text: 'Draw Size -',
            id: 'decrement-draw-size',
            x: 200,
            y: 330
        });
    }

    private createIncrementDrawSizeButton() {
        return this.createTabButton({
            text: 'Draw Size +',
            id: 'increment-draw-size',
            x: 540,
            y: 330
        });
    }

    private createDecrementShufflesButton() {
        return this.createTabButton({
            text: 'Shuffles -',
            id: 'decrement-shuffles',
            x: 200,
            y: 400
        });
    }

    private createIncrementShufflesButton() {
        return this.createTabButton({
            text: 'Shuffles +',
            id: 'increment-shuffles',
            x: 540,
            y: 400
        });
    }

    private createFlushButton() {
        return this.createTabButton({
            text: 'Flush',
            id: 'flush',
            x: 200,
            y: 260
        });
    }

    private createFreeButton() {
        return this.createTabButton({
            text: 'Free',
            id: 'free',
            x: 200,
            y: 320
        });
    }

    private createKlondikeButton() {
        return this.createTabButton({
            text: 'Klondike',
            id: 'klondike',
            x: 200,
            y: 380
        });
    }

    private createReverseKlondikeButton() {
        return this.createTabButton({
            text: 'Reverse Klondike',
            id: 'reverse-klondike',
            x: 200,
            y: 440
        });
    }

    private createSameValueButton() {
        return this.createTabButton({
            text: 'Same Value',
            id: 'same-value',
            x: 200,
            y: 500
        });
    }
}
