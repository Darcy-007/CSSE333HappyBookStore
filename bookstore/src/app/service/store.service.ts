import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import {baseurl} from "../shared/config";

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  httpHeader = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) {

  }

  getAllStore():Observable<any>{
    return this.http.post(baseurl + '/store/getAll', null, {
      headers: this.httpHeader,
      params: {
        token: localStorage.getItem('token')
      }
    });
  }

  getStore(storeID): Observable<any>{
    return this.http.post(baseurl + '/store/get', {storeid: storeID}, {
      headers: this.httpHeader,
      params: {
        token: localStorage.getItem('token')
      }
    });
  }
}
