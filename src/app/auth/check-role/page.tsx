'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCheckRole() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('AuthCheckRole - Session status:', status);
    console.log('AuthCheckRole - Session data:', session);
    
    if (status === 'authenticated') {
      if (session?.user?.role === 'ADMIN') {
        console.log('Admin user detected, redirecting to admin dashboard...');
        router.push('/admin');
      } else {
        console.log('Regular user detected, redirecting to profile...');
        router.push('/profile');
      }
    } else if (status === 'unauthenticated') {
      console.log('User not authenticated, redirecting to login...');
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Checking Authentication...</h1>
          <p>Please wait while we verify your login status.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p>Please wait while we redirect you to the appropriate page.</p>
      </div>
    </div>
  );
}