import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, product => product.translations)
  product: Product;

  @Column({ default: 'en' })
  language: string;

  @Column()
  name: string;

  @Column('text')
  description: string;
}
