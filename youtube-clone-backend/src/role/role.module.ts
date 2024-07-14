import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './models/role.entity';
import { RoleService } from './services/role.service';

@Module({
    imports: [TypeOrmModule.forFeature([RoleEntity])],
    providers: [RoleService],
    controllers: [],
    exports: [RoleService],
})
export class RoleModule {}
