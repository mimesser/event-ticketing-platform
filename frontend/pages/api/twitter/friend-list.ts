import { TwitterApi } from "twitter-api-v2";
import { getToken } from "next-auth/jwt";
import { NextApiResponse, NextApiRequest } from "next";
import prisma from "lib/prisma";

const secret = process.env.TOKEN_SECRET;

export default async function linkUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token: any = await getToken({ req, secret });

  if (!token) {
    res.status(400).json({ error: "Missing token" });
    return;
  }

  const oauth_token = token.twitterAccount.oauth_token;
  const oauth_token_secret = token.twitterAccount.oauth_token_secret;
  const twitterID = token.twitterProfile.id_str;

  const userClient = new TwitterApi({
    appKey: process.env.TWITTER_KEY as string,
    appSecret: process.env.TWITTER_SECRET as string,
    accessToken: oauth_token as string,
    accessSecret: oauth_token_secret as string,
  });

  const data = await userClient.v2.following(twitterID, {
    asPaginator: true,
    max_results: 1000,
  });

  let latestFollowingList = data;
  let matchedFrenz: any[] = [];

  do {
    if (latestFollowingList) {
      const followingListUsernames = latestFollowingList.data.data.map(
        (m: any) => m.username
      );

      const matchedFriendList = await prisma.user.findMany({
        where: {
          twitterUsername: {
            in: followingListUsernames,
          },
        },
      });

      const matchedTwtUserDetails = matchedFriendList.map(
        ({ twitterUsername, id }: any) => ({
          id,
          screen_name: twitterUsername,
        })
      );

      let matchedFriendDetails: any[] = [];

      if (matchedTwtUserDetails.length > 0) {
        matchedFriendDetails = await userClient.v1.users({
          screen_name: matchedTwtUserDetails.map((m) => m.screen_name),
        });
      }

      matchedFrenz.push(
        ...matchedFriendDetails.map((m) => {
          const data = matchedTwtUserDetails.find(
            (dbRecord) => dbRecord.screen_name === m.screen_name
          );
          return {
            id: data!.id,
            name: m.name,
            screen_name: m.screen_name,
            profile_image_url: m.profile_image_url_https,
          };
        })
      );

      latestFollowingList = await data.fetchNext(1000);
      continue;
    }

    res.status(502);
  } while (!data.done);

  return res.status(200).json({ matchedFrenz });
}
