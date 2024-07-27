import AppError from '../../errors/AppError';
import { getMongoRepository, getRepository } from 'typeorm';
import { parseSpecialties } from '../../utils/parseSpecialties';

import Doctor from '../../entities/Doctor';
import Specialty from '../../schemas/Specialty';

interface IRequest {
  id: string;
  name: string;
  crm: string;
  phone_number: string;
  cellphone_number: string;
  cep: string;
  street: string;
  state: string;
  city: string;
  specialties: string;
}

interface IResponse {
  doctor: Doctor;
  specialties: string[];
}

export async function updateDoctor({
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
}: IRequest): Promise<IResponse> {
  const doctorRepository = getRepository(Doctor);
  const specialtyRepository = getMongoRepository(Specialty, 'mongo');

  const doctor = await doctorRepository.findOne(id);

  if (!doctor) {
    throw new AppError('Doctor not found');
  }

  doctor.name = name;
  doctor.crm = crm;
  doctor.phone_number = phone_number;
  doctor.cellphone_number = cellphone_number;
  doctor.cep = cep;
  doctor.street = street;
  doctor.state = state;
  doctor.city = city;

  await doctorRepository.save(doctor);

  const parsedSpecialties = parseSpecialties(specialties);

  if (parsedSpecialties.length < 2) {
    throw new AppError(`The doctor must have at least 2 specialties`);
  }

  const registeredSpecialties = [''];
  parsedSpecialties.map((specialty) => {
    if (registeredSpecialties.includes(specialty.toUpperCase())) {
      throw new AppError(`specialties cannot be repeated`);
    } else {
      registeredSpecialties.push(specialty);
    }
  });

  const doctorsSpecialties = await specialtyRepository.findOne({
    where: { doctor_id: doctor.id },
  });

  if (!doctorsSpecialties) {
    throw new AppError("doctor's specialties not found");
  }

  doctorsSpecialties.specialties = parsedSpecialties;

  await specialtyRepository.save(doctorsSpecialties);

  return {
    doctor,
    specialties: parsedSpecialties,
  };
}
