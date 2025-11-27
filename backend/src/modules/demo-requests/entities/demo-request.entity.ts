import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum DemoRequestStatus {
    PENDING = 'pending',
    CONTACTED = 'contacted',
    REJECTED = 'rejected',
}

@Entity('demo_requests')
export class DemoRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fullName: string;

    @Column()
    email: string;

    @Column()
    agencyName: string;

    @Column({ type: 'text', nullable: true })
    message: string;

    @Column({
        type: 'enum',
        enum: DemoRequestStatus,
        default: DemoRequestStatus.PENDING,
    })
    status: DemoRequestStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
