import type { ActionArgs } from "@vercel/remix";
import { redirect } from "@vercel/remix";
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
