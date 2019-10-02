import { Injectable } from '@angular/core';
import {Book} from "../shared/book";
import {Order} from "../shared/order";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {baseurl} from "../shared/config";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  book: Book;
  httpHeader = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) {

  }

  setCurrentBook(book: Book){
    this.book = book;
  }

  getCurrentBook(){
    return this.book
  }
  sendOrder(order: Order):Observable<any>{
    return this.http.post(baseurl + '/order/insert', order, {
      headers: this.httpHeader,
      params:{
        token: localStorage.getItem('token')
      }
    });
  }

  processOrder(order: Order): Observable<any>{
    return this.http.post(baseurl + '/order/process', order, {
      headers: this.httpHeader,
      params:{
        token: localStorage.getItem('token')
      }
    });
  }

  getAllOrder(): Observable<any>{
    return this.http.post(baseurl + '/order/getAllOrders', null, {
      headers: this.httpHeader,
      params:{
        token: localStorage.getItem('token')
      }
    });
  }

  getOrders():Observable<any>{
    return this.http.post(baseurl + '/order/get', null, {
      headers: this.httpHeader,
      params:{
        token: localStorage.getItem('token')
      }
    });
  }
}
