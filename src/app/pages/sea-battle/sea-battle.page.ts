import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

// services
import { SeaBattleService } from '../../services/sea-battle.service';

// models
import { GameStatus } from '../../models/game-status.enum';
import { BattleField } from '../../models/battle-field';
import { Shot } from '../../models/shot';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-sea-battle',
  templateUrl: './sea-battle.page.html',
  styleUrls: ['./sea-battle.page.css']
})
export class SeaBattlePage {
  public battleState$ = this.sbs.subscribeGameState();
  public GameState = GameStatus;
  public preparingShipsTable: BattleField[][] = new Array(this.sbs.MAX_SHIPS).fill(0).map(
    () => new Array(this.sbs.MAX_SHIPS).fill(false).map(() => ({ hit: false, haveShip: false }))
  );
  public defaultShipsTable: BattleField[][] = new Array(this.sbs.MAX_SHIPS).fill(0).map(
    () => new Array(this.sbs.MAX_SHIPS).fill(false).map(() => ({ hit: false, haveShip: false }))
  );

  public get username(): string {
    return this.sbs.username;
  }

  public get guestId(): string {
    return this.sbs.guestId;
  }

  public get leftPlaceShips(): number {
    let shipsCounter = 0;

    this.preparingShipsTable.forEach(row => {
      row.forEach(field => {
        if (field.haveShip) {
          shipsCounter++;
        }
      });
    });

    return this.sbs.MAX_SHIPS - shipsCounter;
  }

  constructor(private sbs: SeaBattleService, private router: Router) {}

  public toggleShipsPlacement(clickedField: Shot): void {
    this.preparingShipsTable = this.preparingShipsTable.map(
      (row, i) => i !== clickedField.y
        ? row
        : row.map(
          (field, j) => j !== clickedField.x
            ? field
            : ({ ...field, haveShip: !field.haveShip })
        )
    );
  }

  public ready(): void {
    this.sbs.ready(this.preparingShipsTable);
  }

  public shoot(field: Shot): void {
    this.sbs.shoot(field);
  }

  public endGame(): void {
    this.sbs.closeWebSocket();
    this.router.navigate(['login']);
  }
}
