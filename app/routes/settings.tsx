import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { validateInput } from "~/common/helpers";
import DefaultError from "~/components/errors/default-error";
import FormError from "~/components/errors/form-error";
import type { UpdateUser } from "~/models/user";
import { getCurrentUser, updateUser } from "~/services/auth-service";
import { createUserSession, getToken } from "~/session.server";

export const meta: MetaFunction = () => {
  return [{ title: "Conduit - Settings" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getToken(request);

  return await getCurrentUser(token);
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const token = await getToken(request);
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");
  const image = formData.get("image");
  const bio = formData.get("bio");

  if (!validateInput(email)) {
    return json({ errors: { "": ["email can't be blank"] } }, { status: 400 });
  }

  if (!validateInput(image)) {
    return json({ errors: { "": ["image can't be blank"] } }, { status: 400 });
  }

  if (!validateInput(username)) {
    return json({ errors: { "": ["username can't be blank"] } }, { status: 400 });
  }
  const user: UpdateUser = {
    username: username as string,
    image: image as string,
    email: email as string,
  };

  if (validateInput(bio)) user.bio = bio as string;
  if (validateInput(password)) user.password = password as string;

  const response = await updateUser(user, token);
  const data = await response.json();

  if (!response.ok) {
    return json({ errors: { "": ["unknown error"] } }, { status: 400 });
  } else {
    return createUserSession({
      request: request,
      username: data.user.username,
      authToken: data.user.token,
      image: data.user.image,
      redirectTo: "/",
    });
  }
};

export default function Settings() {
  const user = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            {actionData?.errors && <FormError errors={actionData.errors} />}

            <Form method="post">
              <fieldset>
                <fieldset className="form-group">
                  <input className="form-control" type="text" name="image" defaultValue={user.image} placeholder="URL of profile picture" />
                </fieldset>
                <fieldset className="form-group">
                  <input className="form-control form-control-lg" type="text" name="username" defaultValue={user.username} placeholder="Your Name" />
                </fieldset>
                <fieldset className="form-group">
                  <textarea className="form-control form-control-lg" name="bio" defaultValue={user.bio} rows={8} placeholder="Short bio about you"></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input className="form-control form-control-lg" type="text" name="email" defaultValue={user.email} placeholder="Email" />
                </fieldset>
                <fieldset className="form-group">
                  <input className="form-control form-control-lg" type="password" name="password" placeholder="New Password" />
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right" type="submit" disabled={navigation.state === "submitting"}>
                  Update Settings
                </button>
              </fieldset>
            </Form>
            <hr />
            <Form action="/logout_mw" method="post">
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
