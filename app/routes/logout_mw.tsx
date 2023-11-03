import type { ActionFunctionArgs } from "@vercel/remix";
import { redirect } from "@vercel/remix";

import { logout } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => logout(request);

export const loader = async () => redirect("/");
