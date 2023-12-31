import { Link, useLocation } from "@remix-run/react";
import { useContext } from "react";
import { UserContext } from "../auth/auth-provider";

export default function Header() {
  const userSession = useContext(UserContext);
  const { pathname } = useLocation();

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          conduit
        </Link>
        {userSession?.username ? (
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <Link prefetch="intent" className={`nav-link ${pathname == "/" ? "active" : ""}`} to="/" id="home">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link prefetch="intent" className={`nav-link ${pathname == "/editor" ? "active" : ""}`} to="/editor" id="editor">
                <i className="ion-compose"></i>&nbsp;New Article{" "}
              </Link>
            </li>

            <li className="nav-item">
              <Link prefetch="intent" className={`nav-link ${pathname == "/settings" ? "active" : ""}`} to="/settings" id="settings">
                {" "}
                <i className="ion-gear-a"></i>&nbsp;Settings{" "}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                prefetch="intent"
                className={`nav-link ${pathname.includes("/profile") ? "active" : ""}`}
                to={`/profile/${userSession.username}`}
                id="profile"
              >
                {userSession.image && <img width={25} height={25} src={userSession.image} className="user-pic" />}
                {userSession.username}
              </Link>
            </li>
          </ul>
        ) : (
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <Link prefetch="intent" className={`nav-link ${pathname == "/" ? "active" : ""}`} to="/" id="home">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link prefetch="intent" className={`nav-link ${pathname == "/login" ? "active" : ""}`} to="/login" id="login">
                Sign in
              </Link>
            </li>
            <li className="nav-item">
              <Link prefetch="intent" className={`nav-link ${pathname == "/register" ? "active" : ""}`} to="/register" id="register">
                Sign up
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
