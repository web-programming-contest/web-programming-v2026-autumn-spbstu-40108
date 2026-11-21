import type {
  CreatedOrderResponse,
  CreateOrderPayload,
  OrderSummary,
} from '../types';
import { apiRequest } from './client';

export function getOrdersRequest(): Promise<OrderSummary[]> {
  return apiRequest<OrderSummary[]>('/orders');
}

export function createOrderRequest(
  payload: CreateOrderPayload,
): Promise<CreatedOrderResponse> {
  return apiRequest<CreatedOrderResponse>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
