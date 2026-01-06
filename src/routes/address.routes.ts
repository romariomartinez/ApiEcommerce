import { Router } from 'express';
import {
  createAddress,
  listMyAddresses,
  setDefaultAddress,
  deleteAddress,
} from '../controllers/address.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
/**
 * @swagger
 * /swagger-test:
 *   get:
 *     summary: Swagger test endpoint
 *     responses:
 *       200:
 *         description: OK
 */
/* ─────────────────────────────
   All address routes require auth
───────────────────────────── */
router.use(authenticate);

/**
 * @openapi
 * /addresses:
 *   post:
 *     summary: Crear una nueva dirección
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [street, city, country]
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dirección creada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 */
router.post('/', createAddress);

/**
 * @openapi
 * /addresses:
 *   get:
 *     summary: Listar direcciones del usuario autenticado
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de direcciones
 *       401:
 *         description: No autenticado
 */
router.get('/', listMyAddresses);

/**
 * @openapi
 * /addresses/{id}/default:
 *   patch:
 *     summary: Marcar una dirección como predeterminada
 *     tags: [Addresses]
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
 *         description: Dirección marcada como predeterminada
 *       404:
 *         description: Dirección no encontrada
 */
router.patch('/:id/default', setDefaultAddress);

/**
 * @openapi
 * /addresses/{id}:
 *   delete:
 *     summary: Eliminar una dirección
 *     tags: [Addresses]
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
 *         description: Dirección eliminada
 *       404:
 *         description: Dirección no encontrada
 */
router.delete('/:id', deleteAddress);

export default router;
