import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material";
import {Book} from "../shared/book";
import {OrderService} from "../service/order.service";
import {Order, PaymentMethod, OrderType} from "../shared/order";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  book: Book;
  method = "";
  type= "";
  order = new Order();
  paymentMethod = PaymentMethod;
  orderType = OrderType;
  constructor(private orderService: OrderService, private dialogRef: MatDialogRef<OrderComponent>) {
    this.book = this.orderService.getCurrentBook();
    this.order.BookID = this.book.BookID;
  }

  ngOnInit() {
  }

  sendOrder(){
    this.order.PaymentMethod = this.method ;
    this.order.OrderType = this.type ;
    console.log(this.order)
    this.orderService.sendOrder(this.order).subscribe(res => {
      if(res.success){
        this.dialogRef.close();
        alert('Order sent');
      }
    })
  }



}
