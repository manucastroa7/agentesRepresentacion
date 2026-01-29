import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { Agent } from '../../agents/entities/agent.entity';
import { User } from '../../users/entities/user.entity';
import { PlayerVideo } from './player-video.entity';
import { PlayerMedia } from './player-media.entity';


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

    @Column({ type: 'simple-array', nullable: true })
    position: string[]; // Changed to array for multi-select

    @Column({ type: 'jsonb', nullable: true, default: [] })
    tacticalPoints: Array<{ x: number, y: number, label?: string }>; // Custom coordinates

    @Column({ type: 'jsonb', nullable: true, default: [] })
    careerHistory: Array<{ club: string, year: string }>;

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

    @Column({ nullable: true })
    videoUrl: string; // Deprecated, use 'videos' instead

    @Column({ type: 'jsonb', nullable: true, default: [] })
    videoList: Array<{ url: string, title?: string }>; // New field for multiple videos

    @Column({ nullable: true })
    club: string;

    @Column({ nullable: true })
    marketValue: string;

    @Column({ type: 'jsonb', default: [] })
    additionalInfo: Array<{ label: string, value: string, isPublic: boolean }>;

    @Column({ type: 'jsonb', default: {} })
    stats: any; // Flexible stats object

    @ManyToOne(() => Agent, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'agentId' })
    agent: Agent;

    @Column({ nullable: true })
    agentId: string;

    @OneToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @Column({ nullable: true })
    userId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ default: false })
    isMarketplaceVisible: boolean;

    @Column({ type: 'enum', enum: ['Libre', 'Con Contrato', 'Prestamo'], default: 'Con Contrato' })
    contractStatus: string;

    @Column({ default: true })
    showCareerHistory: boolean;

    @Column({
        type: 'enum',
        enum: PlayerStatus,
        default: PlayerStatus.SIGNED
    })
    status: PlayerStatus;

    @Column({ type: 'jsonb', default: {} })
    privateDetails: any; // Private CRM data: contracts, health, family, observations

    @OneToMany(() => PlayerVideo, (video) => video.player, { cascade: true, onDelete: 'CASCADE' })
    videos: PlayerVideo[];

    @OneToMany(() => PlayerMedia, (media) => media.player, { cascade: true })
    media: PlayerMedia[];

    @Column({
        type: 'enum',
        enum: ['FREE_AGENT', 'PENDING_CONFIRMATION', 'PENDING_INVITATION', 'REPRESENTED'],
        default: 'FREE_AGENT'
    })
    representationStatus: string;

    @Column({ nullable: true })
    passport: string;

    @Column({ default: 'DISPONIBLE' })
    availability: string;
}

export enum RepresentationStatus {
    FREE_AGENT = 'FREE_AGENT',
    PENDING_CONFIRMATION = 'PENDING_CONFIRMATION', // Waiting for existing agent to accept
    PENDING_INVITATION = 'PENDING_INVITATION',     // Waiting for new agent to register
    REPRESENTED = 'REPRESENTED'
}
