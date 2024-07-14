import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../models/user.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RoleService } from 'src/role/services/role.service';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
        private roleService: RoleService,
    ) {}

    // TODO Handle errors:
    // - Username already exists
    // - Email already exists
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

    /**
     * TODO
     * Passport's AuthGuard will add a "user" property (populated by Passport during the
     * passport-local authentication flow). This seems to happen during the JwtService.signAsync
     * call. I'm not sure if this is an issue. Since we have the full User object here that we loaded
     * through the UserService login -> validateUser -> findByEmail path, we don't need to load it again like
     * the video suggests. From the tutorial, it relies on a User property in the request anyway... We'll leave
     * it alone for now.
     *
     * Read up more on passport: https://docs.nestjs.com/recipes/passport#jwt-functionality
     */
    @Roles('Admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
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
