// import getUsers from '../actions/getUsers';

import DesktopSidebar from '@/components/sidebar/DesktopSidebar';
import Sidebar from '@/components/sidebar/Sidebar';

// import UserList from './components/UserList';

export default async function UsersLayout({ children }: { children: React.ReactNode }) {
  // const users = await getUsers();

  return (
    <Sidebar>
      <div className="userlayout h-full">
        <main className="lg:pl-21 h-full">{children}</main>
      </div>
    </Sidebar>
  );
}
