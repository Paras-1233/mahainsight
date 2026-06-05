import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rateLimit";

type PaginationOptions = {
  defaultPageSize?: number;
  maxPageSize?: number;
};

export type Pagination = {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
};

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

function parsePositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function getPagination(
  request: Request,
  {
    defaultPageSize = DEFAULT_PAGE_SIZE,
    maxPageSize = MAX_PAGE_SIZE,
  }: PaginationOptions = {}
): Pagination {
  const url = new URL(request.url);
  const page = parsePositiveInteger(url.searchParams.get("page"), 1);
  const requestedSize =
    url.searchParams.get("pageSize") ?? url.searchParams.get("limit");
  const requestedPageSize = parsePositiveInteger(
    requestedSize,
    defaultPageSize
  );
  const pageSize = Math.min(requestedPageSize, maxPageSize);

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

export function getPaginationMeta(total: number, pagination: Pagination) {
  const totalPages = Math.max(1, Math.ceil(total / pagination.pageSize));

  return {
    page: pagination.page,
    pageSize: pagination.pageSize,
    total,
    totalPages,
    hasNextPage: pagination.page < totalPages,
    hasPreviousPage: pagination.page > 1,
  };
}

export function paginationHeaders(
  total: number,
  pagination: Pagination
): HeadersInit {
  const meta = getPaginationMeta(total, pagination);

  return {
    "X-Pagination-Page": String(meta.page),
    "X-Pagination-Page-Size": String(meta.pageSize),
    "X-Pagination-Total": String(meta.total),
    "X-Pagination-Total-Pages": String(meta.totalPages),
  };
}

export function paginatedJson<T>(
  data: T[],
  total: number,
  pagination: Pagination,
  init: ResponseInit = {}
) {
  return Response.json(
    {
      data,
      pagination: getPaginationMeta(total, pagination),
    },
    {
      ...init,
      headers: {
        ...paginationHeaders(total, pagination),
        ...init.headers,
      },
    }
  );
}

export function paginateArray<T>(records: T[], pagination: Pagination) {
  return records.slice(pagination.skip, pagination.skip + pagination.take);
}

export async function rateLimitRequest({
  request,
  bucket,
  limit,
  windowMs,
}: {
  request: Request;
  bucket: string;
  limit: number;
  windowMs: number;
}) {
  const ip = getClientIp(request);
  const result = await checkRateLimit({
    key: `${bucket}:${ip}`,
    limit,
    windowMs,
  });

  return result.allowed ? null : rateLimitResponse(result.resetAt);
}
