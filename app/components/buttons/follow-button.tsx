import { Form, useNavigation } from "@remix-run/react";
import type { AuthorData } from "~/models/author";

export function FollowButton({ following, username }: { following: boolean; username: string }) {
  const navigation = useNavigation();
  return (
    <Form style={{ display: "inline-block" }} method="post" preventScrollReset={true}>
      <button
        className={`btn btn-sm btn-${!following ? "outline-" : ""}secondary `}
        type="submit"
        name="action"
        value={following ? `UNFOLLOW,${username}` : `FOLLOW,${username}`}
        disabled={navigation.state === "submitting"}
      >
        <i className="ion-plus-round"></i>
        &nbsp; {following ? "Unfollow" : "Follow"} {username}{" "}
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
