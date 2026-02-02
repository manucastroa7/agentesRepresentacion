import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
    SUPERADMIN = 'superadmin',
    AGENT = 'agent',
    PLAYER = 'player',
    CLUB = 'club',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.AGENT,
    })
    role: UserRole;

    @Column({ nullable: true })
    refreshTokenHash: string;

    @Column({ type: 'json', nullable: true })
    dashboardConfig: any;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
