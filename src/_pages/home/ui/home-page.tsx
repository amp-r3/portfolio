import Link from 'next/link';
import { projectIds } from '@/entities/project';

export function HomePage() {
  return (
    <main>
      <h1>Portfolio</h1>
      <p>The Next.js foundation is ready. The existing interface will be migrated in the next stages.</p>
      <ul>
        {projectIds.map((id) => (
          <li key={id}><Link href={`/project/${id}`}>{id}</Link></li>
        ))}
      </ul>
    </main>
  );
}
