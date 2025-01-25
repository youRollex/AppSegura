import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as winston from 'winston';
import * as moment from 'moment-timezone';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('API Gateway');

  private readonly logger1: winston.Logger;

  constructor() {
    this.logger1 = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({
          format: () =>
            moment().tz('America/Guayaquil').format('YYYY-MM-DD HH:mm:ss'),
        }),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          const log = {
            nivel: level.toUpperCase(),
            accion: message,
            horaDeAcceso: timestamp,
            ...meta,
          };
          return JSON.stringify(log);
        }),
      ),
      transports: [
        new winston.transports.File({
          filename: 'logs/app.log',
        }),
      ],
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { method, url, user } = req;
    const userId = user || 'Unauthenticated';

    const startTime = Date.now();
    this.logger.log(
      `[Request] ${method} ${url} - User: ${userId} - IP: ${req.ip}`,
    );

    this.logger1.info({
      message: `[Request] ${method} ${url}`,
      user: userId,
      ip: req.ip,
    });

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;
        this.logger.log(
          `[Response] ${method} ${url} - User: ${userId} - Status: ${statusCode} - Duration: ${duration}ms`,
        );
        this.logger1.info({
          message: `[Response] ${method} ${url}`,
          user: userId,
          status: statusCode,
          duration: `${duration}ms`,
        });
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const statusCode = error.status || 500;
        this.logger.error(
          `[Error] ${method} ${url} - User: ${userId} - Status: ${statusCode} - Duration: ${duration}ms - Error: ${error.message}`,
        );

        this.logger1.error({
          message: `[Error] ${method} ${url}`,
          user: userId,
          status: statusCode,
          duration: `${duration}ms`,
          error: error.message,
        });
        return throwError(error);
      }),
    );
  }
}
