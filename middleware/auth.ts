import { getSession } from 'next-auth/client';
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

export function authMiddleware(handler: NextApiHandler, allowedRoles: string[]) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(session.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    req.user = session.user;
    return handler(req, res);
  };
}
