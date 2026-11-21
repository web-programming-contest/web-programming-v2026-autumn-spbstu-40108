import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class OrderItemDto {
  @IsInt({ message: 'Идентификатор товара должен быть целым числом' })
  @Min(1, { message: 'Идентификатор товара должен быть положительным' })
  goodId!: number;

  @IsInt({ message: 'Количество товара должно быть целым числом' })
  @Min(1, { message: 'Количество товара должно быть не меньше единицы' })
  quantity!: number;
}

export class CreateOrderDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' && value.trim() === '' ? undefined : value,
  )
  @IsOptional()
  @IsEmail({}, { message: 'Укажите корректный адрес электронной почты' })
  email?: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Укажите номер телефона' })
  @IsNotEmpty({ message: 'Укажите номер телефона' })
  phone!: string;

  @IsIn(['pickup', 'delivery'], {
    message: 'Выберите способ получения: самовывоз или доставка',
  })
  deliveryMethod!: 'pickup' | 'delivery';

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @ValidateIf((dto: CreateOrderDto) => dto.deliveryMethod === 'delivery')
  @IsString({ message: 'Укажите адрес доставки' })
  address?: string;

  @IsIn(['По карте', 'Наличными'], {
    message: 'Выберите способ оплаты: «По карте» или «Наличными»',
  })
  paymentMethod!: 'По карте' | 'Наличными';

  @IsBoolean({ message: 'Поле «Нужна упаковка» должно быть логическим значением' })
  needsPackaging!: boolean;

  @IsArray({ message: 'Добавьте хотя бы один товар в заказ' })
  @ArrayMinSize(1, { message: 'Добавьте хотя бы один товар в заказ' })
  @ValidateNested({
    each: true,
    message: 'Каждый товар должен быть объектом с полями goodId и quantity',
  })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
