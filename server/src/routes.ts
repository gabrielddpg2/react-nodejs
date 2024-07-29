import { Router } from 'express';
import { DoctorsController } from './controllers/DoctorsController';
import { PointController } from './controllers/PointController';

const routes = Router();

const doctorsController = new DoctorsController();
const pointController = new PointController();

routes.post('/doctors', doctorsController.create);
routes.get('/doctors', doctorsController.index);
routes.get('/doctors/:id', doctorsController.find);
routes.put('/doctors/:id', doctorsController.update);
routes.delete('/doctors/:id', doctorsController.delete);

routes.post('/users', pointController.createUser);
routes.post('/points', pointController.registerPoint);
routes.get('/points/history/:user_code', pointController.getPointsHistory);
routes.get('/points/today/:user_code', pointController.getTodayHours);
routes.get('/users', pointController.getAllUsers);
routes.get('/users/exists/:user_code', pointController.checkUserExists); // Nova rota

routes.get("/teste", (req, res) => {
    return res.json("testando servidor");
});

export default routes;
