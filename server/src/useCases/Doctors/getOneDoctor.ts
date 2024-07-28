import AppError from '../../errors/AppError';
import { AppDataSource } from '../../dataSource/DataSource'; // ajuste o caminho conforme necessário
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
  const doctorRepository = AppDataSource.getRepository(Doctor);
  const specialtyRepository = AppDataSource.getRepository(Specialty);

  const doctor = await doctorRepository.findOne({ where: { id } });

  if (!doctor) {
    throw new AppError('Doctor not found');
  }

  const doctorSpecialties = await specialtyRepository.find({
    where: { doctor_id: id },
  });

  if (!doctorSpecialties.length) {
    throw new AppError("Doctor's specialties not found");
  }

  return {
    doctor,
    specialties: doctorSpecialties.map(specialty => specialty.name),
  };
}
