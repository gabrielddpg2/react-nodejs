import AppError from 'errors/AppError';
import {  getRepository } from 'typeorm';

import Doctor from '../../entities/Doctor';
import Specialty from '../../schemas/Specialty';

interface IRequest {
  id: string;
}

export async function deleteDoctor({ id }: IRequest): Promise<void> {
  const doctorRepository = getRepository(Doctor);
  const specialtyRepository = getRepository(Specialty);

  try {
    // Deletar o médico pelo ID
    const deleteResult = await doctorRepository.delete(id);

    if (deleteResult.affected === 0) {
      throw new AppError('Doctor not found', 404);
    }

    // Buscar e deletar especialidades associadas ao médico
    const specialties = await specialtyRepository.find({ where: { doctor_id: id } });

    if (specialties.length > 0) {
      await specialtyRepository.remove(specialties);
    }
  } catch (err) {
    throw new AppError(err.message || 'Error deleting doctor and specialties');
  }
}
