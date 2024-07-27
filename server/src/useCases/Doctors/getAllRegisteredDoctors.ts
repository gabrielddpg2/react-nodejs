import AppError from '../../errors/AppError';
import { getMongoRepository, getRepository } from 'typeorm';

import Doctor from '../../entities/Doctor';
import Specialty from '../../schemas/Specialty';

interface IResponse {
  doctor: Doctor;
  specialties: string[];
}

export async function getAllRegisteredDoctors(): Promise<IResponse[]> {
  const doctorRepository = getRepository(Doctor);

  const doctors = await doctorRepository.find();

  const specialtyRepository = getMongoRepository(Specialty, 'mongo');

  const doctorsSpecialties = await specialtyRepository.find();

  const parsedDoctors = doctors.map((doctor) => {
    let doctorSpecialties = doctorsSpecialties.find(
      (doctorSpecialties) => doctorSpecialties.doctor_id === doctor.id
    );

    if (!doctorSpecialties) {
      throw new AppError("doctor's specialties not found");
    }

    return {
      doctor,
      specialties: doctorSpecialties.specialties,
    };
  });

  return parsedDoctors;
}
