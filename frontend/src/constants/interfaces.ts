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
  type: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};