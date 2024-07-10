import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../models/user.interface';
import { catchError, map, Observable, of } from 'rxjs';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    create(@Body() user: User): Observable<User | { error: string }> {
        return this.userService
            .create(user)
            .pipe(catchError((err) => of({ error: err.message })));
    }

    // TODO need better error handling
    @Post('login')
    login(
        @Body() user: User,
    ): Observable<{ access_token: string } | { error_message: string }> {
        return this.userService.login(user).pipe(
            map((jwt: string) => {
                return {
                    access_token: jwt,
                };
            }),
            catchError((error) => {
                return of({ error_message: error.message });
            }),
        );
    }

    @Get(':id')
    findOne(@Param('id') id): Observable<User> {
        return this.userService.findOne(id);
    }

    @Get()
    findAll(): Observable<User[]> {
        return this.userService.findAll();
    }

    @Delete(':id')
    deleteOne(@Param('id') id): Observable<User> {
        return this.userService.deleteOne(Number(id));
    }

    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: User) {
        return this.userService.updateOne(Number(id), user);
    }
}
