import { Form, useNavigation } from "@remix-run/react";
import type { ArticleData } from "~/models/article";

export default function FavoriteButton({ article }: { article: ArticleData }) {
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
