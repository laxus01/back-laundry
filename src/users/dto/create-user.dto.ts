import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
    user: string;
    password: string;
    permissions: string;
    name: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Inherits all properties from CreateUserDto as optional
}
