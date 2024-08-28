import { createOpenDebugDialogButton, GameButton } from './button';
import { RuleInfo, RuleNames } from './rules';
import { State } from './state';
import { GameComponent } from './types';
import { drawRule, printText } from './util';

export class RuleSidebar extends GameComponent {
    buttons: GameButton[] = [];

    constructor(coordinates = { x: 1007, y: 0 }) {
        super(coordinates);

        this.buttons.push(createOpenDebugDialogButton());

        State.addRule(RuleNames.klondike);
        State.addRule(RuleNames.reverseKlondike);
        State.addRule(RuleNames.free);
    }

    update(): void {
        this.buttons.forEach(button => button.update());
    }

    render(): void {
        const x = 1007;

        // Left border
        State.getCtx().fillStyle = State.getTheme().base;
        State.getCtx().fillRect(x - 3, 0, 3, 800);

        State.getCtx().fillStyle = '#293a3a';
        State.getCtx().fillRect(x, 0, 250, 800);

        // Right border
        State.getCtx().fillStyle = State.getTheme().base;
        State.getCtx().fillRect(x + 250, 0, 3, 800);

        printText('Rules', x + 30, 40);

        //iterate over the riles an print their descriptions
        let y = 80;

        for (const rule of State.getRuleNames()) {
            drawRule(rule, x + 30, y);
            y += 90;
            const ruleInfo = RuleInfo[rule];
            printText(`- ${ruleInfo.name}`, x + 30, y);
            y += 30;
            printText(`  ${ruleInfo.description}`, x + 30, y, 20);
            y += 20;
        }

        // Draw buttons
        this.buttons.forEach(button => button.render());
    }
}
