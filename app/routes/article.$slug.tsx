import type { LoaderArgs } from "@remix-run/node";
import { Link, Outlet, isRouteErrorResponse, useLoaderData, useLocation, useRouteError } from "@remix-run/react";
import { useContext } from "react";
import { UserContext } from "~/components/auth/auth-provider";
import { getArticle } from "~/services/article-service";
import { getToken } from "~/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const token = await getToken(request);
  const slug = params.slug ?? "";

  return await getArticle(slug, token);
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
            <button className="btn btn-sm btn-outline-secondary">
              <i className="ion-plus-round"></i>
              &nbsp; Follow {article.author.username} <span className="counter">(10)</span>
            </button>
            &nbsp;&nbsp;
            <button className="btn btn-sm btn-outline-primary">
              <i className="ion-heart"></i>
              &nbsp; Favorite Post <span className="counter">(29)</span>
            </button>
            &nbsp;&nbsp;
            {article.author.username == userSession.username && (
              <>
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="ion-edit"></i> Edit Article
                </button>
                &nbsp;&nbsp;
                <button className="btn btn-sm btn-outline-danger">
                  <i className="ion-trash-a"></i> Delete Article
                </button>
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
            <button className="btn btn-sm btn-outline-secondary">
              <i className="ion-plus-round"></i>
              &nbsp; Follow {article.author.username} <span className="counter">(10)</span>
            </button>
            &nbsp;&nbsp;
            <button className="btn btn-sm btn-outline-primary">
              <i className="ion-heart"></i>
              &nbsp; Favorite Post <span className="counter">(29)</span>
            </button>
            &nbsp;&nbsp;
            {article.author.username == userSession.username && (
              <>
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="ion-edit"></i> Edit Article
                </button>
                &nbsp;&nbsp;
                <button className="btn btn-sm btn-outline-danger">
                  <i className="ion-trash-a"></i> Delete Article
                </button>
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
