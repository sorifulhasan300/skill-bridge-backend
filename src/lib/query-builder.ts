// lib/query-builder.ts

import {
  PaginationOptions,
  QueryResult,
  SortOption,
} from "../types/query.types";

export class QueryBuilder {
  private model: any;
  private query: any = {};

  constructor(model: any) {
    this.model = model;
  }

  where(filters: Record<string, any>): this {
    if (!this.query.where) this.query.where = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;

      if (key === "status") {
        // Accept both string and array
        this.query.where[key] = Array.isArray(value) ? { in: value } : value;
      } else if (key === "amount" && typeof value === "object") {
        this.query.where[key] = value; // { gte, lte }
      } else if (key === "createdAt" && typeof value === "object") {
        this.query.where[key] = value; // { gte, lte }
      } else if (key === "tutorName") {
        this.query.where.tutor = {
          user: { name: { contains: value, mode: "insensitive" } },
        };
      } else if (key === "tutorEmail") {
        this.query.where.tutor = {
          user: { email: { contains: value, mode: "insensitive" } },
        };
      } else if (key === "studentName") {
        // student has name/email directly — no nested user relation
        this.query.where.student = {
          name: { contains: value, mode: "insensitive" },
        };
      } else if (key === "studentEmail") {
        this.query.where.student = {
          email: { contains: value, mode: "insensitive" },
        };
      } else {
        this.query.where[key] = value;
      }
    });

    return this;
  }

  search(searchTerm: string, searchFields: string[] = []): this {
    if (!searchTerm || !searchFields.length) return this;
    if (!this.query.where) this.query.where = {};

    const searchConditions = searchFields.map((field) => {
      if (field === "tutorName") {
        return {
          tutor: {
            user: { name: { contains: searchTerm, mode: "insensitive" } },
          },
        };
      } else if (field === "tutorEmail") {
        return {
          tutor: {
            user: { email: { contains: searchTerm, mode: "insensitive" } },
          },
        };
      } else if (field === "studentName") {
        // ✅ student → name directly (no user nesting)
        return {
          student: { name: { contains: searchTerm, mode: "insensitive" } },
        };
      } else if (field === "studentEmail") {
        // ✅ student → email directly (no user nesting)
        return {
          student: { email: { contains: searchTerm, mode: "insensitive" } },
        };
      } else {
        return { [field]: { contains: searchTerm, mode: "insensitive" } };
      }
    });

    this.query.where.OR = searchConditions;
    return this;
  }

  // sort এখন SortOption[] — { field, direction }[]
  orderBy(sortOptions: SortOption[]): this {
    if (sortOptions?.length > 0) {
      this.query.orderBy = sortOptions.map(({ field, direction }) => ({
        [field]: direction,
      }));
    }
    return this;
  }

  paginate(options: PaginationOptions): this {
    const { page, limit, offset } = options;
    if (limit) this.query.take = limit;
    if (offset !== undefined) {
      this.query.skip = offset;
    } else if (page && limit) {
      this.query.skip = (page - 1) * limit;
    }
    return this;
  }

  include(includes: Record<string, boolean | object>): this {
    if (includes && Object.keys(includes).length > 0) {
      this.query.include = includes;
    }
    return this;
  }

  async execute(): Promise<any[]> {
    return await this.model.findMany(this.query);
  }

  async executeWithCount(): Promise<QueryResult<any>> {
    const [data, total] = await Promise.all([
      this.model.findMany(this.query),
      this.model.count({ where: this.query.where }),
    ]);

    const result: QueryResult<any> = { data, total };

    if (this.query.take) {
      result.limit = this.query.take;
      result.totalPages = Math.ceil(total / this.query.take);
      if (this.query.skip !== undefined) {
        result.page = Math.floor(this.query.skip / this.query.take) + 1;
      }
    }

    return result;
  }

  getQuery(): any {
    return this.query;
  }

  reset(): this {
    this.query = {};
    return this;
  }
}
