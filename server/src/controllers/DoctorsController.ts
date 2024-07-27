import { Request, Response } from 'express';
import { register } from '../useCases/Doctors/register';
import { getAllRegisteredDoctors } from '../useCases/Doctors/getAllRegisteredDoctors';
import { updateDoctor } from '../useCases/Doctors/updateDoctor';
import { getOneDoctor } from '../useCases/Doctors/getOneDoctor';
import { deleteDoctor } from '../useCases/Doctors/deleteDoctor';

export class DoctorsController {
  async create(request: Request, response: Response): Promise<Response> {
    const {
      name,
      crm,
      phone_number,
      cellphone_number,
      cep,
      street,
      state,
      city,
      specialties,
    } = request.body;

    const doctor = await register({
      name,
      crm,
      phone_number,
      cellphone_number,
      cep,
      street,
      state,
      city,
      specialties,
    });

    return response.json(doctor);
  }

  async index(request: Request, response: Response): Promise<Response> {
    const doctors = await getAllRegisteredDoctors();

    return response.json(doctors);
  }

  async find(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const doctor = await getOneDoctor({ id });

    return response.json(doctor);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const {
      name,
      crm,
      phone_number,
      cellphone_number,
      cep,
      street,
      state,
      city,
      specialties,
    } = request.body;
    const { id } = request.params;

    const doctor = await updateDoctor({
      id,
      name,
      crm,
      phone_number,
      cellphone_number,
      cep,
      street,
      state,
      city,
      specialties,
    });

    return response.json(doctor);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    await deleteDoctor({ id });

    return response.json().status(201);
  }
}
