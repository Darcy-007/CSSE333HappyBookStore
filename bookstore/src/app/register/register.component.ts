import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material";
import {AuthService} from "../service/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Register} from "../shared/login";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  register: Register;
  formErrors = {
    'password' : '',
    'username': '',
    'firstname': '',
    'lastname': '',
    'email': '',
    'phone': ''
  };

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
    },
    'firstname' : {
      'required': 'Firstname is required.',
      'pattern': 'Firstname must contain only a-z, A-Z',
      'minlength': 'Firstname must have a minimum length of 1',
      'maxlength': 'Firstname must have a maximum length of 50'
    },
    'lastname' : {
      'required': 'Lastname is required.',
      'pattern': 'Lastname must contain only a-z, A-Z',
      'minlength': 'Lastname must have a minimum length of 1',
      'maxlength': 'Lastname must have a maximum length of 50'
    },
    'email' : {
      'email' : 'Must follow the email pattern of a@b.c',
      'required': 'Email is required'
    },
    'phone' : {
      'pattern' : 'Phone must contain only number'
    }
  };
  onValueChanged(data?: any){
    if(!this.registerForm){return;}
    const form = this.registerForm;
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
  };
  createForm(){
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10), Validators.pattern("^[a-zA-Z0-9_@!?-]{1,30}$")]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9_@!?-]{1,100}$")]],
      firstname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10),Validators.pattern("^[a-zA-Z]{1,100}$")]],
      lastname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10),Validators.pattern("^[a-zA-Z]{1,100}$")]],
      phone: ['', [Validators.pattern("[0-9]{10}")]],
      email: ['', [Validators.email, Validators.required]]
    });
    this.registerForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  };
  constructor(private dialogRef: MatDialogRef<RegisterComponent>, private auth: AuthService,
              private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
  }

  registerUser(){
    this.register = this.registerForm.value;
    this.auth.register(this.register)
      .subscribe(
        res => {
          console.log(res);
        }
      );
    this.dialogRef.close();
  }


}
