import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { compare } from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  console.log(email);
  console.log(password);

  try {
    const user = await prisma.employer.findUnique({ where: { email } }) ||
                 await prisma.student.findUnique({ where: { email } });

    console.log(user);
    console.log(user?.passwordHash);
    console.log(user?.email);

    if (!user) {
      return res.status(401).json({ message: `de {email}` });
    }

    
    const isValidPassword = await (password == user.passwordHash)? true : false;
    if (!isValidPassword) {
      return res.status(401).json({ message: {user} });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: 'companyName' in user ? 'employer' : 'student',
      },
      process.env.JWT_SECRET || 'your_jwt_secret', // Usa una variable de entorno para mayor seguridad
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, role: 'companyName' in user ? 'employer' : 'student' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
