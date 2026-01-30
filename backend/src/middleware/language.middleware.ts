import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Get language from query parameter, header, or default to 'vi'
    const langFromQuery = req.query.lang as string;
    const langFromHeader = req.headers['accept-language'];
    const langFromCookie = req.cookies?.lang;

    let language = 'vi'; // Default language

    // Priority: query param > cookie > header > default
    if (langFromQuery && ['vi', 'en'].includes(langFromQuery)) {
      language = langFromQuery;
    } else if (langFromCookie && ['vi', 'en'].includes(langFromCookie)) {
      language = langFromCookie;
    } else if (langFromHeader) {
      // Parse Accept-Language header
      const preferredLang = langFromHeader.split(',')[0].split('-')[0];
      if (['vi', 'en'].includes(preferredLang)) {
        language = preferredLang;
      }
    }

    // Set language in request object for use in controllers
    (req as any).language = language;

    // Set language in response headers
    res.setHeader('Content-Language', language);

    next();
  }
}
