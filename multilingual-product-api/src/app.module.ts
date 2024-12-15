import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/entity/product.entity';
import { ProductTranslation } from './products/entity/product-translation.entity';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';  
import * as path from 'path'; 
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../.env'),  
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST, 
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      ssl: {
        rejectUnauthorized: true,
        ca: process.env.DATABASE_CA_CERT ? process.env.DATABASE_CA_CERT : undefined,
        key: process.env.DATABASE_KEY ? process.env.DATABASE_KEY : undefined,
        cert: process.env.DATABASE_CERT ? process.env.DATABASE_CERT : undefined,
      },
      entities: [Product, ProductTranslation],
      synchronize: true, // ควรตั้งค่าเป็น false ใน production
    }),
    ProductsModule,
  ],
})
export class AppModule { }
