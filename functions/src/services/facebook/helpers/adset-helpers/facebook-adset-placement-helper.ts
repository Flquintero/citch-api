import { EInstagramAudiencePosition } from "../../../../types/modules/facebook/pages/enums";

export const _getTargetedPlacementObject = (
  platform: string,
  postPlacement: string
) => {
  switch (platform) {
    case "facebook":
      return {
        publisher_platforms: ["facebook"],
        facebook_positions: postPlacement,
      };
      break;
    case "instagram":
      return {
        publisher_platforms: ["instagram"],
        instagram_positions: [EInstagramAudiencePosition[postPlacement as any]], // the actual placement we get from instagram posts and the one needed for ads is different
      };
      break;
    default:
      return;
    // code block
  }
};
