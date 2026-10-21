import Link from 'next/link';
import { projectIds } from '@/entities/project';
import { ThemeSwitch } from '@/features/switch-theme';

export function HomePage() {
  return (
    <div className="container page-content">
      <header>
        <ThemeSwitch />
      </header>
      <section id="hero">
        <h1>Amir Ergashev</h1>
        <h2>Portfolio</h2>
      </section>
      <p>The Next.js foundation is ready. The existing interface will be migrated in the next stages.</p>
      <ul>
        {projectIds.map((id) => (
          <li key={id}>
            <Link href={`/project/${id}`}>{id}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
