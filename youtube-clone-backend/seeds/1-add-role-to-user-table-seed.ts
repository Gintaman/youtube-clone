import { AppDataSource } from '../data-source';
import { RoleEntity } from '../src/role/models/role.entity';

const seedRoles = async () => {
    await AppDataSource.initialize();

    const roleRepository = AppDataSource.getRepository(RoleEntity);

    const roles = [{ role: 'Admin' }, { role: 'User' }];

    for (const roleData of roles) {
        const role = roleRepository.create(roleData);
        await roleRepository.save(role);
    }

    await AppDataSource.destroy();
};

seedRoles()
    .then(() => {
        console.log('Roles seeded');
    })
    .catch((error) => {
        console.error('Error seeding roles: ', error);
    });
