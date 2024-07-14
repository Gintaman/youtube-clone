import {
    CanActivate,
    ExecutionContext,
    forwardRef,
    Inject,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/service/user.service';
import { Roles } from '../decorator/roles.decorator';
import { User } from 'src/user/models/user.interface';
import { map } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>(
            'roles',
            context.getHandler(),
        );
        console.log('roles is: ', roles);

        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        // TODO Unsure why its request.user.user... Refer to comment in UserController findAll()
        // on how Passport adds the user property to the request object.
        const user: { user: User } = request.user;
        return roles.indexOf(user?.user?.role?.role) > -1;
    }
}
