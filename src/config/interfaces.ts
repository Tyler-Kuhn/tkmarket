import {$Enums} from "@prisma/client"

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: $Enums.Role;
    userId: number;
  }

  export interface OrderItemInput {
    productId: number,
    quantity: number,
    price: number
  }