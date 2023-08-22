import { Form, useNavigation } from "@remix-run/react";
import type { ArticleData } from "~/models/article";
import type { AuthorData } from "~/models/author";

export function FollowButton({ article }: { article: ArticleData }) {
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

export function FollowActionButton({ author }: { author: AuthorData }) {
  const navigation = useNavigation();
  return (
    <Form style={{ display: "inline-block" }} method="post" preventScrollReset={true}>
      <button
        className={`btn btn-sm btn-${!author.following ? "outline-" : ""}secondary action-btn`}
        type="submit"
        name="action"
        value={author.following ? "UNFOLLOW" : "FOLLOW"}
        disabled={navigation.state === "submitting"}
      >
        <i className="ion-plus-round"></i>
        &nbsp; {author.following ? "Unfollow" : "Follow"} {author.username}{" "}
      </button>
    </Form>
  );
}
