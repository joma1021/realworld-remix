import { Link } from "@remix-run/react";

export default function TagNavbar({ tags }: { tags: string[] }) {
  return (
    <div className="col-md-3">
      <div className="sidebar">
        <p>Popular Tags</p>

        <div className="tag-list">
          {tags.map((tag) => (
            <Link
              prefetch="intent"
              className="tag-pill tag-default"
              style={{ cursor: "pointer" }}
              key={tag}
              to={`/?filter=${tag}&page=${1}`}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
