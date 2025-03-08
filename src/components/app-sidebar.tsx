'use client';

import { type ComponentProps, type FC, memo } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from './ui/sidebar';

import { NavUser } from './nav-user';
import { TeamSwitcher } from './team-switcher';

const AppSidebarComponent: FC<ComponentProps<typeof Sidebar>> = ({
  ...props
}) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent></SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export const AppSidebar = memo(AppSidebarComponent);
