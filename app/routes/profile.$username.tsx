import type { MetaFunction, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, isRouteErrorResponse, useLoaderData, useLocation, useRouteError } from "@remix-run/react";
import { useContext } from "react";
import { ArticlePreview } from "~/components/article/article-preview";
import { UserContext } from "~/components/auth/auth-provider";
import { FollowActionButton } from "~/components/buttons/follow-button";
import type { ArticleData } from "~/models/article";
import { getProfileArticles } from "~/services/article-service";
import { followUser, getProfile, unfollowUser } from "~/services/profile-service";
import { getToken } from "~/session.server";

export const meta: MetaFunction = () => {
  return [{ title: "Conduit - Profile" }];
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  const username = params.username as string;
  const url = new URL(request.url);
  const currentPageNumber = Number(url.searchParams.get("page") ?? "1");
  const filter = url.searchParams.get("filter") ?? "my";

  const [profile, profileArticles] = await Promise.all([getProfile(username, token), getProfileArticles(username, filter, token, currentPageNumber)]);

  return { profile, profileArticles, filter, currentPageNumber };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const token = await getToken(request);

  if (!token) {
    return redirect("/register");
  }

  const formData = await request.formData();
  const username = params.username as string;
  const action = (formData.get("action") as string).split(",");
  switch (action[0]) {
    case "FOLLOW": {
      await followUser(username, token);
      return null;
    }
    case "UNFOLLOW": {
      await unfollowUser(username, token);
      return null;
    }
    default: {
      return null;
    }
  }
};

export default function Profile() {
  const { profile, profileArticles, filter, currentPageNumber } = useLoaderData<typeof loader>();
  const userSession = useContext(UserContext);

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src={profile.image} className="user-img" />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>

              {profile.username == userSession.username ? (
                <Link className="btn btn-sm btn-outline-secondary action-btn" to={"/settings"}>
                  <i className="ion-gear-a"></i>
                  &nbsp; Edit Profile Settings
                </Link>
              ) : (
                <FollowActionButton author={profile} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <Link prefetch="intent" className={`nav-link ${filter === "my" ? "active" : ""}`} to="?filter=my">
                    My Articles
                  </Link>
                </li>
                <li className="nav-item">
                  <Link prefetch="intent" className={`nav-link ${filter === "fav" ? "active" : ""}`} to="?filter=fav">
                    Favorited Articles
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              {profileArticles.articles.length == 0 ? (
                <div>No articles are here... yet.</div>
              ) : (
                <ul>
                  {(profileArticles.articles as ArticleData[]).map((article) => (
                    <ArticlePreview article={article} key={article.slug} />
                  ))}
                </ul>
              )}
            </div>

            <ul className="pagination">
              {Array(Math.ceil(profileArticles.articlesCount / 5))
                .fill(null)
                .map((_, i) => (
                  <li className={`page-item  ${i == currentPageNumber - 1 ? "active" : ""}`} key={i}>
                    <Link prefetch="intent" className="page-link" style={{ cursor: "pointer" }} to={`?filter=${filter}&page=${i + 1}`}>
                      {i + 1}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
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
