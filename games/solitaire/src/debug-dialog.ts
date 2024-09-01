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
    ThemeButton
} from './button';
import { DefaultDialogRenderConfig } from './dialog';
import { State } from './state';
import { Coordinates, GameComponent } from './types';
import { printText } from './util';

export class DebugDialog extends GameComponent {
    text: string = 'This is a test dialog, this is a game in progress obviously...';
    buttons: GameComponent[] = [];
    themeButtons: ThemeButton[] = [];

    constructor(coordinates: Coordinates) {
        super(coordinates);

        this.buttons.push(createRemovePileButton());
        this.buttons.push(createAddPileButton());
        this.buttons.push(createDecrementDrawSizeButton());
        this.buttons.push(createIncrementDrawSizeButton());
        this.buttons.push(createDecrementShufflesButton());
        this.buttons.push(createIncrementShufflesButton());
        this.buttons.push(createDecrementPlayPileButton());
        this.buttons.push(createIncrementPlayPileButton());
        this.buttons.push(createSameValueButton());
        this.buttons.push(createFlushButton());
        this.buttons.push(createKlondikeButton());
        this.buttons.push(createReverseKlondikeButton());
        this.buttons.push(createReloadButton());
        this.buttons.push(createFreeButtton());
        this.buttons.push(createDealButton());
        this.buttons.push(createCloseDialogButton());

        this.themeButtons = createThemeButtons();

        State.setDialogOpen(true);
    }

    update(): void {
        this.buttons.forEach(b => {
            b.update();
        });

        this.themeButtons.forEach(b => {
            b.update();
        });
    }

    render(): void {
        this.renderDialogBackground();

        //render the buttons
        this.buttons.forEach(b => {
            b.render();
        });

        this.themeButtons.forEach(b => {
            b.render();
        });

        printText(this.text, this.coordinates.x + 20, this.coordinates.y + 50, 30);
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
}
