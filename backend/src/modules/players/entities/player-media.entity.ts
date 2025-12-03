import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Player } from './player.entity';

export type PlayerMediaType = 'image' | 'video';

@Entity('player_media')
export class PlayerMedia {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: ['image', 'video'] })
    type: PlayerMediaType;

    @Column()
    url: string;

    @Column({ nullable: true })
    title?: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Player, (player) => player.media, { onDelete: 'CASCADE' })
    player: Player;
}
