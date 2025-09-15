import { Web3Storage, File } from 'web3.storage';

/**
 * IPFS/Web3.Storage integration for decentralized content storage
 */
export class IPFSStorage {
  private client: Web3Storage;

  constructor(token: string) {
    if (!token) {
      throw new Error('Web3.Storage token is required');
    }
    this.client = new Web3Storage({ token });
  }

  /**
   * Upload a file to IPFS
   * @param file The file to upload
   * @param options Upload options
   * @returns The CID of the uploaded content
   */
  async uploadFile(file: File, options?: { name?: string; onProgress?: (progress: number) => void }): Promise<string> {
    try {
      const cid = await this.client.put([file], {
        name: options?.name,
        onProgress: options?.onProgress,
      });
      return cid;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  /**
   * Upload multiple files to IPFS
   * @param files Array of files to upload
   * @param options Upload options
   * @returns The CID of the uploaded directory
   */
  async uploadFiles(files: File[], options?: { name?: string; onProgress?: (progress: number) => void }): Promise<string> {
    try {
      const cid = await this.client.put(files, {
        name: options?.name,
        onProgress: options?.onProgress,
      });
      return cid;
    } catch (error) {
      console.error('Error uploading files to IPFS:', error);
      throw new Error('Failed to upload files to IPFS');
    }
  }

  /**
   * Upload content metadata to IPFS
   * @param metadata Content metadata object
   * @returns The CID of the uploaded metadata
   */
  async uploadMetadata(metadata: ContentMetadata): Promise<string> {
    try {
      const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
      const metadataFile = new File([metadataBlob], 'metadata.json');
      const cid = await this.client.put([metadataFile]);
      return cid;
    } catch (error) {
      console.error('Error uploading metadata to IPFS:', error);
      throw new Error('Failed to upload metadata to IPFS');
    }
  }

  /**
   * Get content from IPFS
   * @param cid The content identifier
   * @returns The content data
   */
  async getContent(cid: string): Promise<Uint8Array> {
    try {
      const response = await this.client.get(cid);
      if (!response) {
        throw new Error('Content not found');
      }

      const files = await response.files();
      if (files.length === 0) {
        throw new Error('No files in response');
      }

      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch (error) {
      console.error('Error retrieving content from IPFS:', error);
      throw new Error('Failed to retrieve content from IPFS');
    }
  }

  /**
   * Get metadata from IPFS
   * @param cid The metadata CID
   * @returns The parsed metadata object
   */
  async getMetadata(cid: string): Promise<ContentMetadata> {
    try {
      const data = await this.getContent(cid);
      const jsonString = new TextDecoder().decode(data);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error retrieving metadata from IPFS:', error);
      throw new Error('Failed to retrieve metadata from IPFS');
    }
  }

  /**
   * Generate a gateway URL for IPFS content
   * @param cid The content identifier
   * @param filename Optional filename for direct download
   * @returns The gateway URL
   */
  getGatewayUrl(cid: string, filename?: string): string {
    const baseUrl = 'https://w3s.link/ipfs/';
    const url = `${baseUrl}${cid}`;
    return filename ? `${url}?filename=${encodeURIComponent(filename)}` : url;
  }

  /**
   * Check if a CID exists and is accessible
   * @param cid The content identifier
   * @returns True if the content exists
   */
  async contentExists(cid: string): Promise<boolean> {
    try {
      await this.getContent(cid);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Content metadata structure
 */
export interface ContentMetadata {
  contentId: string;
  creatorId: string;
  title: string;
  description: string;
  mediaType: 'image' | 'video' | 'audio' | 'text';
  mediaUrl: string;
  thumbnailUrl?: string;
  tags: string[];
  revenueShareSplitId: string;
  originalContentId?: string; // For remixes
  remixChain: string[]; // Chain of remix CIDs
  createdAt: string;
  updatedAt: string;
  license?: string;
  attributes?: Record<string, any>;
}

/**
 * Storage configuration
 */
export interface StorageConfig {
  web3StorageToken: string;
  gatewayUrl?: string;
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
}

/**
 * Create a new IPFS storage instance
 * @param config Storage configuration
 * @returns Configured IPFS storage instance
 */
export function createIPFSStorage(config: StorageConfig): IPFSStorage {
  if (!config.web3StorageToken) {
    throw new Error('Web3.Storage token is required');
  }

  return new IPFSStorage(config.web3StorageToken);
}

/**
 * Utility function to create a File object from various sources
 * @param source File source (File, Blob, string, etc.)
 * @param filename Filename for the file
 * @param options Additional options
 * @returns A File object
 */
export function createFileFromSource(
  source: File | Blob | string | ArrayBuffer,
  filename: string,
  options?: { type?: string }
): File {
  if (source instanceof File) {
    return source;
  }

  if (source instanceof Blob) {
    return new File([source], filename, { type: options?.type || source.type });
  }

  if (typeof source === 'string') {
    const blob = new Blob([source], { type: options?.type || 'text/plain' });
    return new File([blob], filename, { type: options?.type || 'text/plain' });
  }

  if (source instanceof ArrayBuffer) {
    const blob = new Blob([source], { type: options?.type || 'application/octet-stream' });
    return new File([blob], filename, { type: options?.type || 'application/octet-stream' });
  }

  throw new Error('Unsupported source type for file creation');
}

