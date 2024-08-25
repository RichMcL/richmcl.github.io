import { GameButton } from './button';
import { DeckDialog } from './deck-dialog';
import { Player } from './player';
import { RuleNames } from './rules';
import { Scorebar } from './scorebar';
import { Swirl } from './swirl';
import { SwirlThemes, Theme, Themes } from './theme';
import { Coordinates, GameComponent } from './types';

export class State {
    private static readonly gameAspectRatio = 1280 / 800;
    private static windowAspectRatio: number;

    private static canvas: HTMLCanvasElement;
    private static ctx: CanvasRenderingContext2D;

    private static gameRunning: boolean = false;

    private static theme: Theme = Themes.default;
    private static swirl: Swirl;

    private static ruleNames: RuleNames[] = [];

    private static player: Player;
    private static scorebar: Scorebar;

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

    private static gameComponents: GameComponent[] = [];

    private static dialogOpen = false;

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

    static getTheme(): Theme {
        return State.theme;
    }

    static setTheme(theme: Theme): void {
        State.theme = theme;

        State.swirl.doSwirl(SwirlThemes[theme.name]);
    }

    static getSwirl(): Swirl {
        return State.swirl;
    }

    static setSwirl(swirl: Swirl): void {
        State.swirl = swirl;
    }

    static getRuleNames(): RuleNames[] {
        return State.ruleNames;
    }

    static addRule(ruleName: RuleNames): void {
        State.ruleNames.push(ruleName);
        State.getRuleNames().sort();
    }

    static removeRule(ruleName: RuleNames): void {
        State.ruleNames = State.ruleNames.filter(name => name !== ruleName);
        State.getRuleNames().sort();
    }

    static toggleRule(ruleName: RuleNames): void {
        if (State.ruleNames.includes(ruleName)) {
            State.removeRule(ruleName);
        } else {
            State.addRule(ruleName);
        }
        State.getRuleNames().sort();
    }

    static setPlayer(player: Player): void {
        State.player = player;
    }

    static getPlayer(): Player {
        return State.player;
    }

    static setScorebar(scorebar: Scorebar): void {
        State.scorebar = scorebar;
    }

    static getScorebar(): Scorebar {
        return State.scorebar;
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

    static addGameComponent(gameComponent: GameComponent): void {
        State.gameComponents.push(gameComponent);
    }

    static removeGameComponent(gameComponent: GameComponent): void {
        State.gameComponents = State.gameComponents.filter(gc => gc !== gameComponent);
    }

    static removeGameComponentByType(type: string): void {
        State.gameComponents = State.gameComponents.filter(gc => gc.constructor.name !== type);
    }

    static removeGameButtonById(id: string): void {
        State.gameComponents = State.gameComponents.filter(gc => {
            console.log('gc.constructor.name', gc.constructor.name);
            if (gc.constructor.name === 'GameButton') {
                return (gc as GameButton).id !== id;
            } else {
                return true;
            }
        });
    }

    static getGameComponents(): GameComponent[] {
        return State.gameComponents;
    }

    static removeAllDeletedGameComponents(): void {
        State.gameComponents = State.gameComponents.filter(gc => !gc.deleteMe);
    }

    static setDialogOpen(dialogOpen: boolean): void {
        State.dialogOpen = dialogOpen;
    }

    static isDialogOpen(): boolean {
        return State.dialogOpen;
    }
}
