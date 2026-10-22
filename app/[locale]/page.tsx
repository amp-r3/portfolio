import { HomePage } from '@/_pages/home';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <HomePage locale={locale} />;
}
