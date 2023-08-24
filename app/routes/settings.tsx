import type { V2_MetaFunction, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import DefaultError from "~/components/errors/default-error";
import { getCurrentUser } from "~/services/auth-service";
import { getToken } from "~/session.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Conduit - Settings" }];
};

export async function loader({ request }: LoaderArgs) {
  const token = await getToken(request);
  // protect route
  if (!token) throw redirect("/register");

  return await getCurrentUser(token);
}

export default function Settings() {
  const user = useLoaderData<typeof loader>();
  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            <ul className="error-messages">
              <li>Update not implemented yet</li>
            </ul>

            <form>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    name="image"
                    defaultValue={user.image}
                    placeholder="URL of profile picture"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    name="username"
                    defaultValue={user.username}
                    placeholder="Your Name"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    name="bio"
                    defaultValue={user.bio}
                    rows={8}
                    placeholder="Short bio about you"
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    name="email"
                    defaultValue={user.email}
                    placeholder="Email"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    name="password"
                    placeholder="New Password"
                  />
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right">Update Settings</button>
              </fieldset>
            </form>
            <hr />
            <Form action="/logout-mw" method="post">
              <button className="btn btn-outline-danger">Or click here to logout.</button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <DefaultError />;
}
