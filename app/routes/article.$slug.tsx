import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { Link, Outlet, isRouteErrorResponse, useLoaderData, useLocation, useRouteError } from "@remix-run/react";
import { useContext } from "react";
import { UserContext } from "~/components/auth/auth-provider";
import DeleteButton from "~/components/buttons/delete-button";
import EditButton from "~/components/buttons/edit-button";
import FavoriteButton from "~/components/buttons/favorite-button";
import FollowButton from "~/components/buttons/follow-button";
import { deleteArticle, favoriteArticle, getArticle, unfavoriteArticle } from "~/services/article-service";
import { followUser, unfollowUser } from "~/services/profile-service";
import { getToken } from "~/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const token = await getToken(request);
  const slug = params.slug ?? "";

  return await getArticle(slug, token);
};

export const action = async ({ request, params }: ActionArgs) => {
  const formData = await request.formData();
  const token = await getToken(request);
  const slug = params.slug ?? "";
  const action = formData.get("action");
  switch (action) {
    case "EDIT": {
      return redirect(`edit/${slug}`);
    }
    case "DELETE": {
      await deleteArticle(slug, token);
      return redirect("/");
    }
    case "FOLLOW": {
      const url = new URL(request.url);
      const username = url.searchParams.get("username")?.toString();
      console.log(username);
      if (username) await followUser(username, token);
      return redirect(request.url + "/comments");
    }
    case "UNFOLLOW": {
      const url = new URL(request.url);
      const username = url.searchParams.get("username")?.toString();
      console.log(username);
      if (username) await unfollowUser(username, token);
      return redirect(request.url + "/comments");
    }
    case "FAVORITE": {
      await favoriteArticle(slug, token);
      return redirect(request.url + "/comments");
    }
    case "UNFAVORITE": {
      await unfavoriteArticle(slug, token);
      return redirect(request.url + "/comments");
    }
    default: {
      return null;
    }
  }
};

export default function ArticleView() {
  const article = useLoaderData<typeof loader>();
  const userSession = useContext(UserContext);
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
                <FollowButton article={article} />
                &nbsp;&nbsp;
                <FavoriteButton article={article} />
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
                <FollowButton article={article} />
                &nbsp;&nbsp;
                <FavoriteButton article={article} />
              </>
            )}
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const { pathname, search } = useLocation();

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <div>
          Error: {error.status} {error.statusText}
        </div>
        <Link to={pathname + search}>{"Please retry"}</Link>
      </>
    );
  }

  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  return (
    <>
      <div>Error: {errorMessage}</div>
      <Link to={pathname + search}>{"Please retry"}</Link>
    </>
  );
}
