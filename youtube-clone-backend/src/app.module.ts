import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            // Entities need to be registered in forFeature() to be autoloaded
            autoLoadEntities: true,
            // FIXME not useable in production, will need to run migrations
            // https://github.com/typeorm/typeorm/blob/master/docs/migrations.md
            // synchronize: true,
            migrations: ['migrations/*.js'],
        }),
        UserModule,
        AuthModule,
        RoleModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
