import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import { Router } from '@angular/router';
import {baseurl} from '../shared/config';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  httpHeader = new HttpHeaders({'Content-Type':'application/json'});


  constructor(private http: HttpClient) { }

  getCurrentCustomer():Observable<any> {
    return this.http.post(baseurl + '/users/get', {
      headers: this.httpHeader,
      params: {
        token: localStorage.getItem("token")
      }
    });
  }

  getCurrentManager():Observable<any> {
    return this.http.post(baseurl + '/manager/get', {
      headers: this.httpHeader,
      params: {
        token: localStorage.getItem("token")
      }
    })
  }

  isLogin():boolean {
    var token = localStorage.getItem('token');
    if(token == null){
      return false;
    }else{
      const date = this.getTokenExpirationDate(token);
      if(date === undefined) return false;
      return (date.valueOf() > new Date().valueOf());
    }
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) return null;
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  updateCustomerInfo(customer):Observable<any>{
    return this.http.post(baseurl + '/users/updateCustomer', customer, {
      headers: this.httpHeader,
      params: {
        token: localStorage.getItem('token')
      }
    })
  }

  updatePassword(oldpass, newpass):Observable<any>{
    return this.http.post(baseurl + '/users/updatePassword', {oldpassword: oldpass, newpassword: newpass}, {
      headers: this.httpHeader,
      params: {
        token: localStorage.getItem('token')
      }
    });
  }
}
