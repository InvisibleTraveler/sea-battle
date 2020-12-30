import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

// services
import { SeaBattleService } from '../../services/sea-battle.service';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage {
  public nameControl = new FormControl('', Validators.required);
  public loading = false;

  constructor(private sbs: SeaBattleService, private router: Router) {}

  public searchGame(): void {
    this.loading = true;

    this.sbs.waitForGame(this.nameControl.value).pipe(untilDestroyed(this)).subscribe(() => {
      this.loading = false;
      this.router.navigate(['sea-battle']);
    });
  }
}
