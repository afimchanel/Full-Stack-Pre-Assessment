import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entity/product.entity';
import { ProductTranslation } from './entity/product-translation.entity';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

describe('ProductsController', () => {
  let app: INestApplication;
  let productsService = { create: jest.fn(), search: jest.fn() };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: productsService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Test for creating a product with different default languages (en, th)
  it('should create a product with default language "en"', async () => {
    const newProduct = new Product();
    newProduct.id = 1;
    newProduct.default_language = 'en';
    newProduct.translations = [
      new ProductTranslation(), // Mock a translation for "en"
    ];

    const createProductDto = {
      default_language: 'en',
      translations: [
        { language: 'en', name: 'Product Name', description: 'Product Description' },
      ],
    };

    productsService.create.mockResolvedValue(newProduct);

    return request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(HttpStatus.CREATED)
      .expect((response) => {
        expect(response.body.id).toBe(newProduct.id);
        expect(response.body.default_language).toBe(newProduct.default_language);
      });
  });

  it('should create a product with default language "th" (Thai)', async () => {
    const newProduct = new Product();
    newProduct.id = 2;
    newProduct.default_language = 'th';
    newProduct.translations = [
      new ProductTranslation(), // Mock a translation for "th"
    ];

    const createProductDto = {
      default_language: 'th',
      translations: [
        { language: 'th', name: 'ชื่อสินค้า', description: 'คำอธิบายสินค้า' },
      ],
    };

    productsService.create.mockResolvedValue(newProduct);

    return request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(HttpStatus.CREATED)
      .expect((response) => {
        expect(response.body.id).toBe(newProduct.id);
        expect(response.body.default_language).toBe(newProduct.default_language);
      });
  });

  // Test for searching products by language (en, th)
  it('should return products filtered by language "en"', async () => {
    // Create a new Product
    const product = new Product();
    product.id = 1;
    product.default_language = 'en';

    // Create a valid ProductTranslation for "en" language
    const productTranslation = new ProductTranslation();
    productTranslation.language = 'en';
    productTranslation.name = 'Product Name';  // Example product name in English
    productTranslation.description = 'Product Description';  // Example product description in English

    // Assign the translation to the product
    product.translations = [productTranslation];

    // Mock the service to return the product with translations
    productsService.search.mockResolvedValue([product]);

    // Perform the GET request to search products with query and language "en"
    return request(app.getHttpServer())
      .get('/products/search')
      .query({ query: 'Product', language: 'en', page: 1, limit: 10 })
      .expect(HttpStatus.OK)
      .expect([{
        id: product.id,
        default_language: product.default_language,
        translations: [
          {
            language: 'en',
            name: 'Product Name',
            description: 'Product Description',
          }
        ]
      }]); // Expected response with valid translation
  });


  it('should return products filtered by language "th" (Thai)', async () => {
    // Create a new Product
    const product = new Product();
    product.id = 2;
    product.default_language = 'th';

    // Create a valid ProductTranslation for "th" language
    const productTranslation = new ProductTranslation();
    productTranslation.language = 'th';
    productTranslation.name = 'ชื่อสินค้า';  // Example product name in Thai
    productTranslation.description = 'คำอธิบายสินค้า';  // Example product description in Thai

    // Assign the translation to the product
    product.translations = [productTranslation];

    // Mock the service to return the product with translations
    productsService.search.mockResolvedValue([product]);

    // Perform the GET request to search products with query and language "th"
    return request(app.getHttpServer())
      .get('/products/search')
      .query({ query: 'ชื่อสินค้า', language: 'th', page: 1, limit: 10 })
      .expect(HttpStatus.OK)
      .expect([{
        id: product.id,
        default_language: product.default_language,
        translations: [
          {
            language: 'th',
            name: 'ชื่อสินค้า',
            description: 'คำอธิบายสินค้า',
          }
        ]
      }]); // Expected response with valid translation
  });

  afterAll(async () => {
    await app.close();
  });
});
