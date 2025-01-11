import { HttpException, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected throwThrottlingException(): Promise<void> {
    throw new HttpException('RATE_LIMIT_REQUEST', 429);
  }

  protected getTracker(req: Record<string, any>): Promise<string> {
    return req.user?.id || req.ip;
  }
}
