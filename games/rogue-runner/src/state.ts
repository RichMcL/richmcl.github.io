import { Player } from './player';
import { Coordinates, GameComponent } from './types';

export class State {
    private static readonly gameAspectRatio = 640 / 1000;
    private static windowAspectRatio: number;

    private static canvas: HTMLCanvasElement;
    private static ctx: CanvasRenderingContext2D;

    private static gameRunning: boolean = false;
    private static timerInMs: number = 0;

    private static player: Player;

    private static score = 0;
    private static currentLevel = 0;

    private static mouseClick = false;
    private static gamepadButtonClick = false;
    private static scaleFactor = 1;

    private static mouseCoordinates = { x: 0, y: 0 } as Coordinates;
    private static scaledMouseCoordinates = { x: 0, y: 0 } as Coordinates;

    private static clickCoordinates = { x: 0, y: 0 } as Coordinates;
    private static scaledClickCoordinates = { x: 0, y: 0 } as Coordinates;

    private static gameComponents: GameComponent[] = [];

    static getGameAspectRatio(): number {
        return State.gameAspectRatio;
    }

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

    static setGameRunning(gameRunning: boolean): void {
        State.gameRunning = gameRunning;
    }

    static isGameRunning(): boolean {
        return State.gameRunning;
    }

    static setTimerInMs(timerInMs: number): void {
        State.timerInMs = timerInMs;
    }

    static getTimerInMs(): number {
        return State.timerInMs;
    }

    static incrementTimerInMs(elapsed: number): void {
        State.timerInMs += elapsed;
    }

    static getScore(): number {
        return State.score;
    }

    static setScore(score: number): void {
        State.score = score;
    }

    static getCurrentLevel(): number {
        return State.currentLevel;
    }

    static setCurrentLevel(level: number): void {
        State.currentLevel = level;
    }

    static incrementCurrentLevel(): void {
        State.currentLevel++;
    }

    static setPlayer(player: Player): void {
        State.player = player;
    }

    static getPlayer(): Player {
        return State.player;
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

    static setGamepadButtonClick(isGamepadButtonClick: boolean): void {
        State.gamepadButtonClick = isGamepadButtonClick;
    }

    static isGamepadButtonClick(): boolean {
        return State.gamepadButtonClick;
    }

    static addGameComponent(gameComponent: GameComponent): void {
        State.gameComponents.push(gameComponent);
    }

    static removeGameComponent(gameComponent: GameComponent): void {
        State.gameComponents = State.gameComponents.filter(gc => gc !== gameComponent);
    }

    static removeGameComponentByType(type: string): void {
        State.gameComponents = State.gameComponents.filter(gc => gc.constructor.name !== type);
    }

    static getGameComponents(): GameComponent[] {
        return State.gameComponents;
    }

    static removeAllDeletedGameComponents(): void {
        State.gameComponents = State.gameComponents.filter(gc => !gc.deleteMe);
    }
}
