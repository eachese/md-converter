"use client";

import { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [docxUrl, setDocxUrl] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
        setError("Invalid file type. Please upload a .md file.");
        setFile(null);
    } else if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.type === 'text/markdown' || selectedFile.name.endsWith('.md')) {
        setFile(selectedFile);
        setError(null);
        setDocxUrl(null);
        setPdfUrl(null);
      } else {
        setError("Invalid file type. Please upload a .md file.");
        setFile(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
        'text/markdown': ['.md'],
    },
    multiple: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  const handleConvert = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setIsConverting(true);
    setError(null);
    setDocxUrl(null);
    setPdfUrl(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const responseFormData = await response.formData();
      const docxBlob = responseFormData.get('docx') as Blob;
      const pdfBlob = responseFormData.get('pdf') as Blob;

      if (docxBlob) {
        setDocxUrl(URL.createObjectURL(docxBlob));
      }
      if (pdfBlob) {
        setPdfUrl(URL.createObjectURL(pdfBlob));
      }

    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred.');
        }
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center">Markdown Converter</h1>
        <div
          {...getRootProps()}
          className={`flex justify-center items-center w-full h-64 px-6 text-center border-2 border-dashed rounded-lg cursor-pointer
            ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50' : 'border-gray-300 dark:border-gray-600'}
            hover:border-blue-400 dark:hover:border-blue-500 transition-colors`}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <input {...(getInputProps() as any)} />
          {file ? (
            <p className="text-lg">{file.name}</p>
          ) : isDragActive ? (
            <p className="text-lg">Drop the file here ...</p>
          ) : (
            <p className="text-lg">Drag and drop a .md file here, or click to select one</p>
          )}
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          onClick={handleConvert}
          disabled={!file || isConverting}
          className="w-full px-4 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isConverting ? 'Converting...' : 'Convert'}
        </button>

        {isConverting && (
            <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="ml-2">Please wait while we convert your file...</p>
            </div>
        )}

        {(docxUrl || pdfUrl) && (
            <div className="p-4 bg-green-50 dark:bg-green-900/50 rounded-lg text-center">
                <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">Conversion Successful!</h2>
                <div className="mt-4 flex flex-col sm:flex-row justify-center gap-4">
                    {docxUrl && (
                        <a
                            href={docxUrl}
                            download
                            className="inline-block px-6 py-2 text-base font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Download DOCX
                        </a>
                    )}
                    {pdfUrl && (
                        <a
                            href={pdfUrl}
                            download
                            className="inline-block px-6 py-2 text-base font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Download PDF
                        </a>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
} 