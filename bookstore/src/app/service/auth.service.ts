import { Injectable } from '@angular/core';
import {HttpClient, HttpHandler, HttpHeaders} from '@angular/common/http'
import {Observable} from "rxjs/Observable";
import { Router } from '@angular/router';
import {baseurl} from '../shared/config';

@Injectable()
export class AuthService {

  httpHeader = new HttpHeaders({'Content-Type':'application/json'})
  constructor(private http: HttpClient){}

  login(user):Observable<any> {
    return this.http.post(baseurl + '/users/login/', user,{
      headers : this.httpHeader
    });
  }

  register(user):Observable<any> {
    return this.http.post(baseurl + '/users/register/', user, {
      headers: this.httpHeader
    });
  }

  managerLogin(manager):Observable<any> {
    return this.http.post(baseurl + '/manager/login', manager, {
      headers: this.httpHeader
    })
  }

}
