import { Injectable } from '@angular/core';
import {HttpClient, HttpHandler, HttpHeaders} from '@angular/common/http'
import {Observable} from "rxjs/Observable";
import { Router } from '@angular/router';
import {baseurl} from "../shared/config";
import {Book} from "../shared/book";
import {headersToString} from "selenium-webdriver/http";
import {delay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BookService {
  httpHeader = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }

  getAllBooks():Observable<any>{
    return this.http.post(baseurl + '/book/getAll',{
      headers: this.httpHeader,
      params:{
        token: localStorage.getItem('token')
      }
    });
  }

  getBook(id): Observable<any>{
    return this.http.post(baseurl + "/book/", {BookID: id}, {
      headers: this.httpHeader,
      params:{
        token: localStorage.getItem('token')
      }
    })
  }

  updateBook(book): Observable<any>{
    return this.http.post(baseurl + "/book/update", book, {
      headers: this.httpHeader,
      params:{
        token: localStorage.getItem('token')
      }
    });
  }

  deleteBook(id): Observable<any>{
    return this.http.post(baseurl + "/book/delete", {BookID: id},{
      headers: this.httpHeader,
      params:{
        token: localStorage.getItem('token')
      }
    })
  }

  addBook(book): Observable<any>{
    return this.http.post(baseurl + "/book/add", book, {
      headers: this.httpHeader,
      params:{
        token: localStorage.getItem('token')
      }
    })
  }

  filterBook(bookname, storename): Observable<any>{
    return this.http.post(baseurl + "/book/filterBook", {storename: storename, bookname: bookname}, {
      headers: this.httpHeader,
      params: {
        token: localStorage.getItem('token')
      }
    })
  }

  getScore(book): Observable<any>{
    return this.http.post(baseurl + "/book/getScore", book, {
      headers: this.httpHeader,
      params: {
        token: localStorage.getItem('token')
      }
    })
  }
}
