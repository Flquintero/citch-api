export const _getTargetedPlacementObject = (platform: string) => {
  switch (platform) {
    case "facebook":
      return {
        publisher_platforms: ["facebook"],
        facebook_positions: ["feed"],
      };
      break;
    case "instagram":
      return {
        publisher_platforms: ["instagram"],
        //instagram_positions: ["story", "stream"],
      };
      break;
    default:
      return;
    // code block
  }
};
