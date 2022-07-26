import { Request, Response, NextFunction, Router } from 'express';
import organizationsService from '../../services/organizations';

const organizationsRouter = Router();

organizationsRouter.post('/update', async (req: Request, res: Response, next: NextFunction) => {
  res.json(await organizationsService.update(req.body, next));
});

organizationsRouter.get('*', async (req: Request, res: Response) => {
  res.status(404).send('This route does not exist.');
});

module.exports = organizationsRouter;
