import { Request, Response, NextFunction } from 'express';

export function requireVerified(req: Request, res: Response, next: NextFunction) {
  const user = (req as Request & { user?: { verificationStatus?: string } }).user;
  if (!user || user.verificationStatus !== 'APPROVED') {
    res.status(403).json({
      success: false,
      message: 'Identity verification required',
      code: 'VERIFICATION_REQUIRED',
    });
    return;
  }
  next();
}
