'use client';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/context/AuthContext';

import { redirect } from 'next/navigation';

export default function ProfilePage() {
  const { loggedIn, setLoggedIn, setUser } = useAuth();
  if (!loggedIn) redirect('/login');
  return (
    <div className="w-full flex flex-col gap-[20px]">
      <NavBar />
      profile
    </div>
  );
}
