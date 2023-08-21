import { Form, useNavigation } from "@remix-run/react";
import type { ArticleData } from "~/models/article";

export default function FollowButton({ article }: { article: ArticleData }) {
  const navigation = useNavigation();
  return (
    <Form
      style={{ display: "inline-block" }}
      method="post"
      preventScrollReset={true}
      action={`/article/${article.slug}/?username=${article.author.username}`}
    >
      <button
        className={`btn btn-sm btn-${!article.author.following ? "outline-" : ""}secondary `}
        type="submit"
        name="action"
        value={article.author.following ? "UNFOLLOW" : "FOLLOW"}
        disabled={navigation.state === "submitting"}
      >
        <i className="ion-plus-round"></i>
        &nbsp; {article.author.following ? "Unfollow" : "Follow"} {article.author.username}{" "}
      </button>
    </Form>
  );
}
