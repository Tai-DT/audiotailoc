import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginRedirectPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectParam = params.redirect;
  const redirectUrl = redirectParam 
    ? `/auth/login?redirect=${encodeURIComponent(redirectParam)}`
    : '/auth/login';
  
  redirect(redirectUrl);
}
