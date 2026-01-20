import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Player } from '../../players/entities/player.entity';
import { Agent } from '../../agents/entities/agent.entity';

export enum ApplicationStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

@Entity('applications')
export class Application {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Player)
    @JoinColumn()
    player: Player;

    @Column()
    playerId: string;

    @ManyToOne(() => Agent)
    @JoinColumn()
    agent: Agent;

    @Column()
    agentId: string;

    @Column({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING
    })
    status: ApplicationStatus;

    @Column({ type: 'text', nullable: true })
    message: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
