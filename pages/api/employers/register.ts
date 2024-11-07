import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../middleware/auth';

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, passwordHash, companyName, industry, location, profileStatus } = req.body;

    try {
      const newEmployer = await prisma.employer.create({
        data: {
          email,
          passwordHash,
          companyName,
          industry,
          location,
          profileStatus,
        },
      });
      res.status(201).json(newEmployer);
    } catch (error) {
      console.error("Error creating employer:", error);
      res.status(500).json({ error: "Error creating employer" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default authMiddleware(handler, ['employer']);
