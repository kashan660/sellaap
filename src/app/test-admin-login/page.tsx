'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TestAdminLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
    
    if (status === 'authenticated') {
      if (session?.user?.role === 'ADMIN') {
        console.log('Admin user detected, redirecting to admin dashboard...');
        router.push('/admin');
      } else {
        console.log('Regular user detected, redirecting to profile...');
        router.push('/profile');
      }
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Checking Session...</h1>
          <p>Please wait while we verify your login status.</p>
        </div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Login Successful!</h1>
          <p className="mb-2">User: {session.user?.email}</p>
          <p className="mb-2">Role: {session.user?.role}</p>
          <p className="mb-4">Redirecting to admin dashboard...</p>
          <button 
            onClick={() => router.push('/admin')}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Go to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Not Logged In</h1>
        <p className="mb-4">Please log in to access the admin dashboard.</p>
        <button 
          onClick={() => router.push('/auth/signin?callbackUrl=/auth/check-role')}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}