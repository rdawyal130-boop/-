export type Category = 'حلويات' | 'ألبان' | 'أجراس' | 'سكائر' | 'الغذائية' | 'لحوم' | string;

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number; // Wholesale price per unit/pack
  retailPrice?: number; // Recommended retail price
  unit: string; // e.g., "كرتونة", "صندوق", "شدة", "كيس", "كيلو"
  stock: number;
  image?: string;
  code?: string; // Barcode or product code
  wholesalerName?: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'shipping' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  supermarketName: string;
  ownerName: string;
  phone: string;
  address: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    unit: string;
  }[];
  totalPrice: number;
  status: OrderStatus;
  date: string;
  notes?: string;
}

export type UserRole = 'wholesaler' | 'supermarket';
