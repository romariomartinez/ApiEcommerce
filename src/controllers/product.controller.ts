import { Request, Response } from 'express';
import prisma from '../prisma';
import {
  createProductSchema,
  updateProductSchema,
} from '../schemas/product.schema';
import { getCache, setCache } from '../config/cache';
/**
 * CREATE PRODUCT (ADMIN)
 */
export async function createProduct(req: Request, res: Response) {
  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { name, description, price, category_id, stock } = parsed.data;

  const product = await prisma.products.create({
    data: {
      name,
      description,
      price,
      category_id,
    },
  });

  await prisma.inventory.create({
    data: {
      product_id: product.id,
      stock,
    },
  });

  const productWithRelations = await prisma.products.findUnique({
    where: { id: product.id },
    include: {
      inventory: true,
      categories: true,
    },
  });

  return res.status(201).json(productWithRelations);
}



/**
 * UPDATE PRODUCT (ADMIN)
 */
export async function updateProduct(req: Request, res: Response) {
  const productId = req.params.id; // UUID STRING

  const parsed = updateProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { stock, ...productData } = parsed.data;

  const product = await prisma.products.update({
    where: { id: productId },
    data: productData,
  });

  if (stock !== undefined) {
    await prisma.inventory.update({
      where: { product_id: productId },
      data: { stock },
    });
  }

  const productWithRelations = await prisma.products.findUnique({
    where: { id: productId },
    include: {
      inventory: true,
      categories: true,
    },
  });

  return res.json(productWithRelations);
}

/**
 * DELETE PRODUCT (ADMIN) — SOFT DELETE
 */
export async function deleteProduct(req: Request, res: Response) {
  const productId = req.params.id; // UUID STRING

  await prisma.products.update({
    where: { id: productId },
    data: { is_active: false },
  });

  return res.status(204).send();
}

/**
 * Cachear productos
 */

export async function listProducts(_req: Request, res: Response) {
  const cacheKey = 'products:list';

  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  const products = await prisma.products.findMany({
    where: { is_active: true },
    include: {
      inventory: true,
      categories: true,
      product_images: true,
    },
  });

  await setCache(cacheKey, products, 120); // 2 minutos

  return res.json(products);}