import { PartialType } from '@nestjs/mapped-types';

export class CreateAdvanceDto {
    value: number;
    date: string;
    washerId: string;
    state?: number;
}

export class UpdateAdvanceDto extends PartialType(CreateAdvanceDto) {
}
