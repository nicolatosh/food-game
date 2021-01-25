import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login.service';
import { HttpClientModule, HttpParams, HttpHeaders } from '@angular/common/http';
import { PlayComponent } from './play/play.component';
import { AccessGuard } from './access.guard';
import { PlayService } from './play.service';
import { GameComponent } from './game/game.component';
import { CommonModule } from '@angular/common';
import { GameService } from './game.service';
import { GameendComponent } from './gameend/gameend.component';
import { WaitOpponentComponent } from './wait-opponent/wait-opponent.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PlayComponent,
    GameComponent,
    GameendComponent,
    WaitOpponentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [ LoginService, PlayService, GameService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
