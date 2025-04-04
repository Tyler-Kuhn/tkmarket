"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Importing the Prisma Client
const client_1 = require("@prisma/client");
// Creating an instance of PrismaClient
const prisma = new client_1.PrismaClient();
// Exporting the Prisma Client instance
exports.default = prisma;
