import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material";
import {RegisterComponent} from "../register/register.component";
import {AuthService} from "../service/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Login, Usertype} from '../shared/login';
import {Router} from "@angular/router";
import {Customer} from "../shared/customer";
import {UserService} from "../service/user.service";
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  login: Login;
  userType = Usertype;
  formErrors = {
    'password' : '',
    'username' : ''
  };

  submit = false;

  validationMessages = {
    'username' : {
      'required': 'Username is required.',
      'pattern': 'Username must contain only a-z, A-Z, 0-9, @, !, ?, _, -',
      'minlength': 'Username must have a minimum length of 5',
      'maxlength': 'Username must have a maximum length of 10'
    },
    'password' : {
      'required': 'Password is required.',
      'pattern': 'Password must contain only a-z, A-Z, 0-9, @, !, ?, _, -',
      'minlength': 'Password must have a minimum length of 5',
      'maxlength': 'Password must have a maximum length of 50'
    }
  };



  constructor(private dialogRef: MatDialogRef<LoginComponent>, private dialog: MatDialog,
              private auth: AuthService,
              private fb: FormBuilder,
              private router: Router) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm(){
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10), Validators.pattern("^[a-zA-Z0-9_@!?-]{1,30}$")]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9_@!?-]{1,100}$")]],
      usertype: 'Customer'
    });
    this.loginForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  };

  onValueChanged(data?: any){
    if(!this.loginForm){return;}
    const form = this.loginForm;
    for(const field in this.formErrors){
      this.formErrors[field] = '';
      const control = form.get(field);
      if(control && control.dirty && !control.valid) {
        const message = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += message[key] + ' ';
        }
      }
    }
}

  onSubmit() {
    this.login = this.loginForm.value;
    this.submit = true;
    if(this.login.usertype == 'Customer'){
      this.auth.login(this.login).subscribe(res => {
        console.log(res);
        if (res.success) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('userType', res.userType);
          alert(res.userType + " Login Succeeded!");
          this.router.navigate([this.router.url]);
        }
      }, err => {
        alert("Login Failed!")
      });
    }else if (this.login.usertype == 'Manager'){
      this.auth.managerLogin(this.login).subscribe(res => {
        console.log(res);
        if (res.success) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('userType', res.userType);
          alert(res.userType + " Login Succeeded!");
          this.router.navigate([this.router.url]);
        }
      }, err => {
        alert("Login Failed!")
      });
    }
    this.loginForm.reset({
      username: '',
      password: '',
      usertype: 'Customer'
    });
    this.dialogRef.close();
  }

  newUser(){
    this.dialog.open(RegisterComponent, {width:'400px', height:'600px'});
    this.dialogRef.close();
  }

}
