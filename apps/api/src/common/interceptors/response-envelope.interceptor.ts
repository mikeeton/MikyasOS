import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { map, type Observable } from 'rxjs';

@Injectable()
export class ResponseEnvelopeInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId = request.headers['x-request-id'];

    return next.handle().pipe(
      map((data) => ({
        data,
        requestId: Array.isArray(requestId) ? requestId[0] : (requestId ?? 'unknown'),
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
