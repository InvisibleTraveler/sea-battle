import { Component, Input, Output, EventEmitter } from '@angular/core';

// models
import { BattleField } from '../../models/battle-field';
import { Shot } from '../../models/shot';

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.css']
})
export class GameTableComponent {
  @Input() public shipsMap: BattleField[][];
  @Input() public name: string;
  @Input() public disabled: boolean;
  @Input() public editMode: boolean;
  @Input() public color: string;
  @Output() public toggleField = new EventEmitter<Shot>();

  public canClick(y: number, x: number): boolean {
    if (this.editMode) {
      const [top, center, bottom] = [this.shipsMap[y - 1], this.shipsMap[y], this.shipsMap[y + 1]];
      const topRow = top ? [top[x - 1]?.haveShip, top[x]?.haveShip, top[x + 1]?.haveShip] : [false];
      const centerRow = [center[x - 1]?.haveShip, center[x + 1]?.haveShip];
      const bottomRow = bottom ? [bottom[x - 1]?.haveShip, bottom[x]?.haveShip, bottom[x + 1]?.haveShip] : [false];

      const allSides = [...topRow, ...centerRow, ...bottomRow];

      return !allSides.includes(true);
    } else {
      return !this.shipsMap[y][x].hit;
    }
  }

  public onClick(y, x): void {
    const field: Shot = { y, x };
    this.toggleField.emit(field);
  }
}
