import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { logout } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => logout(request);

export const loader = async () => redirect("/");
