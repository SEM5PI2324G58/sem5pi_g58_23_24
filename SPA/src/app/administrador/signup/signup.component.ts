import { Component } from '@angular/core';
import { AuthService } from 'src/serviceInfo/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  constructor(private userService: AuthService) {}

  add(name:string, email:string, telefone:string, nif:string, password:string, role:string): void {
    console.log(name, email, telefone, nif, password, role);
    this.userService.signUp(name, email, telefone, nif, password, role);
  }

}
