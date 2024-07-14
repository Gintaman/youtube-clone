import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '../models/role.entity';
import { Repository } from 'typeorm';
import { Role } from '../models/role.interface';
import { from, Observable, take } from 'rxjs';
import { RoleType } from '../models/role-type.entity';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>,
        // TODO do we need auth for fetching role ids? does that make sense?
        // roles will not be create-able through API.
        // private readonly authService: AuthService,
    ) {}

    getRoleByType(roleType: string): Observable<Role> {
        return from(this.roleRepository.findOneBy({ role: roleType })).pipe(
            take(1),
        );
    }

    getAdminRole(): Observable<Role> {
        return from(
            this.roleRepository.findOneBy({ role: RoleType.Admin }),
        ).pipe(take(1));
    }

    getUserRole(): Observable<Role> {
        return from(
            this.roleRepository.findOneBy({ role: RoleType.User }),
        ).pipe(take(1));
    }
}
