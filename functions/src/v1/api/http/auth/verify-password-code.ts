import * as functions from 'firebase-functions';
import authService from '../../../services/auth';
const cors = require('cors');

export default functions.https.onRequest(async (req: any, res: any) => {
  cors()(req, res, async () => {
    const passwordInfo = await authService.verifyPassword(req.body);
    res.send(passwordInfo);
  });
});
