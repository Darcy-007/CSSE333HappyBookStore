import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Customer} from "../shared/customer";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  accountForm: FormGroup;
  passForm: FormGroup;
  customer: Customer;
  formErrors = {
    'firstname': '',
    'lastname': '',
    'email': '',
    'phone': ''
  };
  passerror= {
    'oldpass':'',
    'newpass':''
  };
  passMessage: {
    'required': 'Password is required.',
    'pattern': 'Password must contain only a-z, A-Z, 0-9, @, !, ?, _, -',
    'minlength': 'Password must have a minimum length of 5',
    'maxlength': 'Password must have a maximum length of 50'
  };
  validationMessages = {
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
    },
  };
  onValueChanged(data?: any){
    if(!this.accountForm){return;}
    const form = this.accountForm;
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
  passChange(data?: any){
    if(!this.passForm){return;}
    const form = this.passForm;
    for(const field in this.passerror){
      this.passerror[field] = '';
      const control = form.get(field);
      if(control && control.dirty && !control.valid){
        const message = this.passMessage;
        for (const key in control.errors) {
          this.passerror[field] += message[key] + ' ';
        }
      }
    }
  }
  createForm(){
    this.accountForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10),Validators.pattern("^[a-zA-Z]{1,100}$")]],
      lastname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10),Validators.pattern("^[a-zA-Z]{1,100}$")]],
      phone: ['', [Validators.pattern("[0-9]+")]],
      email: ['', [Validators.email, Validators.required]]
    });
    this.passForm = this.fb.group({
      oldpass: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9_@!?-]{1,100}$")]],
      newpass: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9_@!?-]{1,100}$")]]
    });
    this.accountForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.passForm.valueChanges.subscribe(data => this.passChange(data));
    this.passChange();
    this.onValueChanged();
  };

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.createForm();
    this.reset();
  }

  reset(){
    this.userService.getCurrentCustomer().subscribe(res => {
      if(res.success){
        this.customer = <Customer> res.content[0];
        this.clearCustomer();
      }
    });
  }

  update(){
    console.log(this.customer);
    this.userService.updateCustomerInfo(this.customer).subscribe(res => {
      if(res.success){
        alert("Update successfully!");
        this.reset();
      }
    });
  }

  clearCustomer(){
    this.customer.Phone = this.customer.Phone.trim();
    this.customer.Email = this.customer.Email.trim();
    this.customer.Lastname = this.customer.Lastname.trim();
    this.customer.Firstname = this.customer.Firstname.trim();
  }

  changePassword(){
    this.userService.updatePassword(this.passForm.value.oldpass, this.passForm.value.newpass).subscribe(res => {
      if(res.success){
        alert("Password changed!");
        this.passForm.reset();
      }
    })
  }

  ngOnInit() {

  }

}
