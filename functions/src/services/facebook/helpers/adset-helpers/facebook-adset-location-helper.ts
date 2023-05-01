import type { IFacebookLocation } from "../../../../types/modules/facebook/campaigns/interfaces";

const defineValuePerType = (locationObject: IFacebookLocation) => {
  switch (locationObject.type) {
    case "country":
      return locationObject.country_code;
    case "region":
      return { key: locationObject.key };
    case "city":
      return {
        key: locationObject.key,
        // radius: locationObject.radiusNumber,
        // distance_unit: locationObject.radiusUnit,
      };
    case "zip":
      return { key: locationObject.key };
    default:
      console.log("targeting locations format value error");
      return { key: locationObject.key };
  }
};
const transformType = (singularType: string) => {
  switch (singularType) {
    case "country":
      return "countries";
    case "region":
      return "regions";
    case "city":
      //need to change radius and distance unit to be dinamic
      return "cities";
    case "zip":
      return "zips";
    default:
      console.log("targeting locations tansform type error");
      return "";
  }
};

export const _getTargetedLocationObject = (locations: any) => {
  let locationsObject = locations.reduce(function (
    resultObject: any,
    group: any
  ) {
    (resultObject[transformType(group["type"])] =
      resultObject[transformType(group["type"])] || []).push(
      defineValuePerType(group)
    );
    return resultObject;
  },
  {});
  return { geo_locations: locationsObject };
};
