import { Component, OnInit } from '@angular/core';
import {Book} from "../shared/book";
import {BookService} from "../service/book.service";
import {delay} from "rxjs/operators";
import {AuthService} from "../service/auth.service";
import {UserService} from "../service/user.service";
import {Router} from "@angular/router";
import {Store} from "../shared/store";
import {StoreService} from "../service/store.service";
import {FormBuilder, FormControl, FormGroup, Validator, Validators} from "@angular/forms";
import {FavoriteService} from "../service/favorite.service";
import {MatDialog} from "@angular/material";
import {OrderComponent} from "../order/order.component";
import {OrderService} from "../service/order.service";



@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  showFavorite: boolean;
  bookForm: FormGroup;
  filterForm: FormGroup;
  bookError = {
    'ISBN':'',
    'SellingPrice':'',
    'BelongTo':'',
    'Name':'',
    'Quantity':''
  };
  filterError = {
    'bookName': '',
    'storeName': ''
  };
  bookList: Book[];
  selectedBook: Book;

  storeList: Store[];
  bookValidation = {
    'ISBN':{
      'required': 'ISBN is required.',
      'pattern': 'ISBN should only be numbers',
      'minlength': 'ISBN must have a length of 13',
      'maxlength': 'ISBN must have a length of 13'
    },
    'SellingPrice':{
      'required': 'Selling price is required.',
      'pattern': 'Selling price should be in money form'
    },
    'BelongTo':{
      'required': 'Store information is required.',
      'pattern': 'Store information should be store ID'
    },
    'Name': {
      'required': 'Book name is required.',
      'pattern': 'Book name should only contain A-Z, a-z, 0-9,!,?,(,)',
      'maxlength': 'Book name must have a maximum length of 50'
    },
    'Quantity':{
      'pattern': 'Quantity should only be number'
    }
  };
  filterValidation = {
    'bookName':{
      'pattern':'Book name should only contain A-Z, a-z, 0-9,!,?,(,)',
      'maxlength': 'Book name have a maximum length of 50'
    },
    'storeName':{
      'pattern':'Store name should only contain A-Z, a-z',
      'maxlength': 'Store name have a maximum length of 20'
    }
  };
  constructor(private bookService: BookService, private userService: UserService,
              private router: Router, private storeService: StoreService,
              private fb: FormBuilder, private favoriteService: FavoriteService,
              private dialog: MatDialog, private orderService: OrderService) {
    this.createForm();
  }

  ngOnInit() {
    if(this.userService.isLogin()){
      this.showFavorite = false;
      this.getAllStore();
      this.getBook();
      this.selectedBook = new Book();
    }else{
      alert("Not login!");
      this.router.navigate(['/home']);
    }

  }

  createForm(){
    this.bookForm = this.fb.group({
      ISBN: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(13), Validators.maxLength(13)]],
      SellingPrice: ['', [Validators.required, Validators.pattern('^\\$?(([1-9]\\d{0,2}(,\\d{3})*)|0)?\\.\\d{1,2}$')]],
      BelongTo: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      Name: ['', [Validators.required, Validators.pattern('^(?![\\s.]+$)[a-zA-Z0-9!@?\(\)\\s.]*$'), Validators.maxLength(50)]],
      Quantity: ['', [Validators.pattern('[0-9]*')]]
    });

    this.bookForm.valueChanges.subscribe(data => this.bookValueChanged(data));
    this.bookValueChanged();
    this.filterForm = this.fb.group({
      bookName:['', [Validators.pattern('^(?![\\s.]+$)[a-zA-Z0-9!@?\(\)\\s.]*$'), Validators.maxLength(50)]],
      storeName:['',[Validators.pattern('^(?![\\s.]+$)[a-zA-Z\\s.]*$'), Validators.maxLength(20)]]
    });
    this.filterForm.valueChanges.subscribe(data => this.filterValueChanged(data));

    this.filterValueChanged();
  }


  bookValueChanged(data?: any){
    if(!this.bookForm){return;}
    const form = this.bookForm;
    for(const field in this.bookError){
      this.bookError[field] = '';
      const control = form.get(field);
      if(control && control.dirty && !control.valid) {
        const message = this.bookValidation[field];
        for (const key in control.errors) {
          this.bookError[field] += message[key] + ' ';
        }
      }
    }
  }

  filterValueChanged(data?: any){
    if(!this.filterForm){return;}
    const form = this.filterForm;
    for(const field in this.filterError){
      this.filterError[field] = '';
      const control = form.get(field);
      if(control && control.dirty && !control.valid) {
        const message = this.filterValidation[field];
        for (const key in control.errors) {
          this.filterError[field] += message[key] + ' ';
        }
      }
    }
  }

  getBook(){
    if(this.showFavorite){
      this.favoriteService.getAllFavorite().subscribe(res => {
        if(res.success){
          this.bookList = res.content;
          this.bookList.forEach(book => {
            this.checkFavorite(book);
            this.getScore(book);
          })
        }
      })
    }else{
      this.bookService.getAllBooks().subscribe(res => {
        if(res.success){
          this.bookList = res.content;
          this.bookList.forEach(book => {
            this.checkFavorite(book);
            this.getScore(book);
          })
        }
      });
    }
  }

  updateBook(){
    var id = this.selectedBook.BookID;
    this.selectedBook = this.bookForm.value;
    this.selectedBook.BookID = id;
    this.bookService.updateBook(this.selectedBook).subscribe(res => {
      if(res.success){
        alert("Update successfully");
        this.getBook();
        this.clear();
      }
    })
  }

  deleteBook(book){
    this.bookService.deleteBook(book.BookID).subscribe(res => {
      if(res.success){
        alert("Delete successfully");
        this.getBook();
      }
    })
  }

  selectBook(book){
    this.selectedBook = book;
    this.bookForm.reset({
      ISBN: this.selectedBook.ISBN,
      SellingPrice: this.selectedBook.SellingPrice,
      BelongTo: this.selectedBook.BelongTo,
      Name: this.selectedBook.Name,
      Quantity: this.selectedBook.Quantity
    });
  }

  addBook(){
    this.bookService.addBook(this.bookForm.value).subscribe(res => {
      if(res.success){
        alert("Add successfully");
        this.clear();
        this.getBook();
      }
    })
  }

  addOrder(book){
    this.orderService.setCurrentBook(book);
    this.dialog.open(OrderComponent)
  }

  clear(){
    this.selectedBook = new Book();
    this.bookForm.reset({
      ISBN: '',
      SellingPrice: '',
      BelongTo: '',
      Name: '',
      Quantity: ''
    });
  }

  isManager(){
    return localStorage.getItem('userType') == 'Manager'
  }

  isLogin(){
    return this.userService.isLogin();
  }

  getAllStore(){
    this.storeService.getAllStore().subscribe(res => {
      if(res.success){
        this.storeList = res.content;
      }
    });
  }

  getBookName(id){
    var sto = new Store();
    this.storeList.forEach(store => {
      if(store.StoreID == id){
        sto = store;
      }
    });
    return sto.StoreName;
  }

  filterBook(){
    var filter = this.filterForm.value;
    this.bookService.filterBook(filter.bookName, filter.storeName).subscribe(res => {
      if(res.success){
        this.bookList = res.content;
        this.bookList.forEach(book => {
          this.checkFavorite(book);
        })
      }
    })
  }

  clearFilter(){
    this.filterForm.reset({
      bookName:'',
      storeName:''
    })
    this.getBook();
  }

  onChange(book){
    if(book.favorite){
      this.favoriteService.addFavorite(book.BookID).subscribe(res => {
        if(!res.success){
          console.log(res);
        }
      });
    }else{
      this.favoriteService.deleteFavorite(book.BookID).subscribe(res => {
        if(!res.success){
          console.log(res);
        }
      });
    }
    this.sleep(500).then(() => {
      this.bookList.forEach(book => {
        this.checkFavorite(book);
      })
    })
  }

  checkFavorite(book: Book){
    this.favoriteService.isFavorite(book.BookID).subscribe(res => {
      if(res.success){
        book.favorite = res.status;
      }
    });
  }

  getScore(book: Book){
    this.bookService.getScore(book).subscribe(res => {
      if(res.success){
        book.rating = res.content.Score;
        if(book.rating == null){ book.rating = 0;}
      }
    })
  }

  sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
}
