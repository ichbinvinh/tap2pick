import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PickedPage } from './picked';

@NgModule({
  declarations: [
    PickedPage,
  ],
  imports: [
    IonicPageModule.forChild(PickedPage),
  ],
})
export class PickedPageModule {}
