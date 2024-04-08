'use client';

import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

const Users = () => {
  return (
    <div className="userpage hidden lg:block lg:pl-80 h-full">
      <EmptyState />
      {/* <Button onClick={() => signOut()}>logout</Button> */}
    </div>
  );
};

export default Users;
