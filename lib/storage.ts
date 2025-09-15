import { IPFSStorage, ContentMetadata, StorageConfig, createFileFromSource } from './ipfs';

/**
 * Unified storage interface for CreatorShare
 * Handles both IPFS and future storage backends
 */
export class CreatorStorage {
  private ipfsStorage: IPFSStorage;
  private config: StorageConfig;

  constructor(config: StorageConfig) {
    this.config = config;
    this.ipfsStorage = new IPFSStorage(config.web3StorageToken);
  }

  /**
   * Upload content to storage
   * @param content The content to upload
   * @param metadata Content metadata
   * @param options Upload options
   * @returns Upload result with CIDs
   */
  async uploadContent(
    content: File | Blob | string,
    metadata: Omit<ContentMetadata, 'mediaUrl' | 'createdAt' | 'updatedAt'>,
    options?: {
      filename?: string;
      contentType?: string;
      onProgress?: (progress: number) => void;
    }
  ): Promise<UploadResult> {
    try {
      // Validate file size
      if (this.config.maxFileSize && content instanceof File && content.size > this.config.maxFileSize) {
        throw new Error(`File size exceeds maximum allowed size of ${this.config.maxFileSize} bytes`);
      }

      // Validate file type
      if (this.config.allowedTypes && content instanceof File) {
        const fileType = content.type;
        if (!this.config.allowedTypes.some(type => fileType.startsWith(type))) {
          throw new Error(`File type ${fileType} is not allowed`);
        }
      }

      // Create file object
      const filename = options?.filename || `content-${Date.now()}`;
      const file = createFileFromSource(content, filename, {
        type: options?.contentType || (content instanceof File ? content.type : 'application/octet-stream')
      });

      // Upload content to IPFS
      const contentCid = await this.ipfsStorage.uploadFile(file, {
        name: filename,
        onProgress: options?.onProgress
      });

      // Create and upload metadata
      const fullMetadata: ContentMetadata = {
        ...metadata,
        mediaUrl: `ipfs://${contentCid}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const metadataCid = await this.ipfsStorage.uploadMetadata(fullMetadata);

      return {
        success: true,
        contentCid,
        metadataCid,
        gatewayUrl: this.ipfsStorage.getGatewayUrl(contentCid, filename),
        metadata: fullMetadata
      };

    } catch (error) {
      console.error('Error uploading content:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Upload a remix of existing content
   * @param originalContentCid Original content CID
   * @param remixContent The remixed content
   * @param metadata Remix metadata
   * @param options Upload options
   * @returns Upload result
   */
  async uploadRemix(
    originalContentCid: string,
    remixContent: File | Blob | string,
    metadata: Omit<ContentMetadata, 'mediaUrl' | 'createdAt' | 'updatedAt' | 'originalContentId' | 'remixChain'>,
    options?: {
      filename?: string;
      contentType?: string;
      onProgress?: (progress: number) => void;
    }
  ): Promise<UploadResult> {
    try {
      // Get original metadata to build remix chain
      const originalMetadata = await this.ipfsStorage.getMetadata(originalContentCid);
      const remixChain = [...(originalMetadata.remixChain || []), originalContentCid];

      return await this.uploadContent(remixContent, {
        ...metadata,
        originalContentId: originalContentCid,
        remixChain
      }, options);

    } catch (error) {
      console.error('Error uploading remix:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload remix'
      };
    }
  }

  /**
   * Get content metadata
   * @param metadataCid Metadata CID
   * @returns Content metadata
   */
  async getContentMetadata(metadataCid: string): Promise<ContentMetadata> {
    return await this.ipfsStorage.getMetadata(metadataCid);
  }

  /**
   * Get content data
   * @param contentCid Content CID
   * @returns Content data as Uint8Array
   */
  async getContentData(contentCid: string): Promise<Uint8Array> {
    return await this.ipfsStorage.getContent(contentCid);
  }

  /**
   * Check if content exists
   * @param cid Content or metadata CID
   * @returns True if content exists
   */
  async contentExists(cid: string): Promise<boolean> {
    return await this.ipfsStorage.contentExists(cid);
  }

  /**
   * Get gateway URL for content
   * @param cid Content CID
   * @param filename Optional filename
   * @returns Gateway URL
   */
  getGatewayUrl(cid: string, filename?: string): string {
    return this.ipfsStorage.getGatewayUrl(cid, filename);
  }

  /**
   * Update content metadata
   * @param metadataCid Existing metadata CID
   * @param updates Metadata updates
   * @returns New metadata CID
   */
  async updateMetadata(
    metadataCid: string,
    updates: Partial<Omit<ContentMetadata, 'contentId' | 'createdAt'>>
  ): Promise<string> {
    try {
      const existingMetadata = await this.getContentMetadata(metadataCid);
      const updatedMetadata: ContentMetadata = {
        ...existingMetadata,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      return await this.ipfsStorage.uploadMetadata(updatedMetadata);
    } catch (error) {
      console.error('Error updating metadata:', error);
      throw new Error('Failed to update metadata');
    }
  }
}

/**
 * Upload result interface
 */
export interface UploadResult {
  success: boolean;
  contentCid?: string;
  metadataCid?: string;
  gatewayUrl?: string;
  metadata?: ContentMetadata;
  error?: string;
}

/**
 * Storage factory function
 * @param config Storage configuration
 * @returns Configured storage instance
 */
export function createStorage(config: StorageConfig): CreatorStorage {
  return new CreatorStorage(config);
}

/**
 * Default storage configuration
 */
export const defaultStorageConfig: Partial<StorageConfig> = {
  gatewayUrl: 'https://w3s.link/ipfs/',
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedTypes: ['image/', 'video/', 'audio/', 'text/']
};

/**
 * Validate storage configuration
 * @param config Configuration to validate
 * @returns True if configuration is valid
 */
export function validateStorageConfig(config: StorageConfig): boolean {
  if (!config.web3StorageToken) {
    throw new Error('Web3.Storage token is required');
  }

  if (config.maxFileSize && config.maxFileSize <= 0) {
    throw new Error('Max file size must be positive');
  }

  return true;
}

