import { State } from './state';

export const CARD_WIDTH = 68;
export const CARD_HEIGHT = 96;
export const BASE_CARD_SCALE = 1.5;

export const RULE_WIDTH = 68;
export const RULE_HEIGHT = 48;
export const RULE_SCALE = 1.25;

export const printText = (
    text: string,
    x: number,
    y: number,
    fontSize = 30,
    color = 'white'
): void => {
    const ctx = State.getCtx();
    ctx.save();
    ctx.font = `${fontSize}px New-Amsterdam`;
    ctx.fillStyle = color;

    // Set shadow properties
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Shadow color
    ctx.shadowBlur = 4; // Blur level
    ctx.shadowOffsetX = 2; // Horizontal offset
    ctx.shadowOffsetY = 2; // Vertical offset

    ctx.fillText(text, x, y);

    // Reset shadow properties to avoid affecting other drawings
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.restore();
};

export const drawRoundedRect = (
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
): void => {
    const ctx = State.getCtx();
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
    ctx.fill();
};
