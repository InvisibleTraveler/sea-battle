import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { filter, tap } from 'rxjs/operators';

// models
import { GameState } from '../models/game-state';

// constants
import { environment } from '../../environments/environment';
import { MessageType } from '../models/message-type.enum';
import { Shot } from '../models/shot';
import { BattleField } from '../models/battle-field';


@Injectable({
  providedIn: 'root'
})
export class SeaBattleService {
  public MAX_SHIPS = 6;
  public username: string;
  private socket: any;
  private gameState$: BehaviorSubject<GameState> = new BehaviorSubject<GameState>(null);
  private waitGame$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public get guestId(): string {
    return this.socket?.id;
  }

  // web socket

  public openWebSocket(name: string): void {
    this.socket = io(environment.wsUrl);

    console.log('init');

    this.socket.on('connect', () => {
      console.log('opened');

      this.username = name;

      this.socket.on(MessageType.waitStart, () => {
        this.waitGame$.next(true);
      });

      this.socket.on(MessageType.gameStatus, game => {
        this.gameState$.next(game);
      });

      this.socket.emit(MessageType.setName, name);
    });
  }

  public closeWebSocket(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  public waitForGame(name: string): Observable<any> {
    this.openWebSocket(name);
    return this.waitGame$.pipe(filter(ready => ready));
  }

  public subscribeGameState(): Observable<GameState> {
    return this.gameState$.pipe(filter(state => !!state), tap(state => console.log(state)));
  }

  public shoot(field: Shot): void {
    if (this.socket && this.gameState$.getValue().turn === this.socket.id) {
      this.socket.emit(MessageType.shot, field);
    }
  }

  public ready(shipsMap: BattleField[][]): void {
    if (this.socket && this.validateShipsMap(shipsMap)) {
      this.socket.emit(MessageType.shipsReady, shipsMap);
    }
  }

  private validateShipsMap(shipsMap: BattleField[][]): boolean {
    let ships = 0;

    for (let y = 0; y < shipsMap.length; y++) {
      for (let x = 0; x < shipsMap[0].length; x++) {
        if (shipsMap[y][x].haveShip) {
          const [top, center, bottom] = [shipsMap[y - 1], shipsMap[y], shipsMap[y + 1]];
          const topRow = top ? [top[x - 1]?.haveShip, top[x]?.haveShip, top[x + 1]?.haveShip] : [false];
          const centerRow = [center[x - 1]?.haveShip, center[x + 1]?.haveShip];
          const bottomRow = bottom ? [bottom[x - 1]?.haveShip, bottom[x]?.haveShip, bottom[x + 1]?.haveShip] : [false];

          const allSides = [...topRow, ...centerRow, ...bottomRow];

          if (allSides.includes(true)) {
            return false;
          }

          ships++;
        }
      }
    }

    return ships === this.MAX_SHIPS;
  }
}
