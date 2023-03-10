export const _formatGender = (genders: number[]) => {
  console.log("genders", genders[0]);
  switch (genders[0]) {
    case 1:
      return "male";
    case 2:
      return "female";
    default:
      return "all";
  }
};
export const _formatChosenLocations = (geo_locations: any) => {
  const { location_types, ...locations } = geo_locations;
  console.log("locations", locations);
  const formattedLocations = [];
  for (const key in locations) {
    if (Object.prototype.hasOwnProperty.call(locations, key)) {
      formattedLocations.push(locations[key]);
    }
  }
  return formattedLocations.flat();
};
