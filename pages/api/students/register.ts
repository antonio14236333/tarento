import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../middleware/auth';

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, passwordHash, fullName, educationLevel, careerStatus, skills, experience, education, location, profileStatus } = req.body;

    try {
      const newStudent = await prisma.student.create({
        data: {
          email,
          passwordHash,
          fullName,
          educationLevel,
          careerStatus,
          skills,
          experience,
          education,
          location,
          profileStatus,
        },
      });
      res.status(201).json(newStudent);
    } catch (error) {
      console.error("Error creating student:", error);
      res.status(500).json({ error: "Error creating student" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default authMiddleware(handler, ['student']);
