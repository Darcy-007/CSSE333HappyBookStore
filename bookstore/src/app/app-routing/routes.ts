import { Routes } from '@angular/router';

import {BookComponent} from "../book/book.component";
import {HomeComponent} from "../home/home.component";
import {OrderlistComponent} from "../orderlist/orderlist.component";

export const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'book', component: BookComponent},
  {path: 'order', component: OrderlistComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
