import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Request, Response } from 'express';
import { map } from 'rxjs';

@Injectable()
export class ResponseEnvelopeInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(context: ExecutionContext, next: CallHandler<T>) {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const incomingRequestId = request.headers['x-request-id'];
    const requestId = Array.isArray(incomingRequestId)
      ? (incomingRequestId[0] ?? randomUUID())
      : (incomingRequestId ?? randomUUID());
    response.setHeader('x-request-id', requestId);

    return next.handle().pipe(
      map((data) => ({
        data,
        requestId,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
