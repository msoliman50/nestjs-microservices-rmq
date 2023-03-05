import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  getHello(): string {
    return 'Hello World!';
  }

  bill(data: any) {
    // throw new Error('Invalid');
    this.logger.log('Billing....', data);
  }
}
