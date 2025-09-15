'use client';

import React, { useState, useCallback } from 'react';
import { Upload, X, FileImage, FileVideo, FileAudio, FileText, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';

interface UploadContentProps {
  onUploadComplete?: (result: UploadResult) => void;
  onUploadError?: (error: string) => void;
  maxFileSize?: number;
  allowedTypes?: string[];
  className?: string;
}

interface UploadResult {
  contentCid: string;
  metadataCid: string;
  gatewayUrl: string;
  metadata: ContentMetadata;
}

interface ContentMetadata {
  contentId: string;
  creatorId: string;
  title: string;
  description: string;
  mediaType: 'image' | 'video' | 'audio' | 'text';
  mediaUrl: string;
  tags: string[];
  revenueShareSplitId: string;
  originalContentId?: string;
  remixChain: string[];
  createdAt: string;
  updatedAt: string;
  license?: string;
  attributes?: Record<string, any>;
}

export function UploadContent({
  onUploadComplete,
  onUploadError,
  maxFileSize = 100 * 1024 * 1024, // 100MB
  allowedTypes = ['image/', 'video/', 'audio/', 'text/'],
  className = ''
}: UploadContentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [revenueSplit, setRevenueSplit] = useState('100'); // Default 100% to creator

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    // Validate file size
    if (file.size > maxFileSize) {
      onUploadError?.(`File size exceeds maximum allowed size of ${maxFileSize / (1024 * 1024)}MB`);
      return;
    }

    // Validate file type
    const isAllowedType = allowedTypes.some(type => file.type.startsWith(type));
    if (!isAllowedType) {
      onUploadError?.(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <FileImage className="w-8 h-8 text-blue-500" />;
    if (file.type.startsWith('video/')) return <FileVideo className="w-8 h-8 text-red-500" />;
    if (file.type.startsWith('audio/')) return <FileAudio className="w-8 h-8 text-green-500" />;
    return <FileText className="w-8 h-8 text-gray-500" />;
  };

  const getMediaType = (file: File): 'image' | 'video' | 'audio' | 'text' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'text';
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      onUploadError?.('Please select a file and enter a title');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Import storage utilities dynamically to avoid SSR issues
      const { createStorage, defaultStorageConfig } = await import('@/lib/storage');

      // Get Web3.Storage token from environment
      const token = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;
      if (!token) {
        throw new Error('Web3.Storage token not configured');
      }

      const storage = createStorage({
        ...defaultStorageConfig,
        web3StorageToken: token,
        maxFileSize,
        allowedTypes
      } as any);

      // Generate content ID
      const contentId = `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Mock creator ID (in real app, get from wallet/auth)
      const creatorId = 'creator-123';

      const metadata = {
        contentId,
        creatorId,
        title: title.trim(),
        description: description.trim(),
        mediaType: getMediaType(selectedFile),
        tags,
        revenueShareSplitId: `split-${contentId}`,
        remixChain: []
      };

      const result = await storage.uploadContent(selectedFile, metadata, {
        filename: selectedFile.name,
        onProgress: (progress) => {
          setUploadProgress(progress * 100);
        }
      });

      if (result.success && result.metadata) {
        onUploadComplete?.(result as UploadResult);
        // Reset form
        setSelectedFile(null);
        setTitle('');
        setDescription('');
        setTags([]);
        setRevenueSplit('100');
        setUploadProgress(0);
      } else {
        throw new Error(result.error || 'Upload failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Content
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-accent bg-accent/10'
              : 'border-border hover:border-accent/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                {getFileIcon(selectedFile)}
                <div className="text-left">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  disabled={isUploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {isUploading && (
                <div className="space-y-2">
                  <ProgressBar progress={uploadProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    Uploading... {uploadProgress.toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
              <div>
                <p className="text-lg font-medium">Drop your file here</p>
                <p className="text-sm text-muted-foreground">
                  or click to browse (max {maxFileSize / (1024 * 1024)}MB)
                </p>
              </div>
              <input
                type="file"
                onChange={handleFileInputChange}
                accept={allowedTypes.map(type => `${type}*`).join(',')}
                className="hidden"
                id="file-upload"
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
            </div>
          )}
        </div>

        {/* Content Details */}
        {selectedFile && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter content title"
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                disabled={isUploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your content"
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md bg-background resize-none"
                disabled={isUploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add a tag"
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
                  disabled={isUploading}
                />
                <Button onClick={addTag} disabled={isUploading || !tagInput.trim()}>
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-accent/20 text-accent rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-destructive"
                        disabled={isUploading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Revenue Share (your percentage)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={revenueSplit}
                onChange={(e) => setRevenueSplit(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                disabled={isUploading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Remaining {100 - parseInt(revenueSplit || '0')}% will be split among collaborators
              </p>
            </div>
          </div>
        )}

        {/* Upload Button */}
        {selectedFile && title.trim() && (
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Content
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

