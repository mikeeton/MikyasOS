export interface DocumentPaginationQuery {
  page?: number;
  pageSize?: number;
}

export function getDocumentPagination(query: DocumentPaginationQuery) {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 25));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}

export function toDocumentPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
) {
  return {
    items,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}
