import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {baseurl} from "../shared/config";
import {Order} from "../shared/order";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  order: Order;
  httpHeader = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) {

  }

  getReview(order): Observable<any>{
    return this.http.post(baseurl + '/book/getReview', order, {
      headers: this.httpHeader,
      params: {
        token: localStorage.getItem('token')
      }
    });
  }

  sendReview(OrderID, Score):Observable<any>{
    return this.http.post(baseurl + '/book/insertReview', {OrderID: OrderID, Score: Score}, {
      headers: this.httpHeader,
      params: {
        token: localStorage.getItem('token')
      }
    })
  }

  setOrder(order: Order){
    this.order = order;
  }

  getOrder():Order{
    return this.order;
  }
}
