import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { ProductTranslation } from './entity/product-translation.entity';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsService', () => {
    let service: ProductsService;
    let productsRepository: Repository<Product>;
    let translationsRepository: Repository<ProductTranslation>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: getRepositoryToken(Product),
                    useValue: {
                        save: jest.fn(),
                        find: jest.fn(),  // Use jest.fn() to mock the find method directly
                        createQueryBuilder: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(ProductTranslation),
                    useValue: {
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        productsRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
        translationsRepository = module.get<Repository<ProductTranslation>>(getRepositoryToken(ProductTranslation));

        // Mocking the 'save' methods for both repositories
        jest.spyOn(productsRepository, 'save').mockResolvedValue({} as Product);
        jest.spyOn(translationsRepository, 'save').mockResolvedValue({} as ProductTranslation);

        // Mocking the 'find' method for productsRepository
        (productsRepository.find as jest.Mock).mockResolvedValue([]);  // Mocking find to return an empty array by default

        // Mock 'createQueryBuilder' method and chain the methods (like where, andWhere, getMany)
        jest.spyOn(productsRepository, 'createQueryBuilder').mockReturnValue({
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue([]),
        } as any);
    });

    // Test for 'create' method
    it('should successfully create a product and translations in English', async () => {
        const createProductDto: CreateProductDto = {
            default_language: 'en',
            translations: [
                { language: 'en', name: 'Product Name', description: 'Product Description' },
            ],
        };

        const result = await service.create(createProductDto);

        // Check that the product is created with the correct default language
        expect(result.default_language).toBe('en');
        expect(productsRepository.save).toHaveBeenCalled();
        expect(translationsRepository.save).toHaveBeenCalledTimes(1); // Should save one translation
    });

    // Test for 'search' method - should return empty array if no products found
    it('should return empty array if no products found', async () => {
        const searchQuery = 'Nonexistent Product';
        const language = 'en';
        const page = 1;
        const limit = 10;

        // Mocking find function
        jest.spyOn(productsRepository, 'find').mockResolvedValueOnce([]);

        const result = await service.search(searchQuery, language, page, limit);

        expect(result).toEqual([]);
    });

    // Test for 'search' method - should return products filtered by language "en"
    it('should return products filtered by language "en"', async () => {
        const mockProduct: Product = {
            id: 1,
            default_language: 'en',
            translations: [
                { language: 'en', name: 'Product Name', description: 'Product Description' } as ProductTranslation,
            ],
        } as Product;

        // Mocking find to return a product
        (productsRepository.find as jest.Mock).mockResolvedValue([mockProduct]);

        const result = await service.search('Product Name', 'en', 1, 10);

        // Check that the result contains the mock product
        expect(result).toEqual([mockProduct]);
        expect(productsRepository.find).toHaveBeenCalledWith({
            relations: ['translations'],
            where: {
                translations: {
                    name: expect.anything(), // Matching the name dynamically
                    language: 'en',
                },
            },
            skip: 0,
            take: 10,
        });
    });

    // Test for 'search' method - should return products filtered by language "th"
    it('should return products filtered by language "th"', async () => {
        const mockProduct: Product = {
            id: 2,
            default_language: 'th',
            translations: [
                { language: 'th', name: 'ชื่อสินค้า', description: 'คำอธิบายสินค้า' } as ProductTranslation,
            ],
        } as Product;

        (productsRepository.find as jest.Mock).mockResolvedValue([mockProduct]);

        const result = await service.search('ชื่อสินค้า', 'th', 1, 10);

        // Check that the result contains the mock product
        expect(result).toEqual([mockProduct]);
    });

    // Test for 'search' method - should return empty array if no products match the search query
    it('should return empty array if no products match the search query', async () => {
        (productsRepository.find as jest.Mock).mockResolvedValue([]);  // Mocking find to return empty array

        const result = await service.search('Nonexistent Product', 'en', 1, 10);

        // Expect an empty array because no product matches
        expect(result).toEqual([]);
    });
});
