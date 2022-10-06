// middleware
import { $appCheckVerification } from '../../middleware/firebase/app-check/firebase-app-check-verification';
// services
import authService from '../../services/auth';
// types
import { Request, Response, NextFunction, Router } from 'express';
// declarations
const authRouter = Router();

authRouter.post(
  '/verify-password-code',
  [$appCheckVerification],
  async (req: Request, res: Response, next: NextFunction) => {
    const passwordInfo = await authService.verifyPassword(req.body, next);
    res.send(passwordInfo);
  }
);

authRouter.post(
  '/confirm-password-reset',
  [$appCheckVerification],
  async (req: Request, res: Response, next: NextFunction) => {
    const passwordInfo = await authService.confirmPasswordReset(req.body, next);
    res.send(passwordInfo);
  }
);

authRouter.get('*', async (res: Response) => {
  res.status(404).send('This route does not exist.');
});

module.exports = authRouter;
