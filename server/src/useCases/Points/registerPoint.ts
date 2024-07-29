import { getRepository } from 'typeorm';
import DailyPoints from '../../entities/DailyPoints';
import PointsHistory from '../../entities/PointsHistory';

interface IRequest {
    user_code: string;
}

export async function registerPoint({ user_code }: IRequest): Promise<DailyPoints> {
    const dailyPointsRepository = getRepository(DailyPoints);
    const pointsHistoryRepository = getRepository(PointsHistory);

    let dailyPoints = await dailyPointsRepository.findOne({ user_code });

    if (!dailyPoints) {
        dailyPoints = dailyPointsRepository.create({ user_code });
        await dailyPointsRepository.save(dailyPoints);
    }

    const now = new Date();

    if (dailyPoints.working) {
        const lastRegister = await pointsHistoryRepository.findOne({
            where: { user_code, date: now.toDateString() },
            order: { date: 'DESC' },
        });

        if (lastRegister) {
            const minutesWorked = (now.getTime() - new Date(lastRegister.date).getTime()) / 60000; // em minutos
            await pointsHistoryRepository.save({
                user_code,
                date: now,
                hours: Math.floor(minutesWorked / 60), // horas
                minutes: Math.floor(minutesWorked % 60) // minutos
            });

            dailyPoints.hours_today += minutesWorked;
            dailyPoints.working = false;
        } else {
            throw new Error('No previous register found for today while trying to stop working.');
        }
    } else {
        await pointsHistoryRepository.save({
            user_code,
            date: now,
            hours: 0,
            minutes: 0
        });

        dailyPoints.working = true;
    }

    await dailyPointsRepository.save(dailyPoints);

    return dailyPoints;
}
