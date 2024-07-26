import { UserEntity } from 'src/user/models/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @ManyToOne(() => UserEntity, (user) => user.refreshTokens, {
        onDelete: 'CASCADE',
    })
    user: UserEntity;

    @Column()
    expires: Date;
}
