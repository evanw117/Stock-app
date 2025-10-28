import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // ✅ Required for ngModel
    IonicModule,
    RouterModule.forChild([{ path: '', component: HomePage }])
  ],
  imports: [
    CommonModule,
    FormsModule, // ✅ Required for ngModel
    IonicModule,
    RouterModule.forChild([{ path: '', component: HomePage }]),
    HomePage // ✅ Import standalone component
  ]
})
export class HomePageModule {}
