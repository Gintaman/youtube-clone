// TODO Is this the best way to do this? This file would need to be kept up to date
// with new types. I guess it would be fine, since we can import this enum when running migrations/seeding
export enum RoleType {
    Admin = 'Admin',
    User = 'User',
}
