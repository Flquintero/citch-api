import { IFacebookLocation } from "../../../../types/modules/facebook/campaigns/interfaces";

export const _formatGender = (genders: number[]) => {
  if (!genders) return "all";
  switch (genders[0]) {
    case 1:
      return "male";
    case 2:
      return "female";
    default:
      return "all";
  }
};
export const _formatChosenLocations = async (geo_locations: any) => {
  const { location_types, ...locations } = geo_locations;
  const formattedLocations = [];
  for (const key in locations) {
    if (Object.prototype.hasOwnProperty.call(locations, key)) {
      // facebooks returns only country code as a string so we wanted to normalize
      if (key === "countries") {
        const formattedCountries = locations[key].map(
          (countryString: string) => {
            return {
              country_code: countryString,
              key: countryString,
              type: setSavedChosenLocationType(key),
            };
          }
        );
        formattedLocations.push(formattedCountries);
      } else {
        // add type to region, city and zip
        const otherLocations = locations[key].map(
          (locationObject: IFacebookLocation) => {
            return {
              ...locationObject,
              type: setSavedChosenLocationType(key),
            };
          }
        );
        formattedLocations.push(otherLocations);
      }
    }
  }
  return formattedLocations.flat();
};

const setSavedChosenLocationType = (locationType: string) => {
  switch (locationType) {
    case "countries":
      return "country";
    case "regions":
      return "region";
    case "cities":
      return "city";
    case "zips":
      return "zip";
    default:
      console.log("targeting locations tansform type error");
      return "";
  }
};
