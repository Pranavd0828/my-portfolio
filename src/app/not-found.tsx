import Link from "next/link";
export default function NotFound() {
  return (
    <main className="shell section-space min-h-[65vh]">
      <p className="eyebrow">404 / Page not found</p>
      <h1 className="section-heading mt-6">
        Let us get you
        <br />
        back to the work.
      </h1>
      <p className="body-copy mt-6">
        This address does not match a page on the site.
      </p>
      <div className="hero-actions">
        <Link prefetch={false} href="/work" className="button button-primary">
          Explore the work
        </Link>
        <Link prefetch={false} href="/" className="button">
          Home
        </Link>
      </div>
    </main>
  );
}
