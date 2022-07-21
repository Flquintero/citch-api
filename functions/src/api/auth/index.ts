import { Request, Response, NextFunction, Router } from 'express';
import authService from '../../services/auth';

const authRouter = Router();

authRouter.post(
  '/verify-password-code',
  async (req: Request, res: Response, next: NextFunction) => {
    const passwordInfo = await authService.verifyPassword(req.body, next);
    res.send(passwordInfo);
  }
);

authRouter.post(
  '/confirm-password-reset',
  async (req: Request, res: Response, next: NextFunction) => {
    const passwordInfo = await authService.confirmPasswordReset(req.body, next);
    res.send(passwordInfo);
  }
);

authRouter.get('*', async (req: Request, res: Response) => {
  res.status(404).send('This route does not exist.');
});

module.exports = authRouter;
