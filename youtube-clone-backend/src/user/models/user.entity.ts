// Database entity definition
// TODO migrate to using entity schema (https://typeorm.io/separating-entity-definition)
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEntity } from 'src/role/models/role.entity';
import { RefreshToken } from 'src/auth/models/refresh-token.entity';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    username: string;

    // TODO unique: true here?
    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @ManyToOne(() => RoleEntity, { eager: true })
    role: RoleEntity;

    @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
    refreshTokens: RefreshToken[];

    @BeforeInsert()
    @BeforeUpdate()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}
