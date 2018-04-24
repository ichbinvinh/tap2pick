import { Component } from '@angular/core';
import { PickedPage } from '../picked/picked';
import { HomePage } from '../home/home';
import { PickingPage } from '../picking/picking';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = PickingPage;
  tab3Root = PickedPage;

  constructor() {

  }
}
