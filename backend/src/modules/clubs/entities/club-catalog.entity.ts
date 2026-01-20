import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('club_catalog')
export class ClubCatalog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index() // Index for faster search
    officialName: string;

    @Column({ nullable: true })
    shortName: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    logoUrl: string;

    @Column({ default: false })
    isVerified: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
