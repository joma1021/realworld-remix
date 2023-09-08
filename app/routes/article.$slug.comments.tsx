import { redirect, type ActionArgs, type LoaderArgs } from "@vercel/remix";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { useContext } from "react";
import { validateInput } from "~/common/helpers";
import { UserContext } from "~/components/auth/auth-provider";
import DefaultError from "~/components/errors/default-error";
import { createComment, deleteComment, getComments } from "~/services/comment-service";
import { getToken } from "~/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const token = await getToken(request);
  const slug = params.slug as string;

  return await getComments(slug, token);
};

export const action = async ({ request, params }: ActionArgs) => {
  const formData = await request.formData();
  const token = await getToken(request);
  const slug = params.slug as string;
  const action = formData.get("action");
  if (action !== "CREATE") {
    const id = action;
    await deleteComment(slug, Number(id), token);
    return redirect(request.url);
  }

  const comment = formData.get("comment");

  if (!validateInput(comment)) {
    return null;
  }

  const response = await createComment(slug, comment as string, token);

  if (!response.ok) {
    return null;
  } else {
    return redirect(request.url);
  }
};

export default function Comments() {
  const comments = useLoaderData<typeof loader>();
  const userSession = useContext(UserContext);
  const navigation = useNavigation();
  return (
    <div className="row">
      <div className="col-xs-12 col-md-8 offset-md-2">
        {userSession.isLoggedIn ? (
          <Form preventScrollReset={true} method="post" className="card comment-form" key={Date()}>
            <div className="card-block">
              <textarea className="form-control" name="comment" placeholder="Write a comment..." rows={3}></textarea>
            </div>
            <div className="card-footer">
              <img src={userSession.image} className="comment-author-img" />
              <button className="btn btn-sm btn-primary" type="submit" name="action" value="CREATE" disabled={navigation.state === "submitting"}>
                Post Comment
              </button>
            </div>
          </Form>
        ) : (
          <div className="row">
            <div className="col-xs-12 col-md-8 offset-md-2">
              <p>
                <Link to="/login">Sign in</Link>
                &nbsp; or &nbsp;
                <Link to="/register">Sign up</Link>
                &nbsp; to add comments on this article.
              </p>
            </div>
          </div>
        )}

        {comments.map((comment) => (
          <div className="card" key={comment.id}>
            <div className="card-block">
              <p className="card-text">{comment.body}</p>
            </div>

            <div className="card-footer">
              <Link to={`/profile/${comment.author.username}/articles`} className="comment-author">
                <img src={comment.author.image} className="comment-author-img" />
              </Link>
              &nbsp;
              <Link to={`/profile/${comment.author.username}/articles`} className="comment-author">
                {comment.author.username}
              </Link>
              <span className="date-posted">{comment.createdAt}</span>
              {comment.author.username == userSession.username && (
                <span className="mod-options">
                  <Form method="post" preventScrollReset={true}>
                    <button type="submit" name="action" value={comment.id} style={{ border: "none", outline: "none", backgroundColor: "transparent" }}>
                      <i className="ion-trash-a"></i>
                    </button>
                  </Form>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <DefaultError />;
}
