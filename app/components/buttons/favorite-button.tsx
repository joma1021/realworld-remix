import { Form, useFetcher, useNavigation } from "@remix-run/react";

export function FavoriteButton({ favorite, favoritesCount }: { favorite: boolean; favoritesCount: number }) {
  const navigation = useNavigation();
  return (
    <Form style={{ display: "inline-block" }} method="post" preventScrollReset={true}>
      <button
        className={`btn btn-sm btn-${!favorite ? "outline-" : ""}primary `}
        type="submit"
        name="action"
        value={favorite ? "UNFAVORITE" : "FAVORITE"}
        disabled={navigation.state === "submitting"}
      >
        <i className="ion-heart"></i>
        &nbsp; {favorite ? "UNFAVORITE" : "FAVORITE"} Post
        <span className="counter"> ({favoritesCount})</span>
      </button>
    </Form>
  );
}

export function FavoriteButtonSmall({ favorite, favoritesCount, slug }: { favorite: boolean; favoritesCount: number; slug: string }) {
  const navigation = useNavigation();
  const fetcher = useFetcher({ key: slug });

  // NOTE: Optimistic UI -> update state directly without waiting for any response
  if (fetcher.state == "loading") {
    const action = fetcher.formData.get("action")?.toString() ?? "";
    if (action === `FAVORITE,${slug}`) {
      favorite = true;
      favoritesCount += 1;
    }
    if (action === `UNFAVORITE,${slug}`) {
      favorite = false;
      favoritesCount -= 1;
    }
  }
  return (
    <fetcher.Form className="pull-xs-right" method="post" preventScrollReset={true} action="/fav_mw">
      <button
        className={`btn btn-${!favorite ? "outline-" : ""}primary btn-sm pull-xs-right`}
        type="submit"
        disabled={navigation.state === "submitting"}
        name="action"
        value={favorite ? `UNFAVORITE,${slug}` : `FAVORITE,${slug}`}
      >
        <i className="ion-heart"></i>
        <span className="counter"> {favoritesCount}</span>
      </button>
    </fetcher.Form>
  );
}
