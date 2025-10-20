import { basename } from 'path';
import { readFileSync } from 'fs';
import { Blob } from 'buffer';
import type {
  TranslationTask,
  TranslationListResponse,
  CreateTranslationResponse,
  DocSearchRequest,
  DocSearchResponse,
  SupprAPIResponse,
} from './types.js';

/**
 * Suppr API Client
 */
export class SupprClient {
  private baseURL = 'https://api.suppr.wilddata.cn';
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * 创建翻译任务
   */
  async createTranslation(params: {
    file_path?: string;
    file_url?: string;
    from_lang?: string;
    to_lang: string;
    optimize_math_formula?: boolean;
  }): Promise<CreateTranslationResponse> {
    const formData = new FormData();
    
    // 支持本地文件上传
    if (params.file_path) {
      const fileBuffer = readFileSync(params.file_path);
      const blob = new Blob([fileBuffer]);
      formData.append('file', blob, basename(params.file_path));
    } else if (params.file_url) {
      formData.append('file_url', params.file_url);
    } else {
      throw new Error('Either file_path or file_url must be provided');
    }
    
    if (params.from_lang) {
      formData.append('from_lang', params.from_lang);
    }
    
    formData.append('to_lang', params.to_lang);
    
    // 注意：传递 optimize_math_formula 参数可能导致 415 错误
    // 只在明确设置为 true 时才传递此参数
    if (params.optimize_math_formula === true) {
      formData.append('optimize_math_formula', 'true');
    }
    
    const response = await fetch(`${this.baseURL}/v1/translations`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const result = await response.json() as SupprAPIResponse<CreateTranslationResponse>;
    
    if (result.code !== 0) {
      throw new Error(result.msg || 'API request failed');
    }

    return result.data;
  }

  /**
   * 获取翻译任务详情
   */
  async getTranslation(taskId: string): Promise<TranslationTask> {
    const response = await fetch(`${this.baseURL}/v1/translations/${taskId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json() as SupprAPIResponse<TranslationTask>;
    
    if (result.code !== 0) {
      throw new Error(result.msg || 'API request failed');
    }

    return result.data;
  }

  /**
   * 获取翻译任务列表
   */
  async listTranslations(params?: {
    offset?: number;
    limit?: number;
  }): Promise<TranslationListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.offset !== undefined) {
      searchParams.append('offset', String(params.offset));
    }
    if (params?.limit !== undefined) {
      searchParams.append('limit', String(params.limit));
    }

    const url = `${this.baseURL}/v1/translations${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json() as SupprAPIResponse<TranslationListResponse>;
    
    if (result.code !== 0) {
      throw new Error(result.msg || 'API request failed');
    }

    return result.data;
  }

  /**
   * 文献语义搜索
   */
  async searchDocuments(params: DocSearchRequest): Promise<DocSearchResponse> {
    const response = await fetch(`${this.baseURL}/v1/docs/semantic_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json() as SupprAPIResponse<DocSearchResponse>;
    
    if (result.code !== 0) {
      throw new Error(result.msg || 'API request failed');
    }

    return result.data;
  }
}
