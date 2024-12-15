import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { ProductTranslation } from './entity/product-translation.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductTranslation]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule { }
