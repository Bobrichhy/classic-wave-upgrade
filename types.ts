
export enum Category {
  PERFUME = 'PERFUME',
  BODY_SPRAY = 'BODY_SPRAY',
  BODY_OIL = 'BODY_OIL',
  ROLL_ON = 'ROLL_ON'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  gender: Gender;
  description: string;
  notes: string;
  imageUrl: string;
  videoUrl?: string; // Optional mockup video URL
  vip?: boolean; // Exclusive designer collection — shown on /vip, hidden from regular category browsing
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderDetails {
  customerName: string;
  phone: string;
  hostel: string;
  items: CartItem[];
  totalAmount: number;
  deliveryFee: number;
  paymentProof?: File;
}
