import { RegistrationService } from './registration.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { PasswordValidator } from './shared/password.validator';
import { forbiddenNameValidator } from './shared/username.validator';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  registrationForm!: FormGroup;

  get username() {
    return this.registrationForm.get('username');
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get alternateEmails() {
    return this.registrationForm.get('alternateEmails') as FormArray;
  }

  addAlternateEmail() {
    this.alternateEmails.push(this._fb.control(''));
  }

  constructor(private _fb: FormBuilder, private _registrationService: RegistrationService) {}

  ngOnInit() {
    this.registrationForm = this._fb.group({
      //username: ['Ime', [Validators.required, Validators.minLength(3), forbiddenNameValidator]],
      username: ['Ime', [Validators.required, Validators.minLength(3), forbiddenNameValidator(/password/)]],
      password: [''],
      confirmPassword: [''],
      address: this._fb.group({
        city: [''],
        state: [''],
        postalCode: ['']
      }),
      email: [''],
      subscribe: [false],
      alternateEmails: this._fb.array([])
    }, {validator: PasswordValidator});

    this.registrationForm.get('subscribe')?.valueChanges
      .subscribe(checkedValue => {
        const email = this.registrationForm.get('email');
        if(checkedValue) {
          email?.setValidators(Validators.required);
        }
        else {
          email?.clearValidators();
        }
        email?.updateValueAndValidity();
      });
  }



  title = 'reactive-forms';
  // registrationForm = new FormGroup({
  //   username: new FormControl('ime'),
  //   password: new FormControl(''),
  //   confirmPassword: new FormControl(''),
  //   address: new FormGroup({
  //     city: new FormControl(''),
  //     state: new FormControl(''),
  //     postalCode: new FormControl('')
  //   }),
  //});

  onSUbmit() {
    console.log(this.registrationForm.value);

    this._registrationService.register(this.registrationForm.value)
        .subscribe(
          response => console.log('Success', response),
          error  => console.log('Error', error)
          
        );
  }

  loadApiData() {
    // this.registrationForm.setValue({
    //   username: 'Korisnik',
    //   password: 'test',
    //   confirmPassword: 'test',
    //   address: {
    //     city: 'Grad',
    //     state: 'Država',
    //     postalCode: '88000'
    //     }
    // });

    this.registrationForm.patchValue({
      username: 'Korisnik',
      password: 'test',
      confirmPassword: 'test'
    });
  }
}
