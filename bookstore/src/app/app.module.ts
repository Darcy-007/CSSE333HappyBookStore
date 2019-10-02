import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {
  MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
  MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule,
  MatSlideToggleModule, MatToolbarModule, MatListModule, MatGridListModule,
  MatCardModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule, MatMenuModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import {AgGridModule} from "ag-grid-angular";
import 'hammerjs';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import {BookComponent} from "./book/book.component";


import {AuthService} from "./service/auth.service";
import {BookService} from "./service/book.service";
import {AppRoutingModule} from "./app-routing/app-routing.module";
import {UserService} from "./service/user.service";
import { AccountComponent } from './account/account.component';
import {StoreService} from "./service/store.service";
import { OrderComponent } from './order/order.component';
import {FavoriteService} from "./service/favorite.service";
import {ReviewService} from "./service/review.service";
import {OrderService} from "./service/order.service";
import { OrderlistComponent } from './orderlist/orderlist.component';
import { ReviewComponent } from './review/review.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    BookComponent,
    AccountComponent,
    OrderComponent,
    OrderlistComponent,
    ReviewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
    MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule,
    MatSlideToggleModule, MatToolbarModule, MatListModule, MatGridListModule,
    MatCardModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule,
    FlexLayoutModule,MatMenuModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AgGridModule.withComponents([]),
    RouterModule.forRoot(
      [
        {path:"", component: RegisterComponent}
      ]
    )
  ],
  providers: [AuthService, BookService, UserService, StoreService, FavoriteService, ReviewService, OrderService],
  entryComponents: [
    LoginComponent,
    RegisterComponent,
    AccountComponent,
    OrderComponent,
    ReviewComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
