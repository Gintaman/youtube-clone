import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RoleModule } from 'src/role/role.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule, RoleModule],
    providers: [UserService],
    controllers: [UserController],
    // Export UserService because AuthModule -> RolesGuard needs it
    exports: [UserService],
})
export class UserModule {}
