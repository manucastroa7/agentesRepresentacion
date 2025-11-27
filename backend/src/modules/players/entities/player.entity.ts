import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Agent } from '../../agents/entities/agent.entity';
import { PlayerVideo } from './player-video.entity';


export enum PlayerStatus {
    SIGNED = 'signed',       // Mi Plantel (Ya firmado)
    WATCHLIST = 'watchlist', // Scouting: Observando
    CONTACTED = 'contacted', // Scouting: Contactado
    PRIORITY = 'priority'    // Scouting: Objetivo Prioritario
}

@Entity('players')
export class Player {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    position: string;

    @Column({ nullable: true })
    nationality: string;

    @Column({ type: 'date', nullable: true })
    birthDate: Date;

    @Column({ type: 'float', nullable: true })
    height: number; // in cm

    @Column({ type: 'float', nullable: true })
    weight: number; // in kg

    @Column({ nullable: true })
    foot: string;

    @Column({ nullable: true })
    avatarUrl: string;

    @Column({ type: 'jsonb', default: [] })
    media: any[]; // Array of { type: 'image' | 'video', url: string, publicId: string }

    @Column({ nullable: true })
    videoUrl: string;

    @Column({ type: 'jsonb', default: [] })
    additionalInfo: Array<{ label: string, value: string }>;

    @Column({ type: 'jsonb', default: {} })
    stats: any; // Flexible stats object

    @ManyToOne(() => Agent)
    @JoinColumn()
    agent: Agent;

    @Column()
    agentId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({
        type: 'enum',
        enum: PlayerStatus,
        default: PlayerStatus.SIGNED // Por defecto va al plantel, o cámbialo a lo que prefieras
    })
    status: PlayerStatus;

    @OneToMany(() => PlayerVideo, (video) => video.player)
    videos: PlayerVideo[];
}
