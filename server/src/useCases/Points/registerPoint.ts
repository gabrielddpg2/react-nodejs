import { getRepository } from 'typeorm';
import DailyPoints from '../../entities/DailyPoints';
import PointsHistory from '../../entities/PointsHistory';

interface IRequest {
    user_code: string;
    timestamp?: string; // Adicionado para aceitar um timestamp opcional
}

export async function registerPoint({ user_code, timestamp }: IRequest): Promise<DailyPoints> {
    const dailyPointsRepository = getRepository(DailyPoints);
    const pointsHistoryRepository = getRepository(PointsHistory);

    let dailyPoints = await dailyPointsRepository.findOne({ user_code });

    if (!dailyPoints) {
        dailyPoints = dailyPointsRepository.create({ user_code });
        await dailyPointsRepository.save(dailyPoints);
    }

    const now = timestamp ? new Date(timestamp) : new Date();
    const today = now.toISOString().split('T')[0]; // Formatando a data no formato YYYY-MM-DD

    try {
        if (dailyPoints.working && dailyPoints.start_time) {
            const minutesWorked = (now.getTime() - new Date(dailyPoints.start_time).getTime()) / 60000; // em minutos

            // Atualizar o histórico de pontos para a data atual
            let pointsHistory = await pointsHistoryRepository.findOne({
                where: { user_code, date: today },
            });

            if (!pointsHistory) {
                pointsHistory = pointsHistoryRepository.create({
                    user_code,
                    date: today,
                    hours: 0,
                    minutes: 0
                });
            }

            pointsHistory.hours += Math.floor(minutesWorked / 60); // horas
            pointsHistory.minutes += Math.floor(minutesWorked % 60); // minutos

            await pointsHistoryRepository.save(pointsHistory);

            dailyPoints.hours_today += minutesWorked;
            dailyPoints.working = false;
            dailyPoints.start_time = null;
        } else {
            dailyPoints.start_time = now;
            await pointsHistoryRepository.save({
                user_code,
                date: today,
                hours: 0,
                minutes: 0
            });

            dailyPoints.working = true;
        }

        await dailyPointsRepository.save(dailyPoints);
    } catch (error) {
        console.error('Error registering point:', error);
        throw new Error('Internal server error');
    }

    return dailyPoints;
}
