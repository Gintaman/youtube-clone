import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, from } from 'rxjs';
import { User } from 'src/user/models/user.interface';
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const bcrypt = require('bcrypt'); // Unfortunate, really don't want to use await
// Remember to npm install @types/bscrypt

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    generateJWT(user: User): Observable<string> {
        return from(this.jwtService.signAsync({ user }));
    }

    hashPassword(password: string): Observable<string> {
        // from<string> to cast from Observable<unknown>
        return from<string>(bcrypt.hash(password, 12));
    }

    // Should return boolean, not sure about the return type defined in bcrypt
    comparePasswords(
        password: string,
        passwordHash: string,
    ): Observable<any | boolean> {
        return from<any | boolean>(bcrypt.compare(password, passwordHash));
    }
}
