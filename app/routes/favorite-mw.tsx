import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { favoriteArticle, unfavoriteArticle } from "~/services/article-service";
import { getToken } from "~/session.server";

export const action = async ({ request }: ActionArgs) => {
  const url = new URL(request.headers.get("referer") as string);
  const pathname = url.pathname;
  const searchParams = url.searchParams;
  const { slug, action } = await request.json();

  const token = await getToken(request);

  if (!token) {
    return redirect("/register");
  }

  switch (action) {
    case "FAVORITE": {
      await favoriteArticle(slug, token);
      return redirect(pathname + "?" + searchParams);
    }
    case "UNFAVORITE": {
      await unfavoriteArticle(slug, token);
      return redirect(pathname + "?" + searchParams);
    }
    default: {
      return redirect(pathname + "?" + searchParams);
    }
  }
};
