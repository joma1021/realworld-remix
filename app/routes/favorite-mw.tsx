import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { favoriteArticle, unfavoriteArticle } from "~/services/article-service";
import { getToken } from "~/session.server";

export const action = async ({ request }: ActionArgs) => {
  const redirectUrl = request.headers.get("referer") as string;
  const requestUrl = new URL(request.url);
  const action = requestUrl.searchParams.get("action");
  const slug = requestUrl.searchParams.get("slug") as string;
  const token = await getToken(request);

  if (!token) {
    return redirect("/register");
  }

  switch (action) {
    case "FAVORITE": {
      await favoriteArticle(slug, token);
      console.log("i was in redirect");
      return redirect(redirectUrl);
    }
    case "UNFAVORITE": {
      await unfavoriteArticle(slug, token);
      return redirect(redirectUrl);
    }
    default: {
      return redirect(redirectUrl);
    }
  }
};
