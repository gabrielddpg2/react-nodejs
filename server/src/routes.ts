import { Router } from 'express';
import { DoctorsController } from './controllers/DoctorsController';
import { PointController } from './controllers/pointController';

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


routes.get("/teste", (req, res) => {
    return res.json("testando servidor 222");
});

export default routes;
