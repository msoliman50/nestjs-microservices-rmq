import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {}
  getOptions(queue: string, noAck = false): RmqOptions {
    const RMQ_URI = this.configService.get<string>('RMQ_URI');
    const RMQ_QUEUE = this.configService.get<string>(`RMQ_${queue}_QUEUE`);

    return {
      transport: Transport.RMQ,
      options: {
        urls: [RMQ_URI],
        queue: RMQ_QUEUE,
        noAck,
        persistent: true,
      },
    };
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
  }
}
