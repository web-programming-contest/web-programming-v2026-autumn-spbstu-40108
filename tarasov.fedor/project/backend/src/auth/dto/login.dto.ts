import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Логин должен быть строкой' })
  @IsNotEmpty({ message: 'Введите логин' })
  @MaxLength(64, { message: 'Логин не должен превышать 64 символа' })
  username!: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Введите пароль' })
  @MaxLength(128, { message: 'Пароль не должен превышать 128 символов' })
  password!: string;
}
