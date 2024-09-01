import {
    createAddPileButton,
    createCloseDialogButton,
    createDealButton,
    createDecrementDrawSizeButton,
    createDecrementPlayPileButton,
    createDecrementShufflesButton,
    createFlushButton,
    createFreeButtton,
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
    text: string;
    buttons: GameComponent[] = [];
    themeButtons: ThemeButton[] = [];
    tabButtons: GameButton[] = [];
    closeDialogButton: GameButton;

    constructor(coordinates: Coordinates) {
        super(coordinates);

        this.renderConfig = DefaultDialogRenderConfig;

        this.closeDialogButton = createCloseDialogButton();

        this.createTabs();

        // this.buttons.push(createReloadButton());
        // this.buttons.push(createFreeButtton());
        // this.buttons.push(createDealButton());

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

        if (this.text) {
            printText(this.text, this.coordinates.x + 20, this.coordinates.y + 120, 30);
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
        this.text = '';
        this.buttons = [];
        this.themeButtons = [];
    }

    private onThemeTabButtonClick(): void {
        this.themeButtons = createThemeButtons();
    }

    private onRulesTabButtonClick(): void {
        this.buttons.push(createSameValueButton());
        this.buttons.push(createFlushButton());
        this.buttons.push(createKlondikeButton());
        this.buttons.push(createReverseKlondikeButton());
    }

    private onDebugTabButtonClick(): void {
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
        this.text = 'This is a test dialog, this is a game in progress obviously...';
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
