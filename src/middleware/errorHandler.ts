import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

interface CustomError {
  status?: number;
  message?: string;
}

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status =
    typeof err === 'object' && err !== null && 'status' in err
      ? ((err as CustomError).status ?? 500)
      : 500;
  const message =
    typeof err === 'object' && err !== null && 'message' in err
      ? ((err as CustomError).message ?? 'Internal Server Error')
      : 'Internal Server Error';

  // Log the error with additional request information
  logger.error('Error occurred', {
    error: err,
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  return res.status(status).json({
    success: false,
    message,
  });
};
