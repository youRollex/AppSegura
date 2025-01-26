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

/**
 * Interceptor para registrar las solicitudes y respuestas HTTP.
 * Este interceptor registra información detallada sobre las solicitudes entrantes,
 * las respuestas salientes y los errores que ocurren durante el procesamiento.
 * @class LoggingInterceptor
 * @implements {NestInterceptor}
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  /**
   * Logger de NestJS para registrar mensajes en la consola.
   * @private
   */
  private readonly loggerNest = new Logger('API Gateway');

  /**
   * Logger de Winston para registrar mensajes en un archivo de logs.
   * @private
   * @type {winston.Logger}
   */
  private readonly loggerWinston: winston.Logger;

  /**
   * Constructor del interceptor.
   * Configura el logger de Winston para escribir logs en un archivo.
   * @constructor
   */
  constructor() {
    this.loggerWinston = winston.createLogger({
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

  /**
   * Intercepta las solicitudes HTTP y registra información sobre ellas.
   * @method intercept
   * @param {ExecutionContext} context - El contexto de ejecución de la solicitud.
   * @param {CallHandler} next - El manejador de la llamada.
   * @returns {Observable<any>} Un observable que emite la respuesta.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { method, url, user } = req;
    const userId = user || 'Unauthenticated';

    const startTime = Date.now();
    this.loggerNest.log(
      `[Request] ${method} ${url} - User: ${userId} - IP: ${req.ip}`,
    );

    this.loggerWinston.info({
      message: `[Request] ${method} ${url}`,
      user: userId,
      ip: req.ip,
    });

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;
        this.loggerNest.log(
          `[Response] ${method} ${url} - User: ${userId} - Status: ${statusCode} - Duration: ${duration}ms`,
        );
        this.loggerWinston.info({
          message: `[Response] ${method} ${url}`,
          user: userId,
          status: statusCode,
          duration: `${duration}ms`,
        });
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const statusCode = error.status || 500;
        this.loggerNest.error(
          `[Error] ${method} ${url} - User: ${userId} - Status: ${statusCode} - Duration: ${duration}ms - Error: ${error.message}`,
        );

        this.loggerWinston.error({
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
