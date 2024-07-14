import { Role } from 'src/role/models/role.interface';

export interface User {
    id: number;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: Role;
}
