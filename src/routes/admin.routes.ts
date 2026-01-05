import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

/* ─────────────────────────────
   Admin Dashboard
   roleId = 1
───────────────────────────── */

/**
 * @openapi
 * /admin/dashboard:
 *   get:
 *     summary: Acceso al dashboard administrativo
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acceso concedido al dashboard
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 */
router.get(
  '/dashboard',
  authenticate,
  requireRole([1]),
  (_req, res) => {
    res.status(200).json({
      message: 'Welcome admin',
    });
  }
);

export default router;
