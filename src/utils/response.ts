import { Request } from 'express';
import logger from './logger';

export function success<T>(data: T, message = 'OK') {
  return { success: true, message, data };
}

export function successResponse<T>(message: string, data?: T) {
  return { success: true, message, data };
}

export function errorResponse(message: string, errors?: unknown) {
  return { success: false, message, errors };
}

export function failure(message = 'Error', status = 400) {
  return { success: false, message, status };
}

export function routeNotFound(req: Request) {
  logger.error('Route not found', {
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  return { success: false, message: `Cannot ${req.method} ${req.url}` };
}
