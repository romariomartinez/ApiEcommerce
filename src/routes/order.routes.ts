import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

import {
  createOrder,
  listMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelMyOrder,
} from '../controllers/order.controller';

const router = Router();

/* ─────────────────────────────
   Orders - User
───────────────────────────── */

/**
 * @openapi
 * /orders:
 *   post:
 *     summary: Crear pedido
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - quantity
 *                   properties:
 *                     product_id:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       201:
 *         description: Pedido creado
 *       400:
 *         description: Stock insuficiente
 */
router.post('/', authenticate, createOrder);

/**
 * @openapi
 * /orders/my:
 *   get:
 *     summary: Listar pedidos del usuario autenticado
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos del usuario
 *       401:
 *         description: No autenticado
 */
router.get('/my', authenticate, listMyOrders);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     summary: Ver detalle de un pedido
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID del pedido
 *     responses:
 *       200:
 *         description: Detalle del pedido
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Pedido no encontrado
 */
router.get('/:id', authenticate, getOrderById);

/**
 * @openapi
 * /orders/{id}/cancel:
 *   patch:
 *     summary: Cancelar pedido del usuario
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido cancelado
 *       400:
 *         description: No se puede cancelar el pedido
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Pedido no encontrado
 */
router.patch('/:id/cancel', authenticate, cancelMyOrder);

/* ─────────────────────────────
   Orders - Admin
   roleId = 1
───────────────────────────── */

/**
 * @openapi
 * /orders/{id}/status:
 *   patch:
 *     summary: Cambiar estado del pedido (ADMIN)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: SHIPPED
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       400:
 *         description: Transición inválida
 *       403:
 *         description: No autorizado
 */
router.patch(
  '/:id/status',
  authenticate,
  requireRole([1]),
  updateOrderStatus
);

export default router;
