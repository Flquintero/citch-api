import { Request, Response, NextFunction, Router } from 'express';
import organizationsService from '../../services/organizations';

const organizationsRouter = Router();

/**
 * Call Google Firebase Auth to Confirm Code is right
 */

organizationsRouter.post('/create', async (req: Request, res: Response, next: NextFunction) => {
  res.json(await organizationsService.create(req.body, next));
});

/**
 * Get a specific room by its SID (unique identifier)
 *
 * It is also possible to get rooms by name, but this only works for in-progress rooms.
 * You can use this endpoint to get rooms of any status!
 */

// organizationsRouter.get('/:sid', async (request, response, next) => {
//   const sid: string = request.params.sid;

//   try {
//     // Call the Twilio video API to retrieve the room you created
//     const room = 'test';

//     return response.status(200).send({ room });
//   } catch (error) {
//     return response.status(400).send({
//       message: `Unable to get room with sid=${sid}`,
//       error,
//     });
//   }
// });

/**
 * Complete a room
 *
 * This will update the room's status to `completed` and will end the video chat, disconnecting any participants.
 * The room will not be deleted, but it will no longer appear in the list of in-progress rooms.
 */

// organizationsRouter.post('/:sid/complete', async (request, response, next) => {
//   // Get the SID from the request parameters.
//   const sid: string = request.params.sid;

//   try {
//     // Create a `Room` object with the details about the closed room.
//     const closedRoom: any = 'tesy';

//     return response.status(200).send({ closedRoom });
//   } catch (error) {
//     return response.status(400).send({
//       message: `Unable to complete room with sid=${sid}`,
//       error,
//     });
//   }
// });

organizationsRouter.get('*', async (req: Request, res: Response) => {
  res.status(404).send('This route does not exist.');
});

module.exports = organizationsRouter;
