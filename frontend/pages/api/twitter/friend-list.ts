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

  if (token) {
    const oauth_token = token.twitterAccount.oauth_token;
    const oauth_token_secret = token.twitterAccount.oauth_token_secret;
    const twitterID = token.twitterProfile.id_str;

    const userClient = new TwitterApi({
      appKey: process.env.TWITTER_KEY as any,
      appSecret: process.env.TWITTER_SECRET as any,
      accessToken: oauth_token as any,
      accessSecret: oauth_token_secret as any,
    });

    const data = await userClient.v2.following(twitterID, {
      asPaginator: true,
      max_results: 1000,
    });

    while (!data.done) {
      const followingList = await data.fetchNext(1000);

      if (followingList) {
        const followingListUsernames = followingList.data.data.map(
          (m: any) => m.username
        );

        const matchedFriendList = await prisma.user.findMany({
          where: {
            twitterUsername: {
              in: followingListUsernames,
            },
          },
        });

        const matchedTwtUsernames = matchedFriendList.map(
          (m: any) => m.twitterUsername
        );

        let matchedFriendDetails: any[] = [];

        if (matchedTwtUsernames.length > 0) {
          matchedFriendDetails = await userClient.v1.users({
            screen_name: matchedTwtUsernames,
          });
        }

        const matchedFrenz = matchedFriendDetails.map((m) => ({
          id: m.id,
          name: m.name,
          screen_name: m.screen_name,
          profile_image_url: m.profile_image_url_https,
        }));

        res.status(200).json({ matchedFrenz });
      }
    }
  } else {
    res.status(401);
  }

  res.end();
}
