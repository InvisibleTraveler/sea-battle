import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// modules
import { AppRoutingModule } from './app-routing.component';

// pages
import { LoginPage } from './pages/login/login.page';
import { SeaBattlePage } from './pages/sea-battle/sea-battle.page';

// components
import { AppComponent } from './app.component';
import { GameTableComponent } from './components/game-table/game-table.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPage,
    SeaBattlePage,
    GameTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
