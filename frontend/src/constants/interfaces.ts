export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export type Address = {
  id: number;
  address: string;
};