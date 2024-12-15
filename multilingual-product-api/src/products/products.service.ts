import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './entity/product.entity';
import { ProductTranslation } from './entity/product-translation.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(ProductTranslation)
        private translationsRepository: Repository<ProductTranslation>,
    ) { }


    async create(createProductDto: CreateProductDto): Promise<Product> {
        const product = new Product();
        product.default_language = createProductDto.default_language;

        await this.productsRepository.save(product);

        for (const translationDto of createProductDto.translations) {
            const translation = new ProductTranslation();
            translation.product = product;
            translation.language = translationDto.language;
            translation.name = translationDto.name;
            translation.description = translationDto.description;
            await this.translationsRepository.save(translation);
        }

        return product;
    }


    async search(query: string, language: string, page: number, limit: number): Promise<Product[]> {
        const skip = (page - 1) * limit;

        return this.productsRepository.find({
            relations: ['translations'],
            where: {
                translations: {
                    name: ILike(`%${query}%`),
                    language: language,
                },
            },
            skip,
            take: limit,
        });
    }



}
