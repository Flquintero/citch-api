import { IFacebookInterest } from "./../../../../types/modules/facebook/campaigns/interfaces";
export const _getTargetedInterestsObject = async (
  chosenInterests: IFacebookInterest[]
) => {
  return {
    flexible_spec: [
      {
        interests: await _formatChosenInterestsPayload(chosenInterests),
      },
    ],
  };
};

const _formatChosenInterestsPayload = (
  chosenInterests: IFacebookInterest[]
) => {
  return chosenInterests.map((interest: IFacebookInterest) => {
    return {
      id: interest.id,
      name: interest.name,
    };
  });
};
