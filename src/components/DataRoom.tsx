import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, AlertCircle, Download, Search, BookOpen, Tag } from 'lucide-react';
import Fuse from 'fuse.js';
import { marked } from 'marked';
import { uploadFile, getPublicUrl, listFiles, deleteFile } from '../lib/storage';

interface FileWithPreview extends File {
  preview?: string;
  content?: string;
  tags?: string[];
  summary?: string;
  path?: string;
  publicUrl?: string;
}

interface DataRoomProps {
  section: string;
  acceptedFiles?: string[];
  description?: string;
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function DataRoom({ section, acceptedFiles, description }: DataRoomProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fuse = React.useMemo(() => new Fuse(files, {
    keys: ['name', 'content', 'tags', 'summary'],
    includeScore: true,
    threshold: 0.3
  }), [files]);

  const filteredFiles = React.useMemo(() => {
    if (!searchQuery) return files;
    return fuse.search(searchQuery).map(result => result.item);
  }, [searchQuery, files, fuse]);

  useEffect(() => {
    loadFiles();
  }, [section]);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const fileList = await listFiles(section, '');
      const filesWithUrls = await Promise.all(
        fileList.map(async (file: any) => {
          const publicUrl = getPublicUrl(section, file.name);
          return {
            ...file,
            publicUrl,
            preview: file.metadata?.mimetype?.startsWith('image/') ? publicUrl : undefined
          };
        })
      );
      setFiles(filesWithUrls);
    } catch (err) {
      console.error('Error loading files:', err);
      setError('Failed to load files from storage');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeFile = async (file: FileWithPreview) => {
    setIsAnalyzing(true);
    try {
      // Read file content
      const content = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsText(file);
      });

      // Extract key information and generate summary
      const summary = await generateSummary(content);
      const tags = await extractTags(content);

      // Update file with analysis results
      const updatedFile = {
        ...file,
        content,
        summary,
        tags
      };

      setFiles(prev => prev.map(f => f === file ? updatedFile : f));
      setSelectedFile(updatedFile);
    } catch (err) {
      console.error('Error analyzing file:', err);
      setError('Failed to analyze file content');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateSummary = async (content: string): Promise<string> => {
    // Simple summary generation (in real app, use NLP/AI service)
    const words = content.split(/\s+/);
    return words.slice(0, 50).join(' ') + '...';
  };

  const extractTags = async (content: string): Promise<string[]> => {
    // Simple tag extraction (in real app, use NLP/AI service)
    const commonKeywords = ['project', 'budget', 'timeline', 'risk', 'milestone'];
    return commonKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    
    for (const file of acceptedFiles) {
      try {
        // Upload file to Supabase
        await uploadFile(file, section, file.name);
        
        // Add file to local state
        const publicUrl = getPublicUrl(section, file.name);
        const newFile = Object.assign(file, {
          preview: file.type.startsWith('image/') ? publicUrl : undefined,
          publicUrl
        });
        
        setFiles(prev => [...prev, newFile]);
      } catch (err) {
        console.error('Error uploading file:', err);
        setError(`Failed to upload ${file.name}`);
      }
    }
  }, [section]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFiles ? {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md']
    } : undefined,
    maxSize: 50 * 1024 * 1024
  });

  const removeFile = async (fileToRemove: FileWithPreview) => {
    try {
      if (fileToRemove.path) {
        await deleteFile(section, fileToRemove.path);
      }
      setFiles(files => files.filter(file => file !== fileToRemove));
      if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      if (selectedFile === fileToRemove) {
        setSelectedFile(null);
      }
    } catch (err) {
      console.error('Error deleting file:', err);
      setError(`Failed to delete ${fileToRemove.name}`);
    }
  };

  const handleDownload = (file: FileWithPreview) => {
    if (file.publicUrl) {
      window.open(file.publicUrl, '_blank');
    }
  };

  React.useEffect(() => {
    return () => files.forEach(file => {
      if (file.preview && !file.publicUrl) URL.revokeObjectURL(file.preview);
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">{section}</h2>
            {description && (
              <p className="text-gray-600 mt-1">{description}</p>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search files..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-monaco-bronze focus:border-monaco-bronze"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Upload and List */}
          <div className="lg:col-span-2">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mb-6
                ${isDragActive ? 'border-monaco-bronze bg-monaco-bronze/10' : 'border-gray-300 hover:border-monaco-bronze'}`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {isDragActive ? 'Drop the files here...' : 'Drag and drop files here, or click to select files'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supported formats: PDF, Word, Excel, PowerPoint, Images, Text, Markdown (Max 50MB per file)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFiles.map((file, index) => (
                <div 
                  key={index} 
                  className={`relative group border rounded-lg p-4 cursor-pointer transition-all
                    ${selectedFile === file ? 'ring-2 ring-monaco-bronze' : 'hover:border-monaco-bronze'}`}
                  onClick={() => setSelectedFile(file)}
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  
                  {file.tags && file.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {file.tags.map((tag, i) => (
                        <span 
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-monaco-bronze/10 text-monaco-bronze"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file);
                      }}
                      className="bg-monaco-bronze text-white rounded-full p-1 hover:bg-monaco-bronze-light"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file);
                      }}
                      className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Analysis Panel */}
          <div className="lg:col-span-1">
            {selectedFile ? (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Document Analysis</h3>
                  {!selectedFile.content && (
                    <button
                      onClick={() => analyzeFile(selectedFile)}
                      disabled={isAnalyzing}
                      className="flex items-center px-3 py-1 text-sm bg-monaco-bronze text-white rounded-lg hover:bg-monaco-bronze-light disabled:opacity-50"
                    >
                      <BookOpen className="h-4 w-4 mr-1" />
                      {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                    </button>
                  )}
                </div>

                {selectedFile.content ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Summary</h4>
                      <p className="text-sm text-gray-600">{selectedFile.summary}</p>
                    </div>
                    
                    {selectedFile.tags && selectedFile.tags.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedFile.tags.map((tag, i) => (
                            <span 
                              key={i}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-monaco-bronze/10 text-monaco-bronze"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedFile.name.endsWith('.md') && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Preview</h4>
                        <div 
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ 
                            __html: marked(selectedFile.content) 
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <BookOpen className="h-12 w-12 mx-auto mb-2" />
                    <p>Click Analyze to process this document</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="border rounded-lg p-8 text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-2" />
                <p>Select a file to view analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataRoom;