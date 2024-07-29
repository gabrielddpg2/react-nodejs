import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import User from './User';

@Entity('daily_points')
class DailyPoints {
    @PrimaryColumn()
    user_code: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_code' })
    user: User;

    @Column({ default: false })
    working: boolean;

    @Column('float', { default: 0 }) // Alterado para 'float'
    hours_today: number;

    @Column('timestamp', { nullable: true }) // Adicionado para armazenar o horário de início
    start_time: Date | null;
}

export default DailyPoints;
