
import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { upload } from '../middlewares/upload.middleware';
import { uploadProductImage } from '../controllers/product-image.controller';

const router = Router();

/* ─────────────────────────────
   Product Images
   roleId = 1 (ADMIN)
───────────────────────────── */

/**
 * @openapi
 * /products/{id}/images:
 *   post:
 *     summary: Subir imagen de producto (ADMIN)
 *     tags:
 *       - Product Images
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Imagen subida correctamente
 *       400:
 *         description: Archivo inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.post(
  '/:id/images',
  authenticate,
  requireRole([1]),
  upload.single('image'),
  uploadProductImage
);

export default router;
