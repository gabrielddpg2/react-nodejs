import AppError from '../../errors/AppError';
import { getMongoRepository, getRepository } from 'typeorm';

import Doctor from '../../entities/Doctor';
import Specialty from '../../schemas/Specialty';

interface IRequest {
  id: string;
}

interface IResponse {
  doctor: Doctor;
  specialties: string[];
}

export async function getOneDoctor({ id }: IRequest): Promise<IResponse> {
  const doctorRepository = getRepository(Doctor);
  const specialtyRepository = getMongoRepository(Specialty, 'mongo');

  const doctor = await doctorRepository.findOne(id);

  if (!doctor) {
    throw new AppError('Doctor not found');
  }

  const doctorSpecialties = await specialtyRepository.findOne({
    where: { doctor_id: id },
  });

  if (!doctorSpecialties) {
    throw new AppError("doctor's specialties not found");
  }

  return {
    doctor,
    specialties: doctorSpecialties.specialties,
  };
}
