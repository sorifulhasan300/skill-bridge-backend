// lib/parse-query-params.ts

import { QueryOptions } from "../types/query.types";

export function parseQueryParams(query: any): QueryOptions {
  const options: QueryOptions = {};

  // ── Search ──────────────────────────────────────────
  if (query.search) {
    options.search = query.search as string;
  }

  // ── Filters ─────────────────────────────────────────
  // Frontend sends: ?filters[status]=CONFIRMED
  // Express parses as: query.filters = { status: 'CONFIRMED' }
  if (query.filters && typeof query.filters === "object") {
    const filters: Record<string, string | number | boolean> = {};

    Object.entries(query.filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      filters[key] = value as string | number | boolean;
    });

    if (Object.keys(filters).length > 0) {
      options.filters = filters;
    }
  }

  // ── Sort ────────────────────────────────────────────
  // Frontend sends: ?sort[createdAt]=desc
  // Express parses as: query.sort = { createdAt: 'desc' }
  // Result: Record<string, 'asc' | 'desc'>
  if (query.sort && typeof query.sort === "object") {
    const sort: Record<string, "asc" | "desc"> = {};

    Object.entries(query.sort).forEach(([field, direction]) => {
      if (direction === "asc" || direction === "desc") {
        sort[field] = direction;
      }
    });

    if (Object.keys(sort).length > 0) {
      options.sort = sort ;
    }
  }

  // ── Pagination ───────────────────────────────────────
  // ?page=1&limit=10
  if (query.page && query.limit) {
    options.pagination = {
      page: parseInt(query.page as string),
      limit: parseInt(query.limit as string),
    };
  }

  return options;
}
