import type { ListWorkRecordsDto } from '../dto/list-work-records.dto';

export type WorkPaginatedResult<T> = {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    pageCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export const getWorkPagination = (query: ListWorkRecordsDto) => {
  const page = Math.max(1, query.page);
  const pageSize = Math.min(Math.max(1, query.pageSize), 100);

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
};

export const toWorkPaginatedResult = <T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): WorkPaginatedResult<T> => {
  const pageCount = Math.ceil(total / pageSize);

  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      pageCount,
      hasNextPage: page < pageCount,
      hasPreviousPage: page > 1,
    },
  };
};
