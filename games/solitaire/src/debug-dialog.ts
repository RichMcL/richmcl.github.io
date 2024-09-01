import {
    createAddPileButton,
    createCloseDialogButton,
    createDealButton,
    createDecrementDrawSizeButton,
    createDecrementPlayPileButton,
    createDecrementShufflesButton,
    createFlushButton,
    createFreeButton,
    createIncrementDrawSizeButton,
    createIncrementPlayPileButton,
    createIncrementShufflesButton,
    createKlondikeButton,
    createReloadButton,
    createRemovePileButton,
    createReverseKlondikeButton,
    createSameValueButton,
    createThemeButtons,
    GameButton,
    ThemeButton
} from './button';
import { DefaultDialogRenderConfig } from './dialog';
import { State } from './state';
import { Coordinates, GameComponent } from './types';
import { printText } from './util';

export class DebugDialog extends GameComponent {
    textLines: string[] = [];
    buttons: GameComponent[] = [];
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
        this.buttons.push(createFlushButton());
        this.buttons.push(createFreeButton());
        this.buttons.push(createKlondikeButton());
        this.buttons.push(createReverseKlondikeButton());
        this.buttons.push(createSameValueButton());
    }

    private onDebugTabButtonClick(): void {
        this.textLines = ['Use this menu to change game state and settings'];
        this.buttons.push(createRemovePileButton());
        this.buttons.push(createAddPileButton());
        this.buttons.push(createDecrementDrawSizeButton());
        this.buttons.push(createIncrementDrawSizeButton());
        this.buttons.push(createDecrementShufflesButton());
        this.buttons.push(createIncrementShufflesButton());
        this.buttons.push(createDecrementPlayPileButton());
        this.buttons.push(createIncrementPlayPileButton());
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
        x: number;
        y: number;
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
}
