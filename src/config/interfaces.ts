import {$Enums} from "@prisma/client"

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: $Enums.Role;
  }