import { CorsOptions } from 'cors';
import { ENV } from './env';

const corsOptions: CorsOptions = {
  origin: ENV.CORS.ORIGIN,
  methods: ENV.CORS.METHODS,
  allowedHeaders: ENV.CORS.ALLOWED_HEADERS,
  credentials: ENV.CORS.CREDENTIALS,
  maxAge: ENV.CORS.MAX_AGE,
};

export default corsOptions;
