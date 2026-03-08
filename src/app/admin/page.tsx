
"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectAdmin() {
  const router = useRouter();
  useEffect(() => {
    router.push('/dash-admin');
  }, [router]);
  return null;
}
