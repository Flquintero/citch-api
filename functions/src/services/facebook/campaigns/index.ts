// General Helpers
import {
  $facebookErrorHandler,
  $firestormErrorHandler,
} from "../../../utils/error-handler";
import { $toDocReference } from "../../../utils/firebase/firestorm/firebase-firestorm-helpers";

// Local Helpers
import {
  _getCreateDBFacebookCampaignPayload,
  _getupdateDBFacebookCampaignPayload,
} from "./helpers/campaign-payload-builder";
import {
  _createMultipleFacebookCampaigns,
  _createFacebookCampaign,
  _updateMultipleFacebookCampaigns,
  _updateFacebookCampaign,
  _deleteMultipleFacebookCampaigns,
  _deleteFacebookCampaign,
  _getMultipleFacebookCampaignEdge,
  _getFacebookCampaignEdge,
} from "./helpers/facebook-campaign-requests";
import { _getFacebookAdInsights } from "./helpers/ facebook-insights-requests";
import { _updateMultipleFacebookAdSets } from "../helpers/adset-helpers/facebook-adset-requests";
import { _createFacebookAdCreative } from "../helpers/adcreative-helpers/facebook-adcreative-requests";
import { _createMultipleFacebookAds } from "../helpers/ad-helpers/facebook-ad-requests";
import { _getInstagramPost } from "../pages/helpers/instagram-post-requests";

// Types
import {
  IDBFacebookCampaign,
  IDBUpdateFacebookCampaignPayload,
  ICreateMultipleCampaignsResponse,
  ISaveFacebookCampaignObject,
  IUpdateFacebookCampaignPayload,
} from "../../../types/modules/facebook/campaigns/interfaces";
import {
  EFacebookAdSetStatus,
  EFacebookAdStatus,
  EFacebookCampaignStatus,
  EFacebookObjectiveIdentifier,
  EFacebookObjectiveValue,
} from "../../../types/modules/facebook/campaigns/enums";
import { IReadObject } from "../../../types/general/services";
import { NextFunction, Request } from "express";

// Constants
import { db } from "../../../config/firebase";
const FACEBOOK_CAMPAIGNS_DB = db.collection("facebook_campaigns");

// Methods
export const campaigns = {
  getCampaign: async function (options: IReadObject, next: NextFunction) {
    try {
      const { id } = options;
      const campaign = await FACEBOOK_CAMPAIGNS_DB.doc(id).get();
      // add the below when we add to also get the campaigns from facebook
      // if (includeFacebookCampaign) {
      //   // include code to get existing facebook campaigns
      // }
      return campaign.data();
    } catch (error: any) {
      return next(await $firestormErrorHandler(error));
    }
  },
  getCampaigns: async function (req: Request, next: NextFunction) {
    try {
      const { organizationId } = req.body;
      const organizationReference = await $toDocReference(
        `organizations/${organizationId}`
      );
      const campaignsResponse = await FACEBOOK_CAMPAIGNS_DB.where(
        "organization",
        "==",
        organizationReference
      )
        .orderBy("updatedOn", "desc")
        .limit(6)
        .get();
      const campaignsList: any[] = [];
      if (campaignsResponse.empty) return campaignsList;
      campaignsResponse.forEach((doc: any) => {
        campaignsList.push({ id: doc.id, ...doc.data() });
      });
      return campaignsList;
    } catch (error: any) {
      return next(await $firestormErrorHandler(error));
    }
  },
  getCampaignInsights: async function (req: Request, next: NextFunction) {
    const { savedDBFacebookCampaign } = req.body;
    const { facebookCampaigns } = savedDBFacebookCampaign;
    console.log("facebookCampaigns", facebookCampaigns);
    try {
      const adCreative = await _getFacebookCampaignEdge(
        {
          // TAKE OFF TEST ID AND LEAVE DYNAMIC
          campaignId: "23848084221850097", // facebookCampaigns[0],
          targetEdge: "ads",
          targetFields: "id",
        },
        next
      );
      console.log("adCreatives", adCreative);
      return await _getFacebookAdInsights(
        {
          adId: adCreative.data[0].id, // IF we start doing citch reach this need to actually get the insight for 2 campaigns
          fields: "reach,spend,date_start,date_stop,campaign_name,actions",
          date_preset: "maximum",
        },
        next
      );
    } catch (error: any) {
      console.log("Error Facebook Get Campaign Insights", error);
      return next(await $firestormErrorHandler(error));
    }
  },
  getPromotedPostCampaigns: async function (req: Request, next: NextFunction) {
    try {
      const campaigns = await this.getCampaigns(req, next);
      const promotedPostCampaigns = await Promise.all(
        (campaigns as any[]).map(async (campaign: any) => {
          const postResponse = await _getInstagramPost(
            {
              postId: campaign.promotedPost,
              fields: "permalink",
            },
            next
          );
          return {
            postUrl: postResponse.permalink,
            platform: campaign.platform,
            id: campaign.id,
          };
        })
      );
      return promotedPostCampaigns;
    } catch (error: any) {
      console.log("Error Facebook Get Promoted PostCampaigns", error);
      return next(await $firestormErrorHandler(error));
    }
  },
  createCampaign: async function (
    options: IDBFacebookCampaign,
    next: NextFunction
  ) {
    try {
      const savedCampaign = await FACEBOOK_CAMPAIGNS_DB.add(
        await _getCreateDBFacebookCampaignPayload(options)
      );
      return savedCampaign.id;
    } catch (error: any) {
      console.log("Error Facebook Create Campaign", error);
      return next(await $firestormErrorHandler(error));
    }
  },
  updateCampaign: async function (
    options: IDBUpdateFacebookCampaignPayload,
    next: NextFunction
  ) {
    try {
      const { campaignId, updateData } = options;
      const updatedFacebookDBCampaign = await FACEBOOK_CAMPAIGNS_DB.doc(
        campaignId
      ).update(
        await _getupdateDBFacebookCampaignPayload({
          updateData,
        })
      );
      return updatedFacebookDBCampaign;
    } catch (error: any) {
      console.log("Error Facebook Update Campaign", error);
      return next(await $facebookErrorHandler(error));
    }
  },
  saveCampaignObjective: async function (req: Request, next: NextFunction) {
    try {
      const { saveCampaignObject, organizationId } = req.body;
      const {
        campaignData,
        pageId,
        postId,
        postPlacement,
        postMediaType,
        platform,
        instagramAccountId,
      } = saveCampaignObject;
      const {
        facebookObjectiveValues,
        facebookObjectiveIdentifier,
        ...facebookCampaignData
      } = campaignData;
      // We always start with creating a campaign because an objective is the first thing we do
      const createdFacebookCampaigns = await _createMultipleFacebookCampaigns(
        {
          facebookObjectiveValues,
          facebookCampaignData,
        },
        next
      );
      const createCampaignPayload: IDBFacebookCampaign = {
        facebookCampaigns: (
          createdFacebookCampaigns as ICreateMultipleCampaignsResponse
        ).campaigns,

        facebookObjectiveIdentifier,
        facebookPage: pageId,
        promotedPost: postId,
        postPlacement: postPlacement,
        postMediaType: postMediaType,
        ...(instagramAccountId
          ? { instagramAccount: instagramAccountId }
          : null),
        platform,
        facebookAdAccount: (
          createdFacebookCampaigns as ICreateMultipleCampaignsResponse
        ).facebookAdAccount,
        organizationPathId: `organizations/${organizationId}`,
        budgetSavedByUser: false,
        durationSavedByUser: false,
      };
      return await this.createCampaign(createCampaignPayload, next);
    } catch (error: any) {
      console.log("Error Facebook/DB Save Objective", error);
      return next(error);
    }
  },
  updateCampaignObjective: async function (req: Request, next: NextFunction) {
    try {
      const { saveCampaignObject, savedDBFacebookCampaign } = req.body;
      let { facebookCampaigns, facebookAdAccount } =
        savedDBFacebookCampaign as IDBFacebookCampaign;
      const { campaignId, campaignData } =
        saveCampaignObject as ISaveFacebookCampaignObject;
      const {
        facebookObjectiveIdentifier,
        facebookObjectiveValues,
        ...facebookCampaignData
      } = campaignData;
      // Is the new or saved campaign citch_reach
      const isNewCampaignCitchReach =
        campaignData.facebookObjectiveIdentifier ===
        EFacebookObjectiveIdentifier.citch_reach;
      const isSavedCampaignCitchReach =
        savedDBFacebookCampaign.facebookObjectiveIdentifier ===
        EFacebookObjectiveIdentifier.citch_reach;
      // if citch_reach then we delete the saved one and just create a new one on facebook but update the DB
      // It can also be generic and look for multiple values instead of just citch_reach
      if (isNewCampaignCitchReach || isSavedCampaignCitchReach) {
        await _deleteMultipleFacebookCampaigns(
          { facebookCampaigns: facebookCampaigns as string[] },
          next
        );
        const createdFacebookCampaigns =
          (await _createMultipleFacebookCampaigns(
            {
              facebookObjectiveValues:
                facebookObjectiveValues as EFacebookObjectiveValue[],
              facebookCampaignData,
            },
            next
          )) as ICreateMultipleCampaignsResponse;
        // overwrite existing local values for these values which came back from DB
        facebookCampaigns = createdFacebookCampaigns.campaigns;
        facebookAdAccount = createdFacebookCampaigns.facebookAdAccount;
      } else {
        // at this point you would only be updating a campaign with only one objective and a DB Facebook Campaign with with saved id
        const updateFacebookCampaignPayload: IUpdateFacebookCampaignPayload = {
          savedFacebookCampaignId: (facebookCampaigns as string[])[0],
          updateContent: {
            objective: (
              facebookObjectiveValues as EFacebookObjectiveValue[]
            )[0],
            ...facebookCampaignData,
          },
        };
        await _updateFacebookCampaign(updateFacebookCampaignPayload, next);
      }
      const updateDBCampaignPayload: IDBUpdateFacebookCampaignPayload = {
        campaignId: campaignId as string, // we use the passed campaignId here because it is the same we used to get the saved one, so it wouldnt make a difference
        updateData: {
          facebookCampaigns: facebookCampaigns,
          facebookObjectiveIdentifier,
          facebookAdAccount: facebookAdAccount,
        } as IDBFacebookCampaign,
      };
      return await this.updateCampaign(updateDBCampaignPayload, next);
    } catch (error: any) {
      console.log("Error Facebook/DB Update Objective", error);
      return next(error);
    }
  },
  publishCampaign: async function (req: Request, next: NextFunction) {
    try {
      const { savedDBFacebookCampaign } = req.body;
      const {
        promotedPost,
        facebookAdAccount,
        facebookCampaigns,
        platform,
        instagramAccount,
        facebookPage,
      } = savedDBFacebookCampaign as IDBFacebookCampaign;
      const adCreative = await _createFacebookAdCreative(
        {
          platform: platform,
          instagramAccount: instagramAccount,
          postId: promotedPost,
          facebookPage: facebookPage,
          adAccount: facebookAdAccount,
        },
        next
      );
      console.log("adCreative", adCreative);
      const facebookAdSets: any = await _getMultipleFacebookCampaignEdge(
        {
          campaignIds: facebookCampaigns as string[],
          targetEdge: "adsets",
          targetFields: "id",
        },
        next
      );
      const adSetsList = facebookAdSets[0].data;
      if (!adSetsList[0]) {
        return;
      }
      // the multiple ads helper is different format then the rest that uses payload array but because there is not much to it
      await _createMultipleFacebookAds(
        {
          adSets: adSetsList,
          adCreative,
          adAccount: facebookAdAccount as string,
          status: EFacebookAdStatus.active,
        },
        next
      );
      const adSetPayloadArray = adSetsList.map((adSetId: { id: string }) => {
        return {
          adSetId: adSetId.id,
          status: EFacebookAdSetStatus.active,
        };
      });
      await _updateMultipleFacebookAdSets({ adSetPayloadArray }, next);
      return await _updateMultipleFacebookCampaigns(
        {
          campaignData: { status: EFacebookCampaignStatus.active },
          facebookCampaigns: facebookCampaigns as string[],
        },
        next
      );
    } catch (error: any) {
      console.log("Error Facebook Publish Campaign", error);
      return next(await $facebookErrorHandler(error));
    }
  },
};
