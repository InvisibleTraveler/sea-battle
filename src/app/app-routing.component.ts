import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { LoginPage } from './pages/login/login.page';
import { SeaBattlePage } from './pages/sea-battle/sea-battle.page';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'sea-battle',
    canActivate: [LoginGuard],
    component: SeaBattlePage
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
