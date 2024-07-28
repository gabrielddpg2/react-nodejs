import AppError from '../../errors/AppError';
import { AppDataSource } from '../../dataSource/DataSource'; // ajuste o caminho conforme necessário
import Doctor from '../../entities/Doctor';
import Specialty from '../../schemas/Specialty';

interface IResponse {
  doctor: Doctor;
  specialties: string[];
}

export async function getAllRegisteredDoctors(): Promise<IResponse[]> {
  const doctorRepository = AppDataSource.getRepository(Doctor);
  const specialtyRepository = AppDataSource.getRepository(Specialty);

  const doctors = await doctorRepository.find();
  const doctorsSpecialties = await specialtyRepository.find();

  const parsedDoctors = doctors.map((doctor) => {
    const doctorSpecialties = doctorsSpecialties.filter(
      (specialty) => specialty.doctor_id === doctor.id
    );

    if (!doctorSpecialties.length) {
      throw new AppError("Doctor's specialties not found");
    }

    return {
      doctor,
      specialties: doctorSpecialties.map(specialty => specialty.name),
    };
  });

  return parsedDoctors;
}
