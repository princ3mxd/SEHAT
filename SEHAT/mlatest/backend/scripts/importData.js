import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Hospital from '../models/hospital.model.js';
import Doctor from '../models/doctor.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
const dataPath = path.resolve(__dirname, '../data/doctors_hospitals.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const importHospitals = async () => {
  try {
    await Hospital.deleteMany({});
    const hospitals = await Hospital.insertMany(data.hospitals);
    console.log(`${hospitals.length} hospitals imported successfully`);
    return hospitals;
  } catch (error) {
    console.error('Error importing hospitals:', error);
    throw error;
  }
};


const importDoctors = async (hospitals) => {
  try {
    await Doctor.deleteMany({});
    const hospitalMap = {};
    hospitals.forEach(hospital => {
      hospitalMap[hospital.name] = hospital._id;
    });
    
    const doctors = data.doctors.map(doctor => ({
      ...doctor,
      hospital: hospitalMap[doctor.hospital]
    }));
    
    const insertedDoctors = await Doctor.insertMany(doctors);
    console.log(`${insertedDoctors.length} doctors imported successfully`);
  } catch (error) {
    console.error('Error importing doctors:', error);
    throw error;
  }
};


const importData = async () => {
  try {
    const hospitals = await importHospitals();
    await importDoctors(hospitals);
    console.log('Data import completed successfully');
  } catch (error) {
    console.error('Data import failed:', error);
  } finally {
    mongoose.disconnect();
  }
};

importData(); 