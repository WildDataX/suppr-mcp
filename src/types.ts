/**
 * Suppr API Types
 */

export interface TranslationTask {
  task_id: string;
  status: 'INIT' | 'PROGRESS' | 'DONE' | 'ERROR';
  progress: number;
  consumed_point: number;
  source_file_name?: string;
  source_file_url?: string;
  target_file_url?: string;
  source_lang: string;
  target_lang: string;
  error_msg?: string | null;
  optimize_math_formula: boolean;
}

export interface TranslationListResponse {
  total: number;
  offset: number;
  limit: number;
  list: TranslationTask[];
}

export interface CreateTranslationRequest {
  file?: any;
  file_url?: string;
  from_lang?: string;
  to_lang: string;
  optimize_math_formula?: boolean;
}

export interface CreateTranslationResponse {
  task_id: string;
  status: string;
  consumed_point: number;
  source_lang: string;
  target_lang: string;
  optimize_math_formula: boolean;
}

export interface DocSearchRequest {
  query: string;
  topk?: number;
  return_doc_keys?: string[];
  auto_select?: boolean;
}

export interface Author {
  fore_name?: string;
  last_name?: string;
  email?: string;
  affiliations?: Array<{ name: string }>;
}

export interface Document {
  title?: string;
  authors?: Author[];
  abstract?: string;
  doi?: string;
  pmid?: string;
  pii?: string;
  link?: string;
  publisher?: string;
  publication?: string;
  publication_abbr?: string;
  publication_nlm_id?: string;
  pub_year?: number;
  pub_month?: number;
  pub_day?: number;
  language?: string;
  pub_language?: string;
  pub_source_str?: string;
  [key: string]: any;
}

export interface SearchItem {
  doc: Document;
  search_gateway: string;
}

export interface DocSearchResponse {
  search_items: SearchItem[];
  consumed_points: number;
}

export interface SupprAPIResponse<T> {
  code: number;
  msg: string;
  data: T;
}
