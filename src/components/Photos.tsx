import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, X, Download } from 'lucide-react';
import { uploadFile, getPublicUrl, listFiles, deleteFile } from '../lib/storage';

interface PhotosProps {
  section: string;
}

interface PhotoFile extends File {
  preview?: string;
  publicUrl?: string;
  path?: string;
}

function Photos({ section }: PhotosProps) {
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    loadPhotos();
  }, [section]);

  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      const fileList = await listFiles(section, '');
      const photosWithUrls = await Promise.all(
        fileList.map(async (file: any) => {
          const publicUrl = getPublicUrl(section, file.name);
          return {
            ...file,
            publicUrl,
            preview: publicUrl
          };
        })
      );
      setPhotos(photosWithUrls);
    } catch (err) {
      console.error('Error loading photos:', err);
      setError('Failed to load photos');
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    
    for (const file of acceptedFiles) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        continue;
      }

      try {
        await uploadFile(file, section, file.name);
        const publicUrl = getPublicUrl(section, file.name);
        const newPhoto = Object.assign(file, {
          preview: URL.createObjectURL(file),
          publicUrl
        });
        
        setPhotos(prev => [...prev, newPhoto]);
      } catch (err) {
        console.error('Error uploading photo:', err);
        setError(`Failed to upload ${file.name}`);
      }
    }
  }, [section]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const removePhoto = async (photoToRemove: PhotoFile) => {
    try {
      if (photoToRemove.path) {
        await deleteFile(section, photoToRemove.path);
      }
      setPhotos(photos => photos.filter(photo => photo !== photoToRemove));
      if (photoToRemove.preview && !photoToRemove.publicUrl) {
        URL.revokeObjectURL(photoToRemove.preview);
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError(`Failed to delete ${photoToRemove.name}`);
    }
  };

  const handleDownload = (photo: PhotoFile) => {
    if (photo.publicUrl) {
      window.open(photo.publicUrl, '_blank');
    }
  };

  React.useEffect(() => {
    return () => photos.forEach(photo => {
      if (photo.preview && !photo.publicUrl) URL.revokeObjectURL(photo.preview);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-monaco-bronze"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Project Photos</h2>
          <p className="text-gray-600 mt-1">Upload and manage project photos and visual documentation.</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mb-6
            ${isDragActive ? 'border-monaco-bronze bg-monaco-bronze/10' : 'border-gray-300 hover:border-monaco-bronze'}`}
        >
          <input {...getInputProps()} />
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {isDragActive ? 'Drop the photos here...' : 'Drag and drop photos here, or click to select'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Supported formats: JPG, JPEG, PNG, GIF (Max 10MB per file)
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div 
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
              <img
                src={photo.preview || photo.publicUrl}
                alt={photo.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity" />
              <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDownload(photo)}
                  className="bg-monaco-bronze text-white rounded-full p-1.5 hover:bg-monaco-bronze-light"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removePhoto(photo)}
                  className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Photos;