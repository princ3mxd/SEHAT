import { useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { QRCodeSVG } from 'qrcode.react';
import sehatLogo from "../assets/sehat.png"

const generateHealthCardId = () => {
  const prefix = 'HC';
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${random}${timestamp}`;
};

const styles = StyleSheet.create({
  page: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    display: 'flex',
    alignItems: 'center'
  },
  card: {
    width: '100%',
    maxHeight: '50%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    border: '2px solid #2563eb',
    padding: 25,
    marginTop: 20,
    position: 'relative'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  headerLeft: {
    flex: 1
  },
  headerRight: {
    width: 80
  },
  title: {
    fontSize: 24,
    color: '#2563eb',
    fontWeight: 'bold',
    marginBottom: 2
  },
  subtitle: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2
  },
  divider: {
    borderBottom: '1px solid #e5e7eb',
    marginBottom: 15
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  leftColumn: {
    width: '65%'
  },
  rightColumn: {
    width: '30%'
  },
  fieldGroup: {
    marginBottom: 12
  },
  label: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 2
  },
  value: {
    fontSize: 12,
    color: '#111827'
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain'
  },
  emergencySection: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 6,
    marginTop: 15
  },
  emergencyLabel: {
    fontSize: 10,
    color: '#dc2626',
    fontWeight: 'bold',
    marginBottom: 2
  },
  emergencyValue: {
    fontSize: 12,
    color: '#dc2626'
  },
  footer: {
    marginTop: 15,
    paddingTop: 8,
    borderTop: '1px solid #e5e7eb'
  },
  footerText: {
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center'
  },
  cardId: {
    fontSize: 8,
    color: '#4b5563',
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'Courier'
  },
  qrCodeContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 100,
    height: 100
  }
});

const HealthCard = ({ formData }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>Digital Health Card</Text>
              <Text style={styles.subtitle}>Government of India</Text>
              <Text style={styles.subtitle}>Health ID: {formData.insuranceId || 'NA'}</Text>
            </View>
            <View style={styles.headerRight}>
              <Image src={sehatLogo} style={styles.logo} />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.mainContent}>
            <View style={styles.leftColumn}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>FULL NAME</Text>
                <Text style={styles.value}>{formData.name || 'NA'}</Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>AGE / GENDER</Text>
                <Text style={styles.value}>{formData.age || 'NA'} / {formData.gender || 'NA'}</Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>STATE</Text>
                <Text style={styles.value}>{formData.state || 'NA'}</Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>BLOOD GROUP</Text>
                <Text style={styles.value}>{formData.bloodGroup || 'NA'}</Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>HEIGHT / WEIGHT</Text>
                <Text style={styles.value}>{formData.height || 'NA'} cm / {formData.weight || 'NA'} kg</Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>PRIMARY DOCTOR</Text>
                <Text style={styles.value}>{formData.primaryDoctor || 'NA'}</Text>
              </View>
            </View>

            <View style={styles.rightColumn}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>MEDICAL CONDITIONS</Text>
                <Text style={styles.value}>{formData.medicalConditions || 'None'}</Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>ALLERGIES</Text>
                <Text style={styles.value}>{formData.allergies || 'None'}</Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>FAMILY HISTORY</Text>
                <Text style={styles.value}>{formData.familyHistory || 'None'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.emergencySection}>
            <Text style={styles.emergencyLabel}>EMERGENCY CONTACT</Text>
            <Text style={styles.emergencyValue}>{formData.emergencyContact || 'NA'}</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              This is an official digital health identification card. In case of emergency, please contact the number provided above.
            </Text>
            <Text style={styles.cardId}>{formData.cardId || generateHealthCardId()}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const HealthForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    state: '',
    bloodGroup: '',
    emergencyContact: '',
    insuranceId: '',
    primaryDoctor: '',
    medicalConditions: '',
    allergies: '',
    familyHistory: '',
    currentMedications: '',
    height: '',
    weight: '',
    vaccinationHistory: '',
    cardId: generateHealthCardId()
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-3xl font-bold text-white text-center">Digital Health Card</h2>
            <p className="text-blue-100 text-center mt-1">Complete your health profile</p>
          </div>

          <form className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <select name="state" value={formData.state} onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value="">Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                    <input type="number" name="height" value={formData.height} onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                    <input type="number" name="weight" value={formData.weight} onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Medical Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Insurance ID</label>
                  <input type="text" name="insuranceId" value={formData.insuranceId} onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Insurance ID Number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Primary Doctor</label>
                  <input type="text" name="primaryDoctor" value={formData.primaryDoctor} onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Dr. Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Family History</label>
                  <textarea name="familyHistory" value={formData.familyHistory} onChange={handleChange} rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="List any genetic diseases or family medical history..."
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Emergency Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                  <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Medications</label>
                  <textarea name="currentMedications" value={formData.currentMedications} onChange={handleChange} rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="List current medications..."
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Medical History</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                  <textarea name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} rows="2"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="List any medical conditions..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Allergies</label>
                  <textarea name="allergies" value={formData.allergies} onChange={handleChange} rows="2"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="List any allergies..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <PDFDownloadLink
                document={<HealthCard formData={formData} />}
                fileName="digital-health-card.pdf"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition hover:scale-105"
              >
                {({ loading }) =>
                  loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Card...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                      </svg>
                      Download Health Card
                    </span>
                  )
                }
              </PDFDownloadLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HealthForm;
