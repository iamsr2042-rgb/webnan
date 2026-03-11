import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { createRateLimiter, getClientIp, RATE_LIMITS, getRateLimitHeaders } from '@/lib/rate-limit';

const searchQuerySchema = z.object({
  search: z.string().optional().default(''),
  category: z.string().optional().default(''),
  priceMin: z.coerce.number().optional().default(0),
  priceMax: z.coerce.number().optional().default(999999),
  sort: z.enum(['newest', 'oldest', 'price-asc', 'price-desc']).optional().default('newest'),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  offset: z.coerce.number().min(0).optional().default(0),
});

type SearchQuery = z.infer<typeof searchQuerySchema>;

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientIp = getClientIp(request);
    const rateLimitKey = `search:${clientIp}`;
    const rateLimit = createRateLimiter(rateLimitKey, RATE_LIMITS.SEARCH);

    if (!rateLimit.isAllowed) {
      console.warn('[v0] Search rate limit exceeded for IP:', clientIp);
      const response = NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
      response.headers.set('Retry-After', Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString());
      Object.entries(getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    const searchParams = request.nextUrl.searchParams;
    const queryData = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      priceMin: searchParams.get('priceMin') || '0',
      priceMax: searchParams.get('priceMax') || '999999',
      sort: searchParams.get('sort') || 'newest',
      limit: searchParams.get('limit') || '10',
      offset: searchParams.get('offset') || '0',
    };

    const validation = searchQuerySchema.safeParse(queryData);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      );
    }

    const { search, category, priceMin, priceMax, sort, limit, offset } = validation.data;

    console.log('[v0] Search query:', { search, category, priceMin, priceMax, sort, limit, offset });

    // Build where clause
    const where: any = {
      AND: [],
    };

    // Add search filter
    if (search.trim()) {
      where.AND.push({
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    // Add category filter
    if (category.trim()) {
      where.AND.push({
        category: {
          contains: category,
          mode: 'insensitive',
        },
      });
    }

    // Add price range filter
    where.AND.push({
      price: {
        gte: priceMin,
        lte: priceMax,
      },
    });

    // Clean up where clause if no filters applied
    if (where.AND.length === 0) {
      delete where.AND;
    }

    // Determine order by
    let orderBy: any = { createdAt: 'desc' };
    switch (sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Execute query
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: where.AND ? where : {},
        orderBy,
        take: limit,
        skip: offset,
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          price: true,
          demoUrl: true,
          images: true,
          features: true,
          fileUrl: true,
          installationService: true,
          createdAt: true,
        },
      }),
      prisma.product.count({
        where: where.AND ? where : {},
      }),
    ]);

    const hasMore = offset + limit < total;
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    console.log('[v0] Search results:', {
      total,
      returned: products.length,
      hasMore,
      page: currentPage,
    });

    const response = NextResponse.json(
      {
        products,
        pagination: {
          total,
          limit,
          offset,
          hasMore,
          currentPage,
          totalPages,
        },
      },
      { status: 200 }
    );

    // Add rate limit headers
    Object.entries(getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('[v0] Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
