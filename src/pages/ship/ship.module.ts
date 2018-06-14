import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShipPage } from './ship';

@NgModule({
  declarations: [
    ShipPage,
  ],
  imports: [
    IonicPageModule.forChild(ShipPage),
  ],
})
export class ShipPageModule {}
