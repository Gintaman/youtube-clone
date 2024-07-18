import { Component, OnInit } from '@angular/core';
import { LoginService } from '@services/login/login.service';
import { take, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  constructor(private readonly loginService: LoginService) {}

  public ngOnInit() {
    console.log('login on init');
  }

  public test() {
    console.log('logging in');
    this.loginService
      .login$('user1@test.com', '123456')
      .pipe(
        tap((response) => {
          console.log('log in response: ', response);
        }),
        take(1)
      )
      .subscribe();
  }
}
