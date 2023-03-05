import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { BILLING_SERVICE } from './constants/services';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private readonly billingClient: ClientProxy,
  ) {}

  async getOrders() {
    return this.ordersRepository.find({});
  }
  async createOrder(createOrderDto: CreateOrderDto, Authentication: string) {
    const session = await this.ordersRepository.startTransaction();
    try {
      const order = await this.ordersRepository.create(createOrderDto, {
        session,
      });
      await lastValueFrom(
        this.billingClient.emit('order_created', { order, Authentication }),
      );
      await session.commitTransaction();
      return order;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
    return this.ordersRepository.create(createOrderDto);
  }
}
