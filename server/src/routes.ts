import { Router } from 'express';
import { DoctorsController } from './controllers/DoctorsController';

const routes = Router();

const doctorsController = new DoctorsController();

routes.post('/doctors', doctorsController.create);
routes.get('/doctors', doctorsController.index);
routes.get('/doctors/:id', doctorsController.find);
routes.put('/doctors/:id', doctorsController.update);
routes.delete('/doctors/:id', doctorsController.delete);

export default routes;
