import AppError from '../../errors/AppError';
import { AppDataSource } from '../../dataSource/DataSource'; // ajuste o caminho conforme necessário
import { parseSpecialties } from '../../utils/parseSpecialties';

import Doctor from '../../entities/Doctor';
import Specialty from '../../schemas/Specialty'; // ajuste o caminho conforme necessário

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
  const doctorRepository = AppDataSource.getRepository(Doctor);
  const specialtyRepository = AppDataSource.getRepository(Specialty);

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

  const registeredSpecialties: string[] = [];
  parsedSpecialties.forEach((specialty) => {
    if (registeredSpecialties.includes(specialty.toUpperCase())) {
      throw new AppError(`Specialties cannot be repeated`);
    } else {
      registeredSpecialties.push(specialty.toUpperCase());
    }
  });

  parsedSpecialties.forEach((specialty) => {
    if (!specialtiesAvailable.includes(specialty.toUpperCase())) {
      throw new AppError(`Doctor's specialty: '${specialty}' is not available`);
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

  const doctorSpecialties = parsedSpecialties.map((specialty) =>
    specialtyRepository.create({
      name: specialty,
      doctor,
    })
  );

  await doctorRepository.save(doctor);
  await specialtyRepository.save(doctorSpecialties);

  return {
    doctor: doctor,
    specialties: doctorSpecialties.map(s => s.name),
  };
}
