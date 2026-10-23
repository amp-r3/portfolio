import type { MetadataRoute } from 'next';
import { projectIds } from '@/entities/project';
import { routing } from '@/shared/i18n';

const siteUrl = 'https://amp3re.netlify.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    routes.push({
      url: `${siteUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${siteUrl}/${l}`])),
      },
    });

    for (const id of projectIds) {
      routes.push({
        url: `${siteUrl}/${locale}/project/${id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${siteUrl}/${l}/project/${id}`])
          ),
        },
      });
    }
  }

  return routes;
}
