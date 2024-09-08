import { DebugDialog } from './debug-dialog';
import { DeckDialog } from './deck-dialog';
import { DefaultDialogRenderConfig } from './dialog';
import { State } from './state';
import { Theme, Themes } from './theme';
import { Coordinates, GameComponent, RenderConfig, Size } from './types';
import { printText } from './util';

export class GameButton extends GameComponent {
    renderConfig: RenderConfig;
    borderRadius = 5;

    constructor(
        coordinates: Coordinates,
        public size: Size,
        public id: string,
        public text: string,
        public padding: number
    ) {
        super(coordinates);
        this.renderConfig = {
            coordinates,
            size,
            scale: 1
        };
    }

    update(): void {
        if (this.isClicked()) {
            console.log('Button clicked:', this.id);
            switch (this.id) {
                case 'dialog-close':
                    State.removeGameComponentByType(DeckDialog.name);
                    State.removeGameComponentByType(DebugDialog.name);
                    State.removeGameButtonById('dialog-close');
                    State.setDialogOpen(false);
                    break;
                case 'debug-dialog-open':
                    if (State.isDialogOpen()) break;

                    const debugDialog = new DebugDialog(DefaultDialogRenderConfig.coordinates);
                    State.addGameComponent(debugDialog);
                    break;
                case 'deck-dialog-open':
                    if (State.isDialogOpen()) break;

                    const deckDialog = new DeckDialog(
                        DefaultDialogRenderConfig.coordinates,
                        State.getPlayer().drawPile.getRawCards(),
                        State.getPlayer().playPile
                    );
                    State.addGameComponent(deckDialog);
                    break;
            }
        }
    }

    render(coordinates?: Coordinates): void {
        if (coordinates) {
            this.renderConfig.coordinates = coordinates;
        }
        this.renderDropShadow();
        State.getCtx().fillStyle = State.getTheme().base;

        const x = this.renderConfig.coordinates.x;
        const y = this.renderConfig.coordinates.y;
        const width = this.size.width;
        const height = this.size.height;
        const radius = this.borderRadius; // Adjust the radius as needed

        State.getCtx().beginPath();
        State.getCtx().moveTo(x + radius, y);
        State.getCtx().arcTo(x + width, y, x + width, y + height, radius);
        State.getCtx().arcTo(x + width, y + height, x, y + height, radius);
        State.getCtx().arcTo(x, y + height, x, y, radius);
        State.getCtx().arcTo(x, y, x + width, y, radius);
        State.getCtx().closePath();
        State.getCtx().fill();

        printText(
            this.text,
            this.renderConfig.coordinates.x + this.padding / 2,
            this.renderConfig.coordinates.y + this.padding * 1.75
        );

        // Draw a border around the button if it's hovered
        if (this.isHoveredOver()) {
            this.renderOutline();
        }
    }

    renderDropShadow(): void {
        State.getCtx().save();
        State.getCtx().fillStyle = 'rgba(0, 0, 0, 0.3)';

        const x = this.renderConfig.coordinates.x;
        const y = this.renderConfig.coordinates.y;
        const width = this.renderConfig.size.width * this.renderConfig.scale;
        const height = this.renderConfig.size.height * this.renderConfig.scale;
        const radius = this.borderRadius; // Adjust the radius as needed

        // Determine the shadow offset based on the element's position relative to the center
        const shadowOffsetX = 5; // Reduced horizontal offset
        const shadowOffsetY = 5; // Fixed vertical offset

        // Apply the shadow offset
        const shadowX = x + shadowOffsetX;
        const shadowY = y + shadowOffsetY;

        State.getCtx().beginPath();
        State.getCtx().moveTo(shadowX + radius, shadowY);
        State.getCtx().arcTo(shadowX + width, shadowY, shadowX + width, shadowY + height, radius);
        State.getCtx().arcTo(shadowX + width, shadowY + height, shadowX, shadowY + height, radius);
        State.getCtx().arcTo(shadowX, shadowY + height, shadowX, shadowY, radius);
        State.getCtx().arcTo(shadowX, shadowY, shadowX + width, shadowY, radius);
        State.getCtx().closePath();
        State.getCtx().fill();

        State.getCtx().restore();
    }

    renderOutline(): void {
        const x = this.renderConfig.coordinates.x;
        const y = this.renderConfig.coordinates.y;
        const width = this.size.width;
        const height = this.size.height;
        const radius = this.borderRadius; // Use the same border radius as the element

        // Draw the outline with the same rounded corners
        State.getCtx().strokeStyle = 'white';
        State.getCtx().lineWidth = 3;
        State.getCtx().beginPath();
        State.getCtx().moveTo(x + radius, y);
        State.getCtx().arcTo(x + width, y, x + width, y + height, radius);
        State.getCtx().arcTo(x + width, y + height, x, y + height, radius);
        State.getCtx().arcTo(x, y + height, x, y, radius);
        State.getCtx().arcTo(x, y, x + width, y, radius);
        State.getCtx().closePath();
        State.getCtx().stroke();
    }

    reset(): void {}
}

export class ThemeButton extends GameButton {
    constructor(
        coordinates: Coordinates,
        public size: Size,
        public padding: number,
        public theme: Theme
    ) {
        super(coordinates, size, 'theme', '', padding);
        this.renderConfig = {
            coordinates,
            size,
            scale: 1
        };
    }

    update(): void {
        if (this.isClicked()) {
            console.log('Button clicked:', this.id);
            State.setTheme(this.theme);
        }
    }

    render(): void {
        State.getCtx().fillStyle = this.theme.base;
        State.getCtx().fillRect(
            this.coordinates.x,
            this.coordinates.y,
            this.size.width,
            this.size.height
        );

        // Draw a border around the button if it's hovered
        if (this.isHoveredOver()) {
            State.getCtx().strokeStyle = 'white';
            State.getCtx().lineWidth = 3;
            State.getCtx().strokeRect(
                this.coordinates.x,
                this.coordinates.y,
                this.size.width,
                this.size.height
            );
        }
    }
}

export const createReloadButton = () => {
    const ctx = State.getCtx();
    const text = 'RELOAD';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 200;
    const y = 480;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'reload',
        text,
        padding
    );
};

export const createDealButton = () => {
    const ctx = State.getCtx();
    const text = 'DEAL';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 540;
    const y = 480;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'deal',
        text,
        padding
    );
};

// export const createHitButton = () => {
//     const ctx = State.getCtx();
//     const text = 'HIT';
//     const padding = 20; // Padding for the button

//     ctx.font = '30px New-Amsterdam';
//     const textMetrics = ctx.measureText(text);
//     const textWidth = textMetrics.width;
//     const buttonWidth = textWidth + padding;
//     const buttonHeight = 50;
//     const x = 835;
//     const y = 570;

//     return new GameButton(
//         { x, y },
//         { width: buttonWidth, height: buttonHeight },
//         'hit',
//         text,
//         padding
//     );
// };

export const createDeckButton = () => {
    const ctx = State.getCtx();
    const text = 'DECK';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 835;
    const y = 640;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'deck-dialog-open',
        text,
        padding
    );
};

export const createOpenDebugDialogButton = () => {
    const ctx = State.getCtx();
    const text = 'MENU';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 1150;
    const y = 720;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'debug-dialog-open',
        text,
        padding
    );
};

export const createCloseDialogButton = () => {
    const ctx = State.getCtx();
    const text = 'CLOSE';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 1030;
    const y = 605;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'dialog-close',
        text,
        padding
    );
};

export const createThemeButtons = (): ThemeButton[] => {
    const themeButtons: ThemeButton[] = [];
    let i = 0;

    for (const theme of Object.keys(Themes)) {
        const padding = 20; // Padding for the button
        const buttonWidth = 50;
        const buttonHeight = 50;
        const x = 200 + i * (buttonWidth + padding);
        const y = 280;

        const themeButton = new ThemeButton(
            { x, y },
            { width: buttonWidth, height: buttonHeight },
            padding,
            Themes[theme]
        );

        themeButtons.push(themeButton);

        i++;
    }

    return themeButtons;
};
