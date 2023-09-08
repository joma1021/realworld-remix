import { Form, useNavigation } from "@remix-run/react";
import { useState } from "react";

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

  const [favoriteState, setFavoriteState] = useState({
    favorite: favorite,
    favoritesCount: favoritesCount,
  });

  function handleOnSubmit() {
    // NOTE: Optimistic UI -> update state directly without waiting for any response
    if (favoriteState.favorite) {
      setFavoriteState({ favorite: false, favoritesCount: favoriteState.favoritesCount - 1 });
    } else {
      setFavoriteState({ favorite: true, favoritesCount: favoriteState.favoritesCount + 1 });
    }
  }

  return (
    <Form className="pull-xs-right" method="post" preventScrollReset={true} onSubmit={handleOnSubmit}>
      <button
        className={`btn btn-${!favoriteState.favorite ? "outline-" : ""}primary btn-sm pull-xs-right`}
        type="submit"
        disabled={navigation.state === "submitting"}
        name="action"
        value={favoriteState.favorite ? `UNFAVORITE,${slug}` : `FAVORITE,${slug}`}
      >
        <i className="ion-heart"></i>
        <span className="counter"> {favoriteState.favoritesCount}</span>
      </button>
    </Form>
  );
}
