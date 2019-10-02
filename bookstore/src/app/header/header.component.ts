import {Component,OnInit} from '@angular/core';
import {MatDialog} from "@angular/material";
import {MatListModule} from "@angular/material/list";
import {LoginComponent} from "../login/login.component";
import {AccountComponent} from "../account/account.component";
import {UserService} from "../service/user.service";
import {Customer} from "../shared/customer";
import {Manager} from "../shared/manager";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  usertype = "";
  customer = new Customer();
  manager = new Manager();
  login: boolean;

  constructor(private dialog: MatDialog, private userService: UserService, private router: Router) {
    this.login = this.userService.isLogin();
    this.usertype = localStorage.getItem('userType');
  }


  ngOnInit():void{
    if(this.login){
      if(this.usertype == 'Customer'){
        this.getUser();
      }else if(this.usertype == 'Manager'){
        this.getManager();
      }
    }
  }


  openLoginForm() {
    this.dialog.open(LoginComponent, {width:'400px', height:'350px'});
  }

  openAccountForm(){
    this.dialog.open(AccountComponent, {width:"600px", height:'1200px'});
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    this.router.navigate(['/home']);
    this.login = false;
    alert("Logout successfully!")
  }

  isLogin(){
    if(!this.login){
      if(this.userService.isLogin()){
        var type = localStorage.getItem('userType');
        if(type == 'Customer'){
          this.getUser();
        }else{
          this.getManager();
        }
        this.login = true;

      }
    }
    return this.login;
  }

  getUsername(){
    if(this.usertype == "Customer"){
      return this.customer.Firstname;
    }else{
      return this.manager.ManagerUsername;
    }
  }

  getUser(){
    console.log("customer fetched");
    this.userService.getCurrentCustomer().subscribe(res => {
      if(res.success){
        this.customer = <Customer> res.content[0];
        this.usertype = "Customer";
      }
    });
  }

  getManager(){
    console.log("manager fetched")
    this.userService.getCurrentManager().subscribe(res => {
      if(res.success){
        this.manager = <Manager> res.content[0];
        this.usertype = "Manager";
      }
    })
  }

}
