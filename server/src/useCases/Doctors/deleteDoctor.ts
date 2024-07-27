import AppError from 'errors/AppError';
import { getMongoRepository, getRepository } from 'typeorm';

import Doctor from '../../entities/Doctor';
import Specialty from '../../schemas/Specialty';

interface IRequest {
  id: string;
}

export async function deleteDoctor({ id }: IRequest): Promise<void> {
  const doctorRepository = getRepository(Doctor);
  const specialtyRepository = getMongoRepository(Specialty, 'mongo');

  try {
    await doctorRepository.delete(id);

    await specialtyRepository.findOneAndDelete({ doctor_id: id });
  } catch (err) {
    throw new AppError(err);
  }
}
