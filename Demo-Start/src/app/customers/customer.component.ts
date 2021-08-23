import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, Validators,AbstractControl, FormArray } from '@angular/forms';
import{ratingRange,CompareEmail} from './rangeVal';
import { Customer } from './customer';
import {debounceTime} from 'rxjs/operators'
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})

export class CustomerComponent implements OnInit {
  customerForm:FormGroup
  customer = new Customer();
  emailMessage='';
  get addresses(): FormArray{
    return <FormArray>this.customerForm.get('addresses');
  }
  private validationMessages={
    required:"Enter your email address",
    email:"Enter valid email address"
  }
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.customerForm= this.fb.group({
      firstName:['',[Validators.required, Validators.minLength(3)]],
      lastName:['',[Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
      email:['',[Validators.required, Validators.email]],
      confirmEmail:['',[Validators.required, Validators.email]]},
      {validators:CompareEmail}
      ),
      sendCatalog:false,
      phone:'',
      notification:'email',
      rating:[null, ratingRange(1,5)],
      addresses: this.fb.array([this.buildAddress()])
    })
    // this.customerForm= new FormGroup({
    //   firstName:new FormControl(),
    //   lastName:new FormControl(),
    //   email:new FormControl(),
    //   sendCatalog:new FormControl(true)
    // })
    this.customerForm.get('notification').valueChanges.subscribe(
      value =>this.setNotification(value)
    )

    const emailControl= this.customerForm.get('emailGroup.email');
    emailControl.valueChanges.pipe(debounceTime(1000)).subscribe(
      value => this.setMessage(emailControl)
    )
  }

  save(): void {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }
  setNotification(notifyVia: string):void{
    const phoneControl=this.customerForm.get('phone')
    if(notifyVia==='text'){
      phoneControl.setValidators(Validators.required)
    }
    else{
      phoneControl.clearValidators()
    }
    phoneControl.updateValueAndValidity()
  }
  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
  }
  buildAddress():FormGroup{
    return this.fb.group({
      addressType:'home',
      street1:'',
      street2:'',
      city:'',
      state:'',
      zip:''
    })
  }

  addAddress():void{
    this.addresses.push(this.buildAddress())
  }
}
