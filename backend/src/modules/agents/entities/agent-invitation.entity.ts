import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Player } from '../../players/entities/player.entity';

export enum InvitationStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    EXPIRED = 'expired'
}

@Entity('agent_invitations')
export class AgentInvitation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    targetEmail: string;

    @Column()
    targetName: string;

    @Column({ unique: true })
    token: string;

    @Column({
        type: 'enum',
        enum: InvitationStatus,
        default: InvitationStatus.PENDING
    })
    status: InvitationStatus;

    @ManyToOne(() => Player)
    @JoinColumn()
    player: Player;

    @Column()
    playerId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
