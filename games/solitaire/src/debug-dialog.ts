import { createCloseDialogButton, createThemeButtons, GameButton, ThemeButton } from './button';
import { DefaultDialogRenderConfig } from './dialog';
import { RuleComponent } from './rule-component';
import { RuleNames } from './rules';
import { State } from './state';
import { Coordinates, GameComponent } from './types';
import { drawRoundedRect, printText } from './util';

export class DebugDialog extends GameComponent {
    textLines: string[] = [];
    buttons: GameButton[] = [];
    themeButtons: ThemeButton[] = [];
    tabButtons: GameButton[] = [];
    closeDialogButton: GameButton;
    currentTab: string = 'debug-about-tab';

    stats: string[] = [];

    constructor(coordinates: Coordinates) {
        super(coordinates);

        this.renderConfig = DefaultDialogRenderConfig;

        this.closeDialogButton = createCloseDialogButton();

        this.createTabs();

        this.onAboutTabButtonClick();

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
                this.currentTab = b.id;
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

        if (this.currentTab === 'debug-debug-tab') {
            this.stats = [
                `Piles: ${State.getPileContainer().piles.length}`,
                `Shuffles: ${State.getPlayer().shufflesRemaining}`,
                `Play Pile Size: ${State.getPlayer().playPileVisibleSize}`,
                `Draw Pile Size: ${State.getPlayer().playPileDrawSize}`
            ];
        }
    }

    render(): void {
        this.renderDialogBackground();

        this.tabButtons.forEach(b => {
            b.render();

            //draw a white box under the current tab
            if (b.id === this.currentTab) {
                this.renderTabHightlight(b);
            }
        });

        //render horizontal white line under tabs
        State.getCtx().save();
        State.getCtx().fillStyle = State.getTheme().base;
        State.getCtx().fillRect(
            this.coordinates.x,
            this.coordinates.y + 90,
            DefaultDialogRenderConfig.size.width,
            5
        );
        State.getCtx().restore();

        let buttonX = this.coordinates.x + 40;
        let buttonY = this.coordinates.y + 160;
        this.buttons.forEach(b => {
            b.render({ x: buttonX, y: buttonY });
            buttonX += b.size.width + 20;

            // Check if the next button would overflow the container
            if (
                buttonX + b.size.width >
                this.coordinates.x + DefaultDialogRenderConfig.size.width - 20
            ) {
                buttonX = this.coordinates.x + 40; // Reset x to the start of the next line
                buttonY += b.size.height + 20; // Move y down by the height of the button plus some gap
            }
        });

        this.themeButtons.forEach(b => {
            b.render();
        });

        this.closeDialogButton.render();

        if (this.textLines?.length > 0) {
            this.textLines.forEach((line, index) => {
                printText(line, this.coordinates.x + 40, this.coordinates.y + 140 + index * 40, 30);
            });
        }

        if (this.stats?.length > 0) {
            this.stats.forEach((line, index) => {
                printText(
                    line,
                    this.coordinates.x + 40,
                    buttonY + this.buttons[0].size.height + 40 + index * 40,
                    30
                );
            });
        }
    }

    private renderTabHightlight(b: GameButton) {
        const ctx = State.getCtx();
        ctx.save();

        const x = b.coordinates.x;
        const y = b.coordinates.y + b.size.height + 10;
        const width = b.size.width;
        const height = 10;
        const radius = 5; // Radius for rounded corners

        // Draw the filled rectangle with rounded top corners
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arcTo(x + width, y, x + width, y + radius, radius);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y + radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.closePath();

        ctx.fillStyle = State.getTheme().base;
        ctx.fill();

        ctx.restore();
    }

    private renderDialogBackground(): void {
        const ctx = State.getCtx();
        ctx.save();

        const x = this.coordinates.x;
        const y = this.coordinates.y;
        const width = DefaultDialogRenderConfig.size.width;
        const height = DefaultDialogRenderConfig.size.height;
        const radius = 10; // Radius for rounded corners

        // Draw the filled rectangle with rounded corners
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arcTo(x + width, y, x + width, y + radius, radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        ctx.lineTo(x + radius, y + height);
        ctx.arcTo(x, y + height, x, y + height - radius, radius);
        ctx.lineTo(x, y + radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.closePath();

        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fill();

        // Draw the green outline
        ctx.strokeStyle = State.getTheme().base;
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.restore();
    }

    private resetDialog(): void {
        this.textLines = [];
        this.stats = [];
        this.buttons = [];
        this.themeButtons = [];
    }

    private onThemeTabButtonClick(): void {
        this.textLines = ['Select a theme'];
        this.themeButtons = createThemeButtons();
    }

    private onRulesTabButtonClick(): void {
        this.textLines = ['Use this menu to turn rules on and off'];
        this.buttons.push(
            this.createTabButton({
                text: 'Flush',
                id: 'flush'
            })
        );
        this.buttons.push(
            this.createTabButton({
                text: 'Free',
                id: 'free'
            })
        );
        this.buttons.push(
            this.createTabButton({
                text: 'Klondike',
                id: 'klondike'
            })
        );
        this.buttons.push(
            this.createTabButton({
                text: 'Reverse Klondike',
                id: 'reverse-klondike'
            })
        );
        this.buttons.push(
            this.createTabButton({
                text: 'Same Value',
                id: 'same-value'
            })
        );
    }

    private onDebugTabButtonClick(): void {
        this.textLines = ['Use this menu to change game state and settings'];
        this.buttons.push(
            this.createTabButton({
                text: 'Remove Pile',
                id: 'remove-pile'
            })
        );
        this.buttons.push(
            this.createTabButton({
                text: 'Add Pile',
                id: 'add-pile'
            })
        );
        this.buttons.push(
            this.createTabButton({
                text: 'Draw Size -',
                id: 'decrement-draw-size'
            })
        );
        this.buttons.push(
            this.createTabButton({
                text: 'Draw Size +',
                id: 'increment-draw-size'
            })
        );
        this.buttons.push(
            this.createTabButton({
                text: 'Shuffles -',
                id: 'decrement-shuffles'
            })
        );
        this.buttons.push(
            this.createTabButton({
                text: 'Shuffles +',
                id: 'increment-shuffles'
            })
        );
        this.buttons.push(
            this.createTabButton({
                text: 'Play Pile -',
                id: 'decrement-play-pile'
            })
        );
        this.buttons.push(
            this.createTabButton({
                text: 'Play Pile +',
                id: 'increment-play-pile'
            })
        );
    }

    private onAboutTabButtonClick(): void {
        this.textLines = [
            'This game is currently in development by Rich McLaughlin',
            "I don't know what platforms this will be on yet.",
            'If you stumble upon this game, well good luck!',
            '',
            'Check out Opposwitch on Xbox!'
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
}
