import { Form, useNavigation, useSubmit } from "@remix-run/react";
import { useState } from "react";

export function FavoriteButton({
  favorite,
  favoritesCount,
  slug,
}: {
  favorite: boolean;
  favoritesCount: number;
  slug: string;
}) {
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
        &nbsp; {favorite ? "Unfavorite" : "Favorite"} Post
        <span className="counter"> ({favoritesCount})</span>
      </button>
    </Form>
  );
}

export function FavoriteButtonSmall({
  favorite,
  favoritesCount,
  slug,
}: {
  favorite: boolean;
  favoritesCount: number;
  slug: string;
}) {
  const submit = useSubmit();
  const navigation = useNavigation();

  const [favoriteState, setFavoriteState] = useState({
    favorite: favorite,
    favoritesCount: favoritesCount,
  });

  function handleOnSubmit() {
    if (favoriteState.favorite) {
      setFavoriteState({ favorite: false, favoritesCount: favoriteState.favoritesCount - 1 });

      submit(JSON.stringify({ slug: slug, action: "UNFAVORITE" }), {
        replace: true,
        encType: "application/json",
        method: "post",
        action: "/favorite-mw",
        preventScrollReset: true,
      });
    } else {
      setFavoriteState({ favorite: true, favoritesCount: favoriteState.favoritesCount + 1 });
      submit(JSON.stringify({ slug: slug, action: "FAVORITE" }), {
        replace: true,
        encType: "application/json",
        action: "/favorite-mw",
        method: "post",
        preventScrollReset: true,
      });
    }
  }
  console.log("render button");
  return (
    <button
      className={`btn btn-${!favoriteState.favorite ? "outline-" : ""}primary btn-sm pull-xs-right `}
      type="button"
      disabled={navigation.state === "submitting"}
      onClick={handleOnSubmit}
    >
      <i className="ion-heart"></i>
      <span className="counter"> {favoriteState.favoritesCount}</span>
    </button>
  );
}
