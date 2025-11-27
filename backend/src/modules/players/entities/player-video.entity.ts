import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Player } from './player.entity';

@Entity('player_videos')
export class PlayerVideo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    url: string;

    @Column()
    publicId: string;

    @ManyToOne(() => Player, (player) => player.videos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'playerId' })
    player: Player;

    @Column()
    playerId: string;

    @CreateDateColumn()
    createdAt: Date;
}
