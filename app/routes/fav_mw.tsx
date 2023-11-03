import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { favoriteArticle, unfavoriteArticle } from "~/services/article-service";
import { getToken } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const token = await getToken(request);

  if (!token) {
    return redirect("/register");
  }

  const action = (formData.get("action") as string).split(",");

  if (action[0] === "FAVORITE") {
    const slug = action[1];
    const response = await favoriteArticle(slug, token);
    console.log(response.status);
    if (!response.ok) {
      // TODO: Add some error handling
      return null;
    }
    return null;
  } else if (action[0] === "UNFAVORITE") {
    const slug = action[1];
    const response = await unfavoriteArticle(slug, token);
    if (!response.ok) {
      // TODO: Add some error handling
      return null;
    }
    return null;
  } else {
    return null;
  }
};
