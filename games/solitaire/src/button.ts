import { DebugDialog } from './debug-dialog';
import { DeckDialog } from './deck-dialog';
import { DefaultDialogRenderConfig } from './dialog';
import { RuleComponent } from './rule-component';
import { RuleNames } from './rules';
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
                case 'reload':
                    window.location.reload();
                    break;
                // case 'deal':
                //     this.isDealNewRound = true;
                //     break;
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
                case 'hit':
                    if (State.isDialogOpen()) break;
                    this.hitCard();
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
                        State.getPlayer().drawPile,
                        State.getPlayer().playPile
                    );
                    State.addGameComponent(deckDialog);
                    break;
            }
        }
    }

    render(): void {
        this.renderDropShadow();
        State.getCtx().fillStyle = State.getTheme().base;

        const x = this.coordinates.x;
        const y = this.coordinates.y;
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
            this.coordinates.x + this.padding / 2,
            this.coordinates.y + this.padding * 1.75
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
        const x = this.coordinates.x;
        const y = this.coordinates.y;
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

    private hitCard(): void {
        State.setStreak(0);
        State.getPlayer().hit();
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
            State.getCtx().lineWidth = 2;
            State.getCtx().strokeRect(
                this.coordinates.x,
                this.coordinates.y,
                this.size.width,
                this.size.height
            );
        }
    }
}

export const createDecrementPlayPileButton = () => {
    const ctx = State.getCtx();
    const text = 'Play Pile -';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 200;
    const y = 470;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'decrement-play-pile',
        text,
        padding
    );
};

export const createIncrementPlayPileButton = () => {
    const ctx = State.getCtx();
    const text = 'Play Pile +';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 540;
    const y = 470;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'increment-play-pile',
        text,
        padding
    );
};

export const createAddPileButton = () => {
    const ctx = State.getCtx();
    const text = 'Add Pile';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 200;
    const y = 260;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'add-pile',
        text,
        padding
    );
};

export const createRemovePileButton = () => {
    const ctx = State.getCtx();
    const text = 'Remove Pile';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 540;
    const y = 260;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'remove-pile',
        text,
        padding
    );
};

export const createDecrementDrawSizeButton = () => {
    const ctx = State.getCtx();
    const text = 'Draw Size -';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 200;
    const y = 330;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'decrement-draw-size',
        text,
        padding
    );
};

export const createIncrementDrawSizeButton = () => {
    const ctx = State.getCtx();
    const text = 'Draw Size +';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 540;
    const y = 330;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'increment-draw-size',
        text,
        padding
    );
};

export const createDecrementShufflesButton = () => {
    const ctx = State.getCtx();
    const text = 'Shuffles -';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 200;
    const y = 400;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'decrement-shuffles',
        text,
        padding
    );
};

export const createIncrementShufflesButton = () => {
    const ctx = State.getCtx();
    const text = 'Shuffles +';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 540;
    const y = 400;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'increment-shuffles',
        text,
        padding
    );
};

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

export const createHitButton = () => {
    const ctx = State.getCtx();
    const text = 'HIT';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 835;
    const y = 570;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'hit',
        text,
        padding
    );
};

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

export const createFlushButton = () => {
    const ctx = State.getCtx();
    const text = 'FLUSH';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 200;
    const y = 260;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'flush',
        text,
        padding
    );
};

export const createFreeButton = () => {
    const ctx = State.getCtx();
    const text = 'FREE';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 200;
    const y = 320;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'free',
        text,
        padding
    );
};

export const createKlondikeButton = () => {
    const ctx = State.getCtx();
    const text = 'KLONDIKE';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 200;
    const y = 380;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'klondike',
        text,
        padding
    );
};

export const createReverseKlondikeButton = () => {
    const ctx = State.getCtx();
    const text = 'REV. KLONDIKE';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 200;
    const y = 440;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'reverse-klondike',
        text,
        padding
    );
};

export const createSameValueButton = () => {
    const ctx = State.getCtx();
    const text = 'SAME VALUE';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 200;
    const y = 500;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'same-value',
        text,
        padding
    );
};

export const createOpenDebugDialogButton = () => {
    const ctx = State.getCtx();
    const text = 'DEBUG';
    const padding = 20; // Padding for the button

    ctx.font = '30px New-Amsterdam';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 1140;
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
    const x = 1000;
    const y = 570;

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
        const x = 400 + i * (buttonWidth + padding);
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
