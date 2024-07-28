import { DataSource } from 'typeorm';
import Doctor from '../entities/Doctor'; 
import Specialty from '../schemas/Specialty'; 

export const AppDataSource = new DataSource({
  type: 'postgres', 
  host: '',
  port: 5432,
  username: '',
  password: '',
  database: '',
  entities: [Doctor, Specialty],
  synchronize: true, 
  logging: false,
});

export const MongoDataSource = new DataSource({
  type: 'mongodb',
  url: '',
  useUnifiedTopology: true,
  entities: [Specialty],
  synchronize: true, 
  logging: false,
});
