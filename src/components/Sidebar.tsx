import { NavLink, useLocation } from 'react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  TagChevronIcon,
  UserIcon,
  SquaresFourIcon,
  TreeStructureIcon,
  FilesIcon,
  BookOpenTextIcon,
  ChartBarIcon,
  GearSixIcon,
} from '@phosphor-icons/react';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: SquaresFourIcon,
  },
  {
    title: 'Chart of Accounts',
    url: '/accounts',
    icon: TreeStructureIcon,
  },
  {
    title: 'Journal Entries',
    url: '/journal-entries',
    icon: FilesIcon,
  },
  {
    title: 'General Ledger',
    url: '/general-ledger',
    icon: BookOpenTextIcon,
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: ChartBarIcon,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: GearSixIcon,
  },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  function isActive(url: string) {
    if (url === '/') {
      return pathname === '/';
    }
    return pathname === url || pathname.startsWith(`${url}/`);
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton />}>
                SAM&apos;S LEDGER
                <TagChevronIcon className="ml-auto" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <span>Acme Inc</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Bcme Inc</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Ccme Inc</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<NavLink to={item.url} />}
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <UserIcon /> Username
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
