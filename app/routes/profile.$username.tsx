import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { Link, Outlet, isRouteErrorResponse, useLoaderData, useLocation, useRouteError } from "@remix-run/react";
import { useContext } from "react";
import { UserContext } from "~/components/auth/auth-provider";
import { FollowActionButton } from "~/components/buttons/follow-button";
import { followUser, getProfile, unfollowUser } from "~/services/profile-service";
import { getToken } from "~/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const token = await getToken(request);
  const username = params.username as string;

  return await getProfile(username, token);
};

export const action = async ({ request, params }: ActionArgs) => {
  const token = await getToken(request);

  if (!token) {
    return redirect("/register");
  }

  const formData = await request.formData();
  const username = params.username as string;
  const action = formData.get("action");
  switch (action) {
    case "FOLLOW": {
      await followUser(username, token);
      return redirect(request.url + "/articles");
    }
    case "UNFOLLOW": {
      await unfollowUser(username, token);
      return redirect(request.url + "/articles");
    }

    default: {
      return null;
    }
  }
};

export default function Profile() {
  const profile = useLoaderData<typeof loader>();
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

      <Outlet />
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
