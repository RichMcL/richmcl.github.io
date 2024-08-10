import { Theme, Themes } from './theme';
import { Coordinates, GameComponent, RenderConfig, Size } from './types';

export class GameButton extends GameComponent {
    renderConfig: RenderConfig;

    constructor(
        ctx: CanvasRenderingContext2D,
        coordinates: Coordinates,
        public size: Size,
        public id: string,
        public text: string,
        public padding: number,
        public fillColor: string
    ) {
        super(ctx, coordinates);
        this.renderConfig = {
            coordinates,
            size,
            scale: 1
        };
    }

    update(): void {}

    render(): void {}
}

export class ThemeButton extends GameButton {
    constructor(
        ctx: CanvasRenderingContext2D,
        coordinates: Coordinates,
        public size: Size,
        public padding: number,
        public fillColor: string,
        public theme: Theme
    ) {
        super(ctx, coordinates, size, 'theme', '', padding, fillColor);
        this.renderConfig = {
            coordinates,
            size,
            scale: 1
        };
    }

    update(): void {}
    render(): void {}
}

export const createReloadButton = (ctx: CanvasRenderingContext2D, theme: Theme) => {
    const text = 'RELOAD';
    const padding = 20; // Padding for the button
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding * 2 + 5;
    const buttonHeight = 50;
    const x = 30;
    const y = 730;

    return new GameButton(
        ctx,
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'reload',
        text,
        padding,
        theme.base
    );
};

export const createDealButton = (ctx: CanvasRenderingContext2D, theme: Theme) => {
    const text = 'DEAL';
    const padding = 20; // Padding for the button
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding * 2;
    const buttonHeight = 50;
    const x = 30;
    const y = 670;

    return new GameButton(
        ctx,
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'deal',
        text,
        padding,
        theme.base
    );
};

export const createHitButton = (ctx: CanvasRenderingContext2D, theme: Theme) => {
    const text = 'HIT';
    const padding = 20; // Padding for the button
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding * 2;
    const buttonHeight = 50;
    const x = 610;
    const y = 390;

    return new GameButton(
        ctx,
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'hit',
        text,
        padding,
        theme.base
    );
};

export const createFreeButtton = (ctx: CanvasRenderingContext2D, theme: Theme) => {
    const text = 'FREE';
    const padding = 20; // Padding for the button
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding * 2;
    const buttonHeight = 50;
    const x = 1100;
    const y = 670;

    return new GameButton(
        ctx,
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'free',
        text,
        padding,
        theme.base
    );
};

export const createThemeButtons = (ctx: CanvasRenderingContext2D): ThemeButton[] => {
    const themeButtons: ThemeButton[] = [];
    let i = 0;

    for (const theme of Object.keys(Themes)) {
        const padding = 20; // Padding for the button
        const buttonWidth = 50;
        const buttonHeight = 50;
        const x = 400 + i * (buttonWidth + padding);
        const y = 700;

        const themeButton = new ThemeButton(
            ctx,
            { x, y },
            { width: buttonWidth, height: buttonHeight },
            padding,
            Themes[theme].base,
            Themes[theme]
        );

        themeButtons.push(themeButton);

        i++;
    }

    return themeButtons;
};
