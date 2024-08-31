import { createOpenDebugDialogButton, GameButton } from './button';
import { RuleComponent } from './rule-component';
import { RuleNames } from './rules';
import { State } from './state';
import { GameComponent } from './types';
import { printText, RULE_HEIGHT, RULE_SCALE } from './util';

export class RuleSidebar extends GameComponent {
    buttons: GameButton[] = [];

    constructor(coordinates = { x: 1007, y: 0 }) {
        super(coordinates);

        this.buttons.push(createOpenDebugDialogButton());

        State.addRule(RuleNames.klondike);
        State.addRule(RuleNames.reverseKlondike);
        State.addRule(RuleNames.free);

        State.addRuleComponent(new RuleComponent({ rule: RuleNames.klondike }));
        State.addRuleComponent(new RuleComponent({ rule: RuleNames.reverseKlondike }));
        State.addRuleComponent(new RuleComponent({ rule: RuleNames.free }));
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

        let y = 70;

        for (const rc of State.getRuleComponents()) {
            rc.render({ x: x + 30, y });
            y += RULE_HEIGHT * RULE_SCALE + 20;
        }

        // Draw buttons
        this.buttons.forEach(button => button.render());

        State.getRuleComponents().forEach(rc => {
            if (rc.isHoveredOver()) {
                rc.renderOutline(rc.renderConfig.coordinates);
                rc.renderRuleDescription();
            }
        });
    }
}
