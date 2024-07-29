import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { createUser } from '../useCases/Points/createUser';
import { registerPoint } from '../useCases/Points/registerPoint';
import PointsHistory from '../entities/PointsHistory';

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

        return response.json(history);
    }
}
