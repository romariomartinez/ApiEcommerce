import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { authLimiter } from '../middlewares/rate-limit.middleware';

const router = Router();

/* ─────────────────────────────
   Authentication
───────────────────────────── */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registro de usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@test.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 12345678
 *               fullName:
 *                 type: string
 *                 example: Test User
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Email ya registrado
 */
router.post('/register', authLimiter, register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Autenticación de usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@ecommerce.local
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Admin12345!
 *     responses:
 *       200:
 *         description: Token JWT generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', authLimiter, login);

export default router;
