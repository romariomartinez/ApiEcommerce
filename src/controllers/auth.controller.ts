import { Request, Response } from 'express';
import prisma from '../prisma';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

/**
 * REGISTER
 */
export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.flatten(),
    });
  }

  const { email, password, fullName } = parsed.data;

  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = await hashPassword(password);

  const ROLE_CUSTOMER = 2;

  const user = await prisma.users.create({
    data: {
      email,
      password_hash: passwordHash,
      full_name: fullName,
      role_id: ROLE_CUSTOMER,
    },
    select: {
      id: true,
      email: true,
      full_name: true,
    },
  });

  return res.status(201).json(user);
}

/**
 * LOGIN
 */
export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.flatten(),
    });
  }

  const { email, password } = parsed.data;

  const user = await prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password_hash: true,
      role_id: true,
    },
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isValid = await comparePassword(password, user.password_hash);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken({
    userId: user.id,
    roleId: user.role_id,
  });

  return res.json({
    access_token: token,
  });
}
