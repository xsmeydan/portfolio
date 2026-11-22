import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] pt-32 pb-16 px-6 flex flex-col items-center justify-center text-center">
      <title>Page not found | Sudenur Meydan</title>
      <meta name="robots" content="noindex" />

      <p className="font-label-mono text-label-mono text-secondary-container uppercase tracking-widest mb-4">
        404
      </p>
      <h1 className="font-headline-md text-headline-md text-primary mb-6">
        This page doesn&apos;t exist.
      </h1>
      <Link
        to="/"
        className="bg-primary-container text-on-primary-container font-label-mono text-label-mono px-6 py-3 rounded-full cursor-hover"
      >
        Back home
      </Link>
    </div>
  );
}
