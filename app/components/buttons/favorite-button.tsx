import { Form, useNavigation, useSubmit } from "@remix-run/react";
import { useState } from "react";
import type { ArticleData } from "~/models/article";

export function FavoriteButton({ article }: { article: ArticleData }) {
  const navigation = useNavigation();
  return (
    <Form style={{ display: "inline-block" }} method="post" preventScrollReset={true}>
      <button
        className={`btn btn-sm btn-${!article.favorited ? "outline-" : ""}primary `}
        type="submit"
        name="action"
        value={article.favorited ? "UNFAVORITE" : "FAVORITE"}
        disabled={navigation.state === "submitting"}
      >
        <i className="ion-heart"></i>
        &nbsp; {article.favorited ? "Unfavorite" : "Favorite"} Post
        <span className="counter"> ({article.favoritesCount})</span>
      </button>
    </Form>
  );
}

export function FavoriteButtonSmall({ article }: { article: ArticleData }) {
  const submit = useSubmit();
  const navigation = useNavigation();

  const [favorite, setFavorite] = useState(article.favorited);
  const [favoriteCount, setFavoriteCount] = useState(article.favoritesCount);
  function handleOnSubmit() {
    if (favorite) {
      setFavorite(false);
      setFavoriteCount(favoriteCount - 1);
      submit(JSON.stringify({ slug: article.slug, action: "UNFAVORITE" }), {
        replace: true,
        encType: "application/json",
        method: "post",
        action: "/favorite-mw",
        preventScrollReset: true,
      });
    } else {
      setFavorite(true);
      setFavoriteCount(favoriteCount + 1);
      submit(JSON.stringify({ slug: article.slug, action: "FAVORITE" }), {
        replace: true,
        encType: "application/json",
        action: "/favorite-mw",
        method: "post",
        preventScrollReset: true,
      });
    }
  }

  return (
    // <Form className="btn-sm pull-xs-right">
    <button
      className={`btn btn-${!favorite ? "outline-" : ""}primary btn-sm pull-xs-right `}
      type="button"
      disabled={navigation.state === "submitting"}
      onClick={handleOnSubmit}
    >
      <i className="ion-heart"></i>
      <span className="counter"> {favoriteCount}</span>
    </button>
    // </Form>
  );
}
