import React from 'react';
import { DocumentIcon, UploadIcon, DownloadIcon, TrashIcon } from '@heroicons/react/24/outline';

const DocVault = () => {
  const documents = [
    { id: 1, name: 'Medical Report.pdf', date: '2023-10-01' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Doc Vault</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Documents</h2>
            <button className="flex items-center text-green-600 hover:text-green-700">
              <UploadIcon className="h-5 w-5 mr-1" />
              Upload
            </button>
          </div>
          <ul className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <li key={doc.id} className="py-4 flex items-center justify-between hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <DocumentIcon className="h-6 w-6 text-blue-500 mr-3" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">Uploaded on {doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="text-blue-600 hover:text-blue-700">
                    <DownloadIcon className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-700">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DocVault; 