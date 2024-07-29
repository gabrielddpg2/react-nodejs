import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { createUser } from '../useCases/Points/createUser';
import { registerPoint } from '../useCases/Points/registerPoint';
import PointsHistory from '../entities/PointsHistory';
import DailyPoints from '../entities/DailyPoints';
import User from '../entities/User';

export class PointController {
    async createUser(request: Request, response: Response): Promise<Response> {
        const { code } = request.body;

        const user = await createUser({ code });

        return response.json(user);
    }

    async registerPoint(request: Request, response: Response): Promise<Response> {
        const { user_code } = request.body;

        const dailyPoints = await registerPoint({ user_code });

        return response.json(dailyPoints);
    }

    async getPointsHistory(request: Request, response: Response): Promise<Response> {
        const { user_code } = request.params;
        const pointsHistoryRepository = getRepository(PointsHistory);

        const history = await pointsHistoryRepository.find({ where: { user_code } });

        const formattedHistory = history.map(entry => ({
            ...entry,
            date: new Date(entry.date).toLocaleDateString('pt-BR'),
            time: `${String(entry.hours).padStart(2, '0')}:${String(entry.minutes).padStart(2, '0')}`
        }));

        return response.json(formattedHistory);
    }

    async getTodayHours(request: Request, response: Response): Promise<Response> {
        const { user_code } = request.params;
        const dailyPointsRepository = getRepository(DailyPoints);
        const pointsHistoryRepository = getRepository(PointsHistory);

        const dailyPoints = await dailyPointsRepository.findOne({ user_code });

        if (!dailyPoints) {
            return response.status(404).json({ error: 'User not found' });
        }

        let hoursWorkedToday = dailyPoints.hours_today;

        if (dailyPoints.working) {
            const lastRegister = await pointsHistoryRepository.findOne({
                where: { user_code },
                order: { date: 'DESC' },
            });

            if (lastRegister) {
                const now = new Date();
                const minutesWorked = (now.getTime() - new Date(lastRegister.date).getTime()) / 60000;
                hoursWorkedToday += minutesWorked;
            }
        }

        const hours = Math.floor(hoursWorkedToday / 60);
        const minutes = Math.floor(hoursWorkedToday % 60);

        return response.json({
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0')
        });
    }

    async getAllUsers(request: Request, response: Response): Promise<Response> {
        const userRepository = getRepository(User);

        const users = await userRepository.find();

        return response.json(users);
    }
}
