import Link from 'next/link';
import type { ProjectId } from '@/entities/project';

export function ProjectPage({ id }: { id: ProjectId }) {
  return (
    <main>
      <h1>Project: {id}</h1>
      <Link href="/">Home</Link>
    </main>
  );
}
