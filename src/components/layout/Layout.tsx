import { Outlet } from 'react-router'
import { AppSidebar } from '../Sidebar'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'

export function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <main>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}