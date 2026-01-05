import { Request, Response } from 'express';
import prisma from '../prisma';
import cloudinary from '../config/cloudinary';

export async function uploadProductImage(req: Request, res: Response) {
  const productId = req.params.id; // UUID

  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  const result = await cloudinary.uploader.upload(
    `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
    {
      folder: `products/${productId}`,
    }
  );

  const image = await prisma.product_images.create({
    data: {
      product_id: productId,
      url: result.secure_url,
      is_main: false,
    },
  });

  return res.status(201).json(image);
}
