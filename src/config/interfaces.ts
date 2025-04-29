import {$Enums} from "@prisma/client"

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: $Enums.Role;
  }

  export interface OrderItemInput {
    productId: number,
    quantity: number,
    price: number
  }