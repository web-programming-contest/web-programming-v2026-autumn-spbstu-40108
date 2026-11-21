import type { Good } from '../types';
import { apiRequest } from './client';

export function getGoodsRequest(): Promise<Good[]> {
  return apiRequest<Good[]>('/goods');
}
