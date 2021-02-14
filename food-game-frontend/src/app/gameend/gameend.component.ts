import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-gameend',
  templateUrl: './gameend.component.html',
  styleUrls: ['./gameend.component.css']
})
export class GameendComponent implements OnInit {

  isGameOver: string = "";
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        this.isGameOver = params['result']
      });

    setTimeout(() => {
      this.router.navigateByUrl("/");
    }, 5000);
  }

}
