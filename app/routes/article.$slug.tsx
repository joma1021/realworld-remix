import { redirect } from "@remix-run/node";
import type { MetaFunction, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { useContext } from "react";
import { validateInput } from "~/common/helpers";
import { UserContext } from "~/components/auth/auth-provider";
import DeleteButton from "~/components/buttons/delete-button";
import EditButton from "~/components/buttons/edit-button";
import { FavoriteButton } from "~/components/buttons/favorite-button";
import { FollowButton } from "~/components/buttons/follow-button";
import DefaultError from "~/components/errors/default-error";
import { deleteArticle, favoriteArticle, getArticle, unfavoriteArticle } from "~/services/article-service";
import { createComment, deleteComment, getComments } from "~/services/comment-service";
import { followUser, unfollowUser } from "~/services/profile-service";
import { getToken } from "~/session.server";

export const meta: MetaFunction = () => {
  return [{ title: "Conduit - Article" }];
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  const slug = params.slug ?? "";

  const [article, comments] = await Promise.all([getArticle(slug, token), getComments(slug, token)]);

  return { article, comments };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const token = await getToken(request);

  if (!token) {
    return redirect("/register");
  }

  const slug = params.slug ?? "";
  const formData = await request.formData();
  const action = (formData.get("action")?.toString() ?? "").split(",");

  switch (action[0]) {
    case "EDIT": {
      return redirect(`/editor/${slug}`);
    }
    case "DELETE": {
      await deleteArticle(slug, token);
      return redirect("/");
    }
    case "FAVORITE": {
      await favoriteArticle(slug, token);
      return null;
    }
    case "UNFAVORITE": {
      await unfavoriteArticle(slug, token);
      return null;
    }
    case "CREATE": {
      const comment = formData.get("comment")?.toString() ?? "";
      if (validateInput(comment)) {
        await createComment(slug, comment, token);
        return null;
      }
    }
    case "DELETECOMMENT": {
      const id = action[1];
      return await deleteComment(slug, Number(id), token);
    }
    case "FOLLOW": {
      const username = action[1];
      await followUser(username, token);
      return null;
    }
    case "UNFOLLOW": {
      const username = action[1];
      await unfollowUser(username, token);
      return null;
    }
    default: {
      return null;
    }
  }
};

export default function ArticleView() {
  const { article, comments } = useLoaderData<typeof loader>();
  const userSession = useContext(UserContext);
  const navigation = useNavigation();
  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>

          <div className="article-meta">
            <Link prefetch="intent" to={`/profile/${article.author.username}`}>
              <img src={article.author.image} />
            </Link>

            <div className="info">
              <Link prefetch="intent" to={`/profile/${article.author.username}`} className="author">
                {article.author.username}
              </Link>
              <span className="date">{article.createdAt}</span>
            </div>

            {article.author.username == userSession.username ? (
              <>
                <EditButton />
                &nbsp;&nbsp;
                <DeleteButton />
              </>
            ) : (
              <>
                <FollowButton following={article.author.following} username={article.author.username} />
                &nbsp;&nbsp;
                <FavoriteButton favorite={article.favorited} favoritesCount={article.favoritesCount} />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <ul className="tag-list">
              <p>{article.body}</p>
              {article.tagList.map((tag) => (
                <li className="tag-default tag-pill tag-outline" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <div className="article-meta">
            <Link prefetch="intent" to={`/profile/${article.author.username}`}>
              <img src={article.author.image} />
            </Link>
            <div className="info">
              <Link prefetch="intent" to={`/profile/${article.author.username}`} className="author">
                {article.author.username}
              </Link>
              <span className="date">{article.createdAt}</span>
            </div>
            {article.author.username == userSession.username ? (
              <>
                <EditButton />
                &nbsp;&nbsp;
                <DeleteButton />
              </>
            ) : (
              <>
                <FollowButton following={article.author.following} username={article.author.username} />
                &nbsp;&nbsp;
                <FavoriteButton favorite={article.favorited} favoritesCount={article.favoritesCount} />
              </>
            )}
          </div>
        </div>
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
                  <Link to={`/profile/${comment.author.username}`} className="comment-author">
                    <img src={comment.author.image} className="comment-author-img" />
                  </Link>
                  &nbsp;
                  <Link to={`/profile/${comment.author.username}`} className="comment-author">
                    {comment.author.username}
                  </Link>
                  <span className="date-posted">{comment.createdAt}</span>
                  {comment.author.username == userSession.username && (
                    <span className="mod-options">
                      <Form method="post" preventScrollReset={true}>
                        <button
                          type="submit"
                          name="action"
                          value={"DELETECOMMENT," + comment.id}
                          style={{ border: "none", outline: "none", backgroundColor: "transparent" }}
                        >
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
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <DefaultError />;
}
