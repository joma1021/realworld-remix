import { Link, isRouteErrorResponse, useLocation, useRouteError } from "@remix-run/react";

export default function DefaultError() {
  const error = useRouteError();
  const { pathname, search } = useLocation();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="container page">
        <div>
          Error: {error.status} {error.statusText}
        </div>
        <Link to={pathname + search}>{"Please retry"}</Link>
      </div>
    );
  }

  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  return (
    <div className="container page">
      <div>Error: {errorMessage}</div>
      <Link to={pathname + search}>{"Please retry"}</Link>
    </div>
  );
}
