import Appointment from '../models/appointment.model.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'mahi13singh2004@gmail.com',
    pass: 'fcqxprzrmjxdxvxp'
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

const createMeet = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId)
      .populate('user', 'email name')
      .populate('doctor', 'email name');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }


    const meetingId = Math.random().toString(36).substring(2, 15);
    const meetLink = `https://meet.jit.si/${meetingId}`;

    appointment.meetLink = meetLink;
    await appointment.save();

    res.status(200).json({
      message: 'Meet created successfully',
      meetLink: meetLink,
    });
  } catch (error) {
    console.error('Error creating meet:', error);
    res.status(500).json({ 
      message: 'Error creating meet', 
      error: error.message
    });
  }
};

const uploadPrescription = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const file = req.file;

    if (!file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate('user', 'email name');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (!appointment.user?.email) {
      return res.status(400).json({ message: 'No email found for the patient' });
    }

    try {
      await transporter.sendMail({
        from: 'mahi13singh2004@gmail.com',
        to: appointment.user.email,
        subject: 'Thanks For Using Services Of SEHAT',
        text: 'Please find your prescription attached.',
        attachments: [{
          filename: file.originalname,
          content: file.buffer
        }]
      });
      console.log('Email sent successfully to:', appointment.user.email);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    await Appointment.findByIdAndUpdate(appointmentId, { 
      status: 'completed',
      prescriptionUrl: `/prescriptions/${file.filename}`
    });

    res.status(200).json({ 
      message: 'Prescription uploaded successfully',
      prescriptionUrl: `/prescriptions/${file.filename}`
    });
  } catch (error) {
    console.error('Error processing prescription:', error);
    res.status(500).json({ 
      message: 'Error processing prescription', 
      error: error.message
    });
  }
};

export { createMeet, uploadPrescription }; 