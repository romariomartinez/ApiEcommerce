import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

import {
  createProduct,
  listProducts,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';

const router = Router();

/* ─────────────────────────────
   Products - Public
───────────────────────────── */

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Listar productos activos
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get('/', listProducts);

/* ─────────────────────────────
   Products - Admin
   roleId = 1
───────────────────────────── */

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Crear producto (ADMIN)
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: Camiseta negra
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 example: 49.99
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               stock:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       201:
 *         description: Producto creado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.post(
  '/',
  authenticate,
  requireRole([1]),
  createProduct
);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Actualizar producto (ADMIN)
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category_id:
 *                 type: integer
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.put(
  '/:id',
  authenticate,
  requireRole([1]),
  updateProduct
);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Eliminar producto (soft delete, ADMIN)
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Producto desactivado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.delete(
  '/:id',
  authenticate,
  requireRole([1]),
  deleteProduct
);

export default router;
