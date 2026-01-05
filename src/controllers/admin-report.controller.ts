import { Request, Response } from 'express';
import prisma from '../prisma';

export async function getAdminDashboard(_req: Request, res: Response) {
  const [
    totalOrders,
    totalRevenue,
    totalUsers,
    totalProducts,
  ] = await Promise.all([
    prisma.orders.count(),
    prisma.orders.aggregate({
      _sum: { total: true },
      where: { status: { not: 'CANCELLED' } },
    }),
    prisma.users.count({ where: { is_active: true } }),
    prisma.products.count({ where: { is_active: true } }),
  ]);

  return res.json({
    totalOrders,
    totalRevenue: totalRevenue._sum.total ?? 0,
    totalUsers,
    totalProducts,
  });
}
export async function getSalesReport(req: Request, res: Response) {
  const { from, to } = req.query;

  const sales = await prisma.orders.findMany({
    where: {
      created_at: {
        gte: new Date(from as string),
        lte: new Date(to as string),
      },
      status: { not: 'CANCELLED' },
    },
    select: {
      id: true,
      total: true,
      created_at: true,
      status: true,
    },
  });

  return res.json(sales);
}

export async function getOrdersByStatus(_req: Request, res: Response) {
  const result = await prisma.orders.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  return res.json(result);
}

export async function getTopProducts(_req: Request, res: Response) {
  const result = await prisma.order_items.groupBy({
    by: ['product_id'],
    _sum: { quantity: true },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: 10,
  });

  const products = await prisma.products.findMany({
    where: {
      id: { in: result.map(r => r.product_id) },
    },
    select: {
      id: true,
      name: true,
      price: true,
    },
  });

  return res.json(
    result.map(r => ({
      product: products.find(p => p.id === r.product_id),
      quantitySold: r._sum.quantity,
    }))
  );
}

export async function getLowStockReport(_req: Request, res: Response) {
  const items = await prisma.inventory.findMany({
    where: {
      stock: {
        lt: 10,
      },
    },
    include: {
      products: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return res.json(items);
}
