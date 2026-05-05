export interface QueryOptions {
  filters?: Record<string, any>;
  search?: string;
  sort?: Record<string, "asc" | "desc">;
  pagination?: PaginationOptions;
  includes?: Record<string, boolean | object>;
}

export interface SortOption {
  field: string;
  direction: "asc" | "desc";
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface QueryResult<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}
