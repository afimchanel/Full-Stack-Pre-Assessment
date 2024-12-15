import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductTranslationDto {
  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  default_language: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductTranslationDto)
  translations: ProductTranslationDto[];
}
