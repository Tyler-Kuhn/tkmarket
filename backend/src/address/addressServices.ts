import prisma from "../config/db";

export const createAddress = async (userId: number, addressInfo: any) => {
  await prisma.address.create({
    data: { ...addressInfo, userId },
  });
};

export const getUserAddresses = async (userId: number) => {
  const addresses = await prisma.address.findMany({
    where: { userId },
  });

  return addresses;
};

export const updateUserAddress = async (userId:number , addressId: number, street?: string, city? :string, state?: string, zip? :string, country? :string, type? :string) => {
    await prisma.address.update({
        where: {userId, id: addressId},
        data: {street, city, state, zip, country, type}
    })
}

export const deleteUserAddress = async (userId:number , addressId: number) => {
    await prisma.address.delete({
        where: {userId, id: addressId}
    });
}
