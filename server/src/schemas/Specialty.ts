import { ObjectID, Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity('specialties')
class Specialties {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({ type: 'array' })
  specialties: string[];

  @Column()
  doctor_id: string;
}

export default Specialties;
