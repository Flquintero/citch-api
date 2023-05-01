export const _getTargetedGenderEnum = (gender: string) => {
  switch (gender) {
    case "male":
      return { genders: [1] };
    case "female":
      return { genders: [2] };
    case "all":
      return null;
    default:
      console.log("targeting gender error");
      return null;
  }
};
