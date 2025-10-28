// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Platform }          from '@ionic/angular';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      const dark = localStorage.getItem('darkMode') === 'true';
      document.body.classList.toggle('dark', dark);
    });
  }
}
