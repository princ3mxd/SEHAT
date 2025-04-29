import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import logo from '../assets/sehat.png';

const PrescriptionUploader = () => {
  const [prescriptionData, setPrescriptionData] = useState({
    patientName: '',
    date: new Date().toISOString().split('T')[0],
    medicines: [
      {
        name: '',
        dosage: '',
        instructions: '',
        frequency: '',
        duration: ''
      }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleInputChange = (e, index = null, field = null) => {
    if (index !== null && field !== null) {
      const updatedMedicines = [...prescriptionData.medicines];
      updatedMedicines[index] = {
        ...updatedMedicines[index],
        [field]: e.target.value
      };
      setPrescriptionData({
        ...prescriptionData,
        medicines: updatedMedicines
      });
    } else {
      setPrescriptionData({
        ...prescriptionData,
        [e.target.name]: e.target.value
      });
    }
  };

  const addMedicine = () => {
    setPrescriptionData({
      ...prescriptionData,
      medicines: [
        ...prescriptionData.medicines,
        {
          name: '',
          dosage: '',
          instructions: '',
          frequency: '',
          duration: ''
        }
      ]
    });
  };

  const removeMedicine = (index) => {
    const updatedMedicines = [...prescriptionData.medicines];
    updatedMedicines.splice(index, 1);
    setPrescriptionData({
      ...prescriptionData,
      medicines: updatedMedicines
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPdfGenerated(false);
    
    try {
      const response = await axios.post('http://localhost:5000/api/create-prescription', {
        prescriptionData
      });
      
      if (response.data.success) {
        setDownloadUrl(`http://localhost:5000${response.data.filePath}`);
        setPdfGenerated(true);
        toast.success('Prescription created successfully!');
      } else {
        toast.error(response.data.error || 'Failed to create prescription');
      }
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast.error('Error creating prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-center mb-6">
        <img src={logo} alt="Logo" className="h-16 mr-4" />
        <h2 className="text-3xl font-bold text-gray-800">Create Prescription</h2>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Patient Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={prescriptionData.patientName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={prescriptionData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Medicines</h3>
              <button
                type="button"
                onClick={addMedicine}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Add Medicine
              </button>
            </div>
            
            <div className="space-y-4">
              {prescriptionData.medicines.map((medicine, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-gray-700">Medicine {index + 1}</h4>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeMedicine(index)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={medicine.name}
                        onChange={(e) => handleInputChange(e, index, 'name')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={medicine.dosage}
                        onChange={(e) => handleInputChange(e, index, 'dosage')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 500mg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency
                      </label>
                      <input
                        type="text"
                        value={medicine.frequency}
                        onChange={(e) => handleInputChange(e, index, 'frequency')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Twice daily"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={medicine.duration}
                        onChange={(e) => handleInputChange(e, index, 'duration')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 7 days"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instructions
                      </label>
                      <textarea
                        value={medicine.instructions}
                        onChange={(e) => handleInputChange(e, index, 'instructions')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="2"
                        placeholder="e.g., Take after meals"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Prescription'}
            </button>            
            {pdfGenerated && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download PDF
              </a>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionUploader; 