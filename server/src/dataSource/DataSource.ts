import { DataSource } from 'typeorm';
import Doctor from '../entities/Doctor'; 
import Specialty from '../schemas/Specialty'; 

export const AppDataSource = new DataSource({
  type: 'postgres', 
  host: 'your_database_host',
  port: 5432,
  username: 'your_database_username',
  password: 'your_database_password',
  database: 'your_database_name',
  entities: [Doctor, Specialty],
  synchronize: true, 
  logging: false,
});

export const MongoDataSource = new DataSource({
  type: 'mongodb',
  url: 'your_mongo_database_url',
  useUnifiedTopology: true,
  entities: [Specialty],
  synchronize: true, 
  logging: false,
});
