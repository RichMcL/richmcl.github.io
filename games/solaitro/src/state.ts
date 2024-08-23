import { Coordinates } from './types';

export class State {
    public static readonly gameAspectRatio = 1280 / 800;
    private static windowAspectRatio: number;

    private static canvas: HTMLCanvasElement;
    private static ctx: CanvasRenderingContext2D;
    private static score = 0;
    private static streak = 0;

    private static mouseClick = false;
    private static scaleFactor = 1;

    private static mouseCoordinates = { x: 0, y: 0 } as Coordinates;
    private static scaledMouseCoordinates = { x: 0, y: 0 } as Coordinates;

    private static clickCoordinates = { x: 0, y: 0 } as Coordinates;
    private static scaledClickCoordinates = { x: 0, y: 0 } as Coordinates;

    private static cardFaceSpriteSheet: HTMLImageElement;
    private static cardBackSpriteSheet: HTMLImageElement;
    private static iconSpriteSheet: HTMLImageElement;

    static setWindowAspectRatio(aspectRatio: number): void {
        State.windowAspectRatio = aspectRatio;
    }

    static getWindowAspectRatio(): number {
        return State.windowAspectRatio;
    }

    static setCanvas(canvas: HTMLCanvasElement): void {
        State.canvas = canvas;
    }

    static getCanvas(): HTMLCanvasElement {
        return State.canvas;
    }

    static setCtx(ctx: CanvasRenderingContext2D): void {
        State.ctx = ctx;
    }

    static getCtx(): CanvasRenderingContext2D {
        return State.ctx;
    }

    static getScore(): number {
        return State.score;
    }

    static setScore(score: number): void {
        State.score = score;
    }

    static getStreak(): number {
        return State.streak;
    }

    static setStreak(streak: number): void {
        State.streak = streak;
    }

    static setMouseCoordinates(coordinates: Coordinates): void {
        State.mouseCoordinates = coordinates;
        State.scaledMouseCoordinates = {
            x: coordinates.x / State.scaleFactor,
            y: coordinates.y / State.scaleFactor
        };
    }

    static getMouseCoordinates(): Coordinates {
        return State.mouseCoordinates;
    }

    static setClickCoordinates(coordinates: Coordinates): void {
        if (coordinates === null) {
            State.clickCoordinates = null;
            State.scaledClickCoordinates = null;
        } else {
            State.clickCoordinates = coordinates;
            State.scaledClickCoordinates = {
                x: coordinates.x / State.scaleFactor,
                y: coordinates.y / State.scaleFactor
            };
        }
    }

    static getClickCoordinates(): Coordinates {
        return State.clickCoordinates;
    }

    static getScaledClickCoordinates(): Coordinates {
        return State.scaledClickCoordinates;
    }

    static getScaledMouseCoordinates(): Coordinates {
        return State.scaledMouseCoordinates;
    }

    static setScaleFactor(scaleFactor: number): void {
        State.scaleFactor = scaleFactor;
    }

    static getScaleFactor(): number {
        return State.scaleFactor;
    }

    static setMouseClick(isMouseClick: boolean): void {
        State.mouseClick = isMouseClick;
    }

    static isMouseClick(): boolean {
        return State.mouseClick;
    }

    static setCardFaceSpriteSheet(cardFaceSpriteSheet: HTMLImageElement): void {
        State.cardFaceSpriteSheet = cardFaceSpriteSheet;
    }

    static getCardFaceSpriteSheet(): HTMLImageElement {
        return State.cardFaceSpriteSheet;
    }

    static setCardBackSpriteSheet(cardBackSpriteSheet: HTMLImageElement): void {
        State.cardBackSpriteSheet = cardBackSpriteSheet;
    }

    static getCardBackSpriteSheet(): HTMLImageElement {
        return State.cardBackSpriteSheet;
    }

    static setIconSpriteSheet(iconSpriteSheet: HTMLImageElement): void {
        State.iconSpriteSheet = iconSpriteSheet;
    }

    static getIconSpriteSheet(): HTMLImageElement {
        return State.iconSpriteSheet;
    }
}
