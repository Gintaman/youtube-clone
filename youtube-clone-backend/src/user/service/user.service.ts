import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository } from 'typeorm';
import { User } from '../models/user.interface';
import {
    Observable,
    catchError,
    from,
    map,
    switchMap,
    take,
    throwError,
} from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
import { RoleService } from 'src/role/services/role.service';
import { RoleEntity } from 'src/role/models/role.entity';

// TODO switch to QueryBuilder API from Repository API

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly authService: AuthService,
        private readonly roleSevice: RoleService,
    ) {}

    // TODO need restrictions to disallow randos from creating users through API endpoint.
    // TODO API can only create users with "User" role. Admins can only be added using internal tools
    create(user: User): Observable<User> {
        return from(this.roleSevice.getUserRole()).pipe(
            switchMap((userRole: RoleEntity) => {
                return this.authService.hashPassword(user.password).pipe(
                    switchMap((passwordHash: string) => {
                        const newUser = new UserEntity();
                        newUser.name = user.name;
                        newUser.username = user.username;
                        newUser.email = user.email;
                        newUser.password = passwordHash;
                        // Default users created from UI to User
                        newUser.role = userRole;
                        return from(this.userRepository.save(newUser)).pipe(
                            map((user: User) => this.removePassword(user)),
                            catchError((err) => throwError(() => err)),
                        );
                    }),
                );
            }),
            take(1),
        );
    }

    findOne(id: number): Observable<User> {
        return from(this.userRepository.findOneBy({ id })).pipe(
            map((user: User) => this.removePassword(user)),
            take(1),
        );
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) =>
                users.map((user: User) => this.removePassword(user)),
            ),
            take(1),
        );
    }

    findByEmail(email: string): Observable<User> {
        return from(this.userRepository.findOneBy({ email })).pipe(take(1));
    }

    deleteOne(id: number): Observable<any> {
        return from(this.userRepository.delete(id));
    }

    updateOne(id: number, user: User): Observable<any> {
        // We don't want to allow the user to update email or password simply through an API.
        // They should send a request to reset, and we send them an email with a link.
        // TODO not sure this is the cleanest way to do this, come back to this.
        delete user.email;
        delete user.password;
        return from(this.userRepository.update(id, user)).pipe(take(1));
    }

    // Login takes { email, password }
    login(user: User): Observable<string> {
        if (!user.email || !user.password) {
            // return throwError('Missing email or password');
            return throwError(() => new Error('Missing email or password'));
        }
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => {
                if (user) {
                    return this.authService.generateAuthToken(user);
                }
                return from('Email/password is incorrect');
            }),
        );
    }

    validateUser(email: string, password: string): Observable<User> {
        return this.findByEmail(email).pipe(
            switchMap((user: User) => {
                return this.authService
                    .comparePasswords(password, user.password)
                    .pipe(
                        map((match: boolean) => {
                            if (match) {
                                return this.removePassword(user);
                            }
                            throw Error;
                        }),
                    );
            }),
        );
    }

    // Discard password in the response payload.
    // Not as pretty as destructuring, but would rather avoid no-unused-vars violations.
    // TODO use @Column({ select: false }) to delete automatically
    private removePassword(user: User) {
        delete user.password;
        return user;
    }
}
