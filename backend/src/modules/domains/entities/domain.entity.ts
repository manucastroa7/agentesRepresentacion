import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Agent } from '../../agents/entities/agent.entity';

@Entity('domains')
export class Domain {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    domain: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToOne(() => Agent)
    @JoinColumn()
    agent: Agent;

    @Column()
    agentId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
