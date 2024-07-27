import AppError from '../../errors/AppError';
import { getMongoRepository, getRepository } from 'typeorm';
import { parseSpecialties } from '../../utils/parseSpecialties';

import Doctor from '../../entities/Doctor';
import Specialty from '../../schemas/Specialty';

interface IRequest {
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

const specialtiesAvailable = [
  'ALERGOLOGIA',
  'ANGIOLOGIA',
  'BUCO MAXILO',
  'CARDIOLOGIA CLÍNICA',
  'CARDIOLOGIA INFANTIL',
  'CIRURGIA CABEÇA E PESCOÇO',
  'CIRURGIA CARDÍACA',
  'CIRURGIA DE TÓRAX',
];

export async function register({
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

  const doctorAlreadyExists = await doctorRepository.findOne({
    where: { crm },
  });

  if (doctorAlreadyExists) {
    throw new AppError("Doctor's CRM already exists");
  }

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

  parsedSpecialties.map((specialty) => {
    if (!specialtiesAvailable.includes(specialty.toUpperCase())) {
      throw new AppError(`Doctor's specialty: '${specialty}' not is available`);
    }
  });

  const doctor = doctorRepository.create({
    name,
    crm,
    phone_number,
    cellphone_number,
    cep,
    street,
    state,
    city,
  });

  const specialtyRepository = getMongoRepository(Specialty, 'mongo');

  const doctorSpecialties = specialtyRepository.create({
    specialties: parsedSpecialties,
    doctor_id: doctor.id,
  });

  await doctorRepository.save(doctor);
  await specialtyRepository.save(doctorSpecialties);

  return {
    doctor: doctor,
    specialties: doctorSpecialties.specialties,
  };
}
