import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../service/user.service";
import {OrderService} from "../service/order.service";
import {Order, OrderStatus} from "../shared/order";
import {BookService} from "../service/book.service";
import {StoreService} from "../service/store.service";
import {ReviewService} from "../service/review.service";
import {MatDialog} from "@angular/material";
import {ReviewComponent} from "../review/review.component";

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.scss']
})
export class OrderlistComponent implements OnInit {
  orderList: Order[];
  orderStatus = OrderStatus;
  constructor(private userService: UserService, private orderService: OrderService, private reviewService: ReviewService,
              private router: Router, private bookService: BookService, private storeService: StoreService,private dialog: MatDialog ) { }

  ngOnInit() {
    if(this.userService.isLogin()){
      this.getOrderList()
    }else{
      alert("Not login!");
      this.router.navigate(['/home']);
    }
  }

  isManager(){
    return localStorage.getItem('userType') == 'Manager'
  }

  getOrderList(){
    if(this.isManager()){
      this.orderService.getAllOrder().subscribe(res => {
        if(res.success){
          this.orderList = res.content;
        }
      })
    }else{
      this.orderService.getOrders().subscribe(res => {
        if(res.success){
          this.orderList = res.content;
        }
      })
    }
  }

  isLogin(){
    return this.userService.isLogin();
  }



  formatDate(date){
    var d = new Date(date);
    return d.getDate() + " " + d.getMonth() + ", " + d.getFullYear();
  }

  processOrder(order: Order){
    this.orderService.processOrder(order).subscribe(res => {
      if(res.success){
        this.getOrderList();
      }
    })
  }

  reviewOrder(order){
    this.reviewService.setOrder(order);
    this.dialog.open(ReviewComponent);
  }


}
