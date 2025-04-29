import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PinataFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/pinata-files');
        if (response.data.success) {
          setFiles(response.data.files);
        }
      } catch (err) {
        setError('Failed to fetch files');
        console.error('Error fetching files:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) return <div className="text-center p-4">Loading files...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Uploaded Files</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <div
            key={file.ipfsHash}
            className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            {file.metadata?.keyvalues?.fileType?.includes('image') ? (
              <img
                src={file.url}
                alt={file.name}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg mb-2">
                <span className="text-gray-500">File: {file.name}</span>
              </div>
            )}
            <div className="mt-2">
              <h3 className="font-semibold truncate">{file.name}</h3>
              <p className="text-sm text-gray-500">
                {new Date(file.timestamp).toLocaleDateString()}
              </p>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-blue-500 hover:text-blue-700"
              >
                View File
              </a>
            </div>
          </div>
        ))}
      </div>
      {files.length === 0 && (
        <div className="text-center text-gray-500 p-4">
          No files uploaded yet
        </div>
      )}
    </div>
  );
};

export default PinataFiles; 