import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessGuard } from './access.guard';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PlayComponent } from './play/play.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'play', component: PlayComponent, canActivate: [AccessGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
