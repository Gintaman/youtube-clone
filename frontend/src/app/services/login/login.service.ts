import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private readonly httpClient: HttpClient) {}

  public login$(email: string, password: string) {
    return from(
      // TODO http://localhost:3000/api/v1/login gives CORS error
      this.httpClient.post('/api/v1/users/login', {
        email,
        password,
      })
    );
  }
}
