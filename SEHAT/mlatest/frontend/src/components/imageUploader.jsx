import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import PinataFiles from './PinataFiles';

const ImageUploader = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [ipfsUrl, setIpfsUrl] = useState('');
  const [error, setError] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = () => {
        setPreview(selectedFile.type.includes('image') ? reader.result : '/document-icon.png');
      };
      reader.readAsDataURL(selectedFile);
    }
  });

  const uploadToPinata = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await axios.post(
        `${apiUrl}/api/upload-to-pinata`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setIpfsUrl(response.data.pinataUrl);
      setIsUploading(false);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Error uploading document');
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-2 text-green-600">Secure Medical Storage</h1>
            <p className="text-gray-600 mb-8">Your medical records, safely stored and easily accessible</p>

            <div className="mb-8">
              <div
                {...getRootProps()}
                className="border-3 border-dashed border-green-400 rounded-xl p-8 text-center cursor-pointer hover:bg-green-50 transition-colors mb-6"
              >
                <input {...getInputProps()} />
                {preview ? (
                  file.type.includes('image') ? (
                    <img
                      src={preview}
                      alt="Document preview"
                      className="max-h-48 mx-auto mb-2 rounded"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <img
                        src="/document-icon.png"
                        alt="Document"
                        className="h-20 w-20 mb-3 opacity-80"
                      />
                      <span className="text-sm text-gray-500">{file.name}</span>
                    </div>
                  )
                ) : (
                  <div className="py-8">
                    <div className="mb-4">
                      <svg className="mx-auto h-12 w-12 text-green-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h20a4 4 0 004-4V28m-4-4v-4m0 0V12a4 4 0 00-4-4h-4m4 16l-4-4m0 0l-4 4m4-4v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-medium mb-2">Drop your medical document here</p>
                    <p className="text-sm text-gray-500">Supports: JPG, PNG, PDF (Max 10MB)</p>
                  </div>
                )}
              </div>

              {file && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{Math.round(file.size / 1024)} KB</p>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview('');
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={uploadToPinata}
              disabled={isUploading || !file}
              className={`w-full py-4 px-6 rounded-lg text-white font-medium text-lg transition-all
                ${isUploading || !file
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-200'}`}
            >
              {isUploading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Securing your document...
                </span>
              ) : (
                'Store Securely'
              )}
            </button>

            {error && (
              <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
            )}

            {ipfsUrl && (
              <div className="mt-6 p-6 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center mb-3">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="font-bold text-green-800">Document Secured!</h2>
                </div>
                <p className="text-sm text-green-700 mb-3">
                  Your document has been encrypted and stored securely. Access it here:
                </p>
                <div className="bg-white p-4 rounded-lg border border-green-100 break-all">
                  <a
                    href={ipfsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline text-sm"
                  >
                    {ipfsUrl}
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg">
            <PinataFiles />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;