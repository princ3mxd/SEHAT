import React, { useState } from 'react';

const HealthcareAIApp = () => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [showDiagnosis, setShowDiagnosis] = useState(false);
    const [scanType, setScanType] = useState('chest_xray'); 
 
    const diseaseDatabase = {
        chest_xray: {
            pneumonia: {
                name: "Pneumonia",
                color: "bg-red-100 text-red-800",
                icon: "🫁",
                description: "Infection that inflames air sacs in one or both lungs",
                severity: "Moderate",
                action: "Consult a pulmonologist immediately",
                symptoms: "Cough, fever, difficulty breathing"
            },
            tuberculosis: {
                name: "Tuberculosis",
                color: "bg-orange-100 text-orange-800",
                icon: "🦠",
                description: "Bacterial infection that mainly affects the lungs",
                severity: "High",
                action: "Requires long-term antibiotic treatment",
                symptoms: "Chronic cough, weight loss, night sweats"
            },
            lung_cancer: {
                name: "Lung Cancer",
                color: "bg-pink-100 text-pink-800",
                icon: "🎗",
                description: "Malignant tumor in lung tissue",
                severity: "High",
                action: "Immediate oncology consultation",
                symptoms: "Persistent cough, chest pain, weight loss"
            },
            pneumothorax: {
                name: "Pneumothorax",
                color: "bg-blue-100 text-blue-800",
                icon: "💨",
                description: "Collapsed lung due to air leakage",
                severity: "Moderate to High",
                action: "Seek emergency care if severe",
                symptoms: "Sudden chest pain, shortness of breath"
            }
        },
        brain_mri: {
            glioma: {
                name: "Glioma",
                color: "bg-purple-100 text-purple-800",
                icon: "🧠",
                description: "Type of tumor that occurs in the brain and spinal cord",
                severity: "High",
                action: "Neurology and oncology consultation",
                symptoms: "Headaches, nausea, seizures"
            },
            stroke: {
                name: "Stroke",
                color: "bg-red-100 text-red-800",
                icon: "⚡",
                description: "Brain damage from interruption of blood supply",
                severity: "Emergency",
                action: "Immediate medical attention required",
                symptoms: "Face drooping, arm weakness, speech difficulty"
            },
            alzheimer: {
                name: "Alzheimer's Disease",
                color: "bg-gray-100 text-gray-800",
                icon: "🧓",
                description: "Progressive brain disorder affecting memory",
                severity: "Chronic",
                action: "Neurology consultation",
                symptoms: "Memory loss, confusion, mood changes"
            }
        },
        bone_xray: {
            fracture: {
                name: "Fracture",
                color: "bg-yellow-100 text-yellow-800",
                icon: "🦴",
                description: "Break in the continuity of the bone",
                severity: "Varies by location",
                action: "Consult an orthopedist",
                symptoms: "Pain, swelling, deformity"
            },
            osteoporosis: {
                name: "Osteoporosis",
                color: "bg-teal-100 text-teal-800",
                icon: "🦴",
                description: "Bones become weak and brittle",
                severity: "Chronic",
                action: "Endocrinology consultation",
                symptoms: "Back pain, loss of height, stooped posture"
            },
            arthritis: {
                name: "Arthritis",
                color: "bg-amber-100 text-amber-800",
                icon: "🖐",
                description: "Inflammation of one or more joints",
                severity: "Chronic",
                action: "Rheumatology consultation",
                symptoms: "Joint pain, stiffness, swelling"
            }
        },
        abdominal_ultrasound: {
            gallstones: {
                name: "Gallstones",
                color: "bg-green-100 text-green-800",
                icon: "💎",
                description: "Hardened deposits in the gallbladder",
                severity: "Moderate",
                action: "Gastroenterology consultation",
                symptoms: "Abdominal pain, nausea, vomiting"
            },
            appendicitis: {
                name: "Appendicitis",
                color: "bg-red-100 text-red-800",
                icon: "⚠",
                description: "Inflammation of the appendix",
                severity: "Emergency",
                action: "Immediate surgical consultation",
                symptoms: "Abdominal pain, fever, loss of appetite"
            },
            liver_cirrhosis: {
                name: "Liver Cirrhosis",
                color: "bg-brown-100 text-brown-800",
                icon: "🍺",
                description: "Late stage of scarring (fibrosis) of the liver",
                severity: "Severe",
                action: "Hepatology consultation",
                symptoms: "Fatigue, easy bruising, jaundice"
            }
        },
        normal: {
            name: "Normal",
            color: "bg-green-100 text-green-800",
            icon: "✅",
            description: "No abnormalities detected",
            severity: "None",
            action: "Continue regular checkups",
            symptoms: "None"
        }
    };

    const analyzeMedicalImage = async () => {
        if (!image) return;
        setLoading(true);
        setError(null);
        setShowDiagnosis(false);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const scanDiseases = diseaseDatabase[scanType] || {};
            const diseaseKeys = Object.keys(scanDiseases);

            const mockResponses = diseaseKeys.map(disease => ({
                disease,
                confidence: Math.random() * 0.8 + 0.1
            }));

            mockResponses.push({
                disease: "normal",
                confidence: Math.random() * 0.3
            });

            const validPredictions = mockResponses.filter(d => d.confidence > 0.15);
            const topPrediction = validPredictions.sort((a, b) => b.confidence - a.confidence)[0];

            setPrediction({
                disease: topPrediction?.disease || "normal",
                confidence: topPrediction?.confidence || 0.95,
                alternatives: validPredictions
                    .filter(d => d.disease !== topPrediction?.disease)
                    .slice(0, 3)
            });
            setTimeout(() => setShowDiagnosis(true), 300);
        } catch (err) {
            console.error('Error analyzing image:', err);
            setError('Failed to analyze image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setError(null);
            setPrediction(null);
            setShowDiagnosis(false);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const getDiseaseInfo = (diseaseKey) => {
        if (diseaseKey === "normal") return diseaseDatabase.normal;
        return diseaseDatabase[scanType]?.[diseaseKey] || diseaseDatabase.normal;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Comprehensive Medical Image Analyzer
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                        AI-powered analysis for various medical imaging modalities
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Your Medical Image</h2>
                                <p className="text-gray-600">Select scan type and upload your image for analysis</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="scan-type" className="block text-sm font-medium text-gray-700 mb-1">
                                        Scan Type
                                    </label>
                                    <select
                                        id="scan-type"
                                        value={scanType}
                                        onChange={(e) => setScanType(e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option value="chest_xray">Chest X-ray</option>
                                        <option value="brain_mri">Brain MRI</option>
                                        <option value="bone_xray">Bone X-ray</option>
                                        <option value="abdominal_ultrasound">Abdominal Ultrasound</option>
                                    </select>
                                </div>

                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-300">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                                    >
                                        <div className="p-3 bg-blue-100 rounded-full">
                                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                            </svg>
                                        </div>
                                        <span className="text-blue-600 font-medium">
                                            {image ? 'Change Image' : 'Click to Upload'}
                                        </span>
                                        <span className="text-sm text-gray-500">Supports JPG, PNG up to 10MB</span>
                                    </label>
                                </div>
                            </div>

                            {image && (
                                <div className="flex justify-center">
                                    <div className="relative group">
                                        <img
                                            src={image}
                                            alt="Uploaded medical scan"
                                            className="max-h-80 rounded-lg shadow-md border border-gray-200 transform group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <button className="bg-white bg-opacity-90 rounded-full p-2 shadow-lg">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={analyzeMedicalImage}
                                disabled={!image || loading}
                                className={`w-full py-3 px-6 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center space-x-2 ${!image || loading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:from-blue-700 hover:to-indigo-700'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Analyzing...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                                        </svg>
                                        <span>Analyze Scan</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Diagnosis Results</h2>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {loading && !prediction ? (
                            <div className="space-y-6">
                                <div className="animate-pulse flex space-x-4 items-center">
                                    <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                                    <div className="flex-1 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                            </div>
                        ) : prediction ? (
                            <div className={`space-y-6 transition-opacity duration-500 ${showDiagnosis ? 'opacity-100' : 'opacity-0'}`}>
                                    <div className={`p-6 rounded-xl ${getDiseaseInfo(prediction.disease).color} transition-all duration-500 transform ${showDiagnosis ? 'scale-100' : 'scale-95'}`}>
                                    <div className="flex items-start space-x-4">
                                        <span className="text-3xl">{getDiseaseInfo(prediction.disease).icon}</span>
                                        <div>
                                            <h3 className="text-xl font-bold">{getDiseaseInfo(prediction.disease).name}</h3>
                                            <div className="mt-2 flex items-center">
                                                <span className="text-sm font-medium">Confidence: {(prediction.confidence * 100).toFixed(1)}%</span>
                                                <div className="ml-2 w-full bg-white bg-opacity-50 rounded-full h-2">
                                                    <div
                                                        className="h-2 rounded-full"
                                                        style={{
                                                            width: `${prediction.confidence * 100}%`,
                                                            backgroundColor: getDiseaseInfo(prediction.disease).color.split(' ')[1].replace('text-', 'bg-')
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h4 className="font-medium text-gray-800">Description</h4>
                                        <p className="mt-1 text-gray-600">{getDiseaseInfo(prediction.disease).description}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <h4 className="font-medium text-gray-800">Severity</h4>
                                            <p className="mt-1 text-gray-600">{getDiseaseInfo(prediction.disease).severity}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <h4 className="font-medium text-gray-800">Common Symptoms</h4>
                                            <p className="mt-1 text-gray-600">{getDiseaseInfo(prediction.disease).symptoms}</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <h4 className="font-medium text-blue-800">Recommended Action</h4>
                                        <p className="mt-1 text-blue-700">{getDiseaseInfo(prediction.disease).action}</p>
                                    </div>
                                </div>

                                {prediction.alternatives.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-gray-800 mb-3">Other Possible Conditions</h4>
                                        <div className="space-y-3">
                                            {prediction.alternatives.map((alt, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-4 rounded-lg ${getDiseaseInfo(alt.disease).color} bg-opacity-50`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-xl">{getDiseaseInfo(alt.disease).icon}</span>
                                                            <span>{getDiseaseInfo(alt.disease).name}</span>
                                                        </div>
                                                        <span className="text-sm font-medium">{(alt.confidence * 100).toFixed(1)}%</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-500">Disclaimer: This AI analysis is for informational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider for diagnosis and treatment.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="mx-auto h-48 w-48 text-gray-300 mb-4">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No scan analyzed yet</h3>
                                <p className="mt-2 text-gray-600">Upload a medical image to get AI-powered analysis</p>
                                <p className="mt-1 text-sm text-gray-500">Select the scan type and upload your image for diagnosis</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthcareAIApp;