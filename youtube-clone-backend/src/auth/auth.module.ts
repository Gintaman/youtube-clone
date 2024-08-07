import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './service/auth.service';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-guard';
import { JwtStrategy } from './guards/jwt-strategy';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './models/refresh-token.entity';

@Module({
    imports: [
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([RefreshToken]),
        JwtModule.registerAsync({
            // Circular dependency here, auth module depends on user module and vice versa
            // (roles guard uses UserService, so AuthModule needs UserModule and UserModule
            // needs AuthModule)
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: '100s',
                },
            }),
        }),
    ],
    providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
