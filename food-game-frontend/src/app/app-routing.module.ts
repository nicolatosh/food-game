import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessGuard } from './access.guard';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { GameendComponent } from './gameend/gameend.component';
import { LoginComponent } from './login/login.component';
import { PlayComponent } from './play/play.component';
import { WaitOpponentComponent } from './wait-opponent/wait-opponent.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'play/:usernick', component: PlayComponent, canActivate: [AccessGuard]
  },
  {
    path: 'game/wait', component: WaitOpponentComponent, canActivate: [AccessGuard]
  },
  {
    path : 'game/:gamemode/:matchtype/:gameid/:usernick' , component: GameComponent, canActivate: [AccessGuard]
  },
  {
    path : 'game/:result', component: GameendComponent, canActivate: [AccessGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
