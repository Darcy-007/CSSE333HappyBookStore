import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {baseurl} from "../shared/config";

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  httpHeader = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }

  isFavorite(bookid):Observable<any> {
    return this.http.post(baseurl + '/book/islike', {bookID: bookid}, {
      headers: this.httpHeader,
      params: {
        token: localStorage.getItem('token')
      }
    });
  }

  deleteFavorite(bookid):Observable<any> {
    return this.http.post(baseurl + '/book/deleteLike', {BookID: bookid}, {
      headers: this.httpHeader,
      params: {
        token: localStorage.getItem('token')
      }
    });
  }

  addFavorite(bookid):Observable<any> {
    return this.http.post(baseurl + '/book/insertLike', {BookID: bookid}, {
      headers: this.httpHeader,
      params: {
        token: localStorage.getItem('token')
      }
    });
  }

  getAllFavorite():Observable<any>{
    return this.http.post(baseurl + '/book/getAllLikes', null, {
      headers: this.httpHeader,
      params: {
        token: localStorage.getItem('token')
      }
    });
  }

}
