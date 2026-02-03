import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum AgentPlan {
    FREE = 'free',
    PRO = 'pro',
    ENTERPRISE = 'enterprise',
}

export enum AgentStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING = 'pending',
}

@Entity('agents')
export class Agent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    agencyName: string;

    @Column({ nullable: true })
    logo: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    location: string;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ nullable: true })
    website: string;

    @Column({ type: 'jsonb', nullable: true, default: () => "'{}'" })
    socialLinks: {
        instagram?: string;
        linkedin?: string;
        twitter?: string;
    };

    @Column({ type: 'jsonb', nullable: true, default: () => "'{}'" })
    branding: {
        primaryColor?: string;
    };

    @Column({ unique: true })
    slug: string; // For subdomain

    @Column({ nullable: true })
    customDomain: string;

    @Column({
        type: 'enum',
        enum: AgentPlan,
        default: AgentPlan.FREE,
    })
    plan: AgentPlan;

    @Column({
        type: 'enum',
        enum: AgentStatus,
        default: AgentStatus.ACTIVE,
    })
    status: AgentStatus;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @Column()
    userId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
