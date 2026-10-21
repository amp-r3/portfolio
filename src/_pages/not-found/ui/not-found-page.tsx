import Link from 'next/link';

export function NotFoundPage() {
  return (
    <div className="container page-content">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link href="/">Home</Link>
    </div>
  );
}
