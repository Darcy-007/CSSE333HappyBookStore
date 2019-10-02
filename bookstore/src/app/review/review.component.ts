import { Component, OnInit } from '@angular/core';
import {ReviewService} from "../service/review.service";
import {Order} from "../shared/order";
import {MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  order: Order;
  rating = 5;
  constructor(private reviewService: ReviewService, private dialogRef: MatDialogRef<ReviewComponent>) {
  }

  ngOnInit() {
    this.order = this.reviewService.getOrder();
    this.reviewService.getReview(this.order).subscribe(res => {
      if(res.success){
        this.rating = res.content.Score;
      }
    });
  }

  formatDate(date){
    var d = new Date(date);
    return d.getDate() + " " + d.getMonth() + ", " + d.getFullYear();
  }

  sendReview(){
    this.reviewService.sendReview(this.order.OrderID, this.rating).subscribe(res => {
      if(res.success){
        this.dialogRef.close();
      }
    });
  }

}
