import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import {
  getAdminDashboard,
  getSalesReport,
  getOrdersByStatus,
  getTopProducts,
  getLowStockReport,
} from '../controllers/admin-report.controller';

const router = Router();

/* ─────────────────────────────
   Admin Reports (ADMIN only)
   roleId = 1
───────────────────────────── */

/**
 * @openapi
 * /admin/reports/dashboard:
 *   get:
 *     summary: Dashboard administrativo
 *     tags: [Admin Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas generales del sistema
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 */
router.get(
  '/dashboard',
  authenticate,
  requireRole([1]),
  getAdminDashboard
);

/**
 * @openapi
 * /admin/reports/sales:
 *   get:
 *     summary: Reporte de ventas
 *     tags: [Admin Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ventas agregadas
 */
router.get(
  '/sales',
  authenticate,
  requireRole([1]),
  getSalesReport
);

/**
 * @openapi
 * /admin/reports/orders-status:
 *   get:
 *     summary: Órdenes agrupadas por estado
 *     tags: [Admin Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Órdenes por estado
 */
router.get(
  '/orders-status',
  authenticate,
  requireRole([1]),
  getOrdersByStatus
);

/**
 * @openapi
 * /admin/reports/top-products:
 *   get:
 *     summary: Productos más vendidos
 *     tags: [Admin Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ranking de productos
 */
router.get(
  '/top-products',
  authenticate,
  requireRole([1]),
  getTopProducts
);

/**
 * @openapi
 * /admin/reports/low-stock:
 *   get:
 *     summary: Productos con bajo inventario
 *     tags: [Admin Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Productos con stock bajo
 */
router.get(
  '/low-stock',
  authenticate,
  requireRole([1]),
  getLowStockReport
);

export default router;
