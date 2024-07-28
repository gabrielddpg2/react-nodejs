import AppError from '../../errors/AppError';
import { AppDataSource } from '../../dataSource/DataSource'; // ajuste o caminho conforme necessário
import { parseSpecialties } from '../../utils/parseSpecialties';

import Doctor from '../../entities/Doctor';
import Specialty from '../../schemas/Specialty'; // ajuste o caminho conforme necessário

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
  const doctorRepository = AppDataSource.getRepository(Doctor);
  const specialtyRepository = AppDataSource.getRepository(Specialty);

  const doctor = await doctorRepository.findOne({ where: { id } });

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

  const registeredSpecialties: string[] = [];
  parsedSpecialties.forEach((specialty) => {
    if (registeredSpecialties.includes(specialty.toUpperCase())) {
      throw new AppError(`Specialties cannot be repeated`);
    } else {
      registeredSpecialties.push(specialty.toUpperCase());
    }
  });

  const doctorSpecialties = await specialtyRepository.find({
    where: { doctor: { id: doctor.id } },
  });

  if (!doctorSpecialties.length) {
    throw new AppError("Doctor's specialties not found");
  }

  await specialtyRepository.remove(doctorSpecialties);

  const newDoctorSpecialties = parsedSpecialties.map((specialty) =>
    specialtyRepository.create({
      name: specialty,
      doctor,
    })
  );

  await specialtyRepository.save(newDoctorSpecialties);

  return {
    doctor,
    specialties: newDoctorSpecialties.map(s => s.name),
  };
}
