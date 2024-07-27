import { createConnections } from 'typeorm';
import { doctorsSeeds } from './0001_Doctors.seed';

async function runSeeds() {
  try {
    await createConnections();
    await doctorsSeeds();
    console.log('seeds executed with success ✨');
    return;
  } catch (err) {
    console.log(err);
    return;
  }
}

runSeeds();
