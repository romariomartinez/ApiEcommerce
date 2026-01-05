import { Request, Response } from 'express';
import prisma from '../prisma';
import { createAddressSchema } from '../schemas/address.schema';

/**
 * CREATE ADDRESS
 */
export async function createAddress(req: Request, res: Response) {
  const userId = req.user!.userId;
  const parsed = createAddressSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const address = await prisma.addresses.create({
    data: {
      ...parsed.data,
      user_id: userId,
    },
  });

  return res.status(201).json(address);
}

/**
 * LIST MY ADDRESSES
 */
export async function listMyAddresses(req: Request, res: Response) {
  const userId = req.user!.userId;

  const addresses = await prisma.addresses.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
  });

  return res.json(addresses);
}

/**
 * SET DEFAULT ADDRESS
 */
export async function setDefaultAddress(req: Request, res: Response) {
  const userId = req.user!.userId;
  const addressId = req.params.id;

  const address = await prisma.addresses.findUnique({
    where: { id: addressId },
  });

  if (!address || address.user_id !== userId) {
    return res.status(404).json({ error: 'Address not found' });
  }

  await prisma.$transaction([
    prisma.addresses.updateMany({
      where: { user_id: userId },
      data: { is_default: false },
    }),
    prisma.addresses.update({
      where: { id: addressId },
      data: { is_default: true },
    }),
  ]);

  return res.json({ message: 'Default address updated' });
}

/**
 * DELETE ADDRESS
 */
export async function deleteAddress(req: Request, res: Response) {
  const userId = req.user!.userId;
  const addressId = req.params.id;

  const address = await prisma.addresses.findUnique({
    where: { id: addressId },
  });

  if (!address || address.user_id !== userId) {
    return res.status(404).json({ error: 'Address not found' });
  }

  await prisma.addresses.delete({
    where: { id: addressId },
  });

  return res.status(204).send();
}
