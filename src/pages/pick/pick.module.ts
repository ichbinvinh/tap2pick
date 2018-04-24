import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PickPage } from './pick';

@NgModule({
  declarations: [
    PickPage,
  ],
  imports: [
    IonicPageModule.forChild(PickPage),
  ],
})
export class PickPageModule {}
