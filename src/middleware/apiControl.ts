import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { supabase } from '@/integrations/supabase/client';

// Rate limiting configuration
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 429,
    error: 'Too many requests, please try again later.',
  },
});

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        status: 401,
        error: 'No authorization header',
      });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        status: 401,
        error: 'Invalid or expired token',
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Error handling middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  // Handle different types of errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 400,
      error: 'Validation Error',
      details: err.message,
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
      details: err.message,
    });
  }

  // Default error
  return res.status(500).json({
    status: 500,
    error: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
};

// Request validation middleware
export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          status: 400,
          error: 'Validation Error',
          details: error.details.map((err: any) => err.message),
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// API response formatter
export const formatResponse = (data: any = null, message: string = 'Success') => {
  return {
    status: 200,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

// Track API usage
export const trackApiUsage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const startTime = Date.now();
    
    // Add response listener
    res.on('finish', async () => {
      const duration = Date.now() - startTime;
      const { method, originalUrl, ip } = req;
      const { statusCode } = res;

      // Log API usage to Supabase
      await supabase
        .from('api_logs')
        .insert([
          {
            method,
            path: originalUrl,
            status_code: statusCode,
            duration_ms: duration,
            ip_address: ip,
            user_id: req.user?.id,
          },
        ]);
    });

    next();
  } catch (error) {
    next(error);
  }
}; 