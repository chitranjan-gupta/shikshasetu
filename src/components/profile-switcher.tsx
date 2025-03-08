'use client';

import { memo, useCallback, type FC } from 'react';
import { GalleryVerticalEnd, ChevronsUpDown, Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

import { saveToLocal } from '@/lib';
import { useUser, useAccount, useS3 } from '@/hooks';

const ProfileSwitcherComponent: FC = () => {
  const { profiles } = useUser();
  const { buckets } = useS3();
  const { account, setAccount } = useAccount();
  const handleClick = useCallback(
    async (value: number) => {
      setAccount(value);
      const naya = profiles[value >= profiles?.length ? 0 : value];
      await saveToLocal({ currentAutofill: naya, currentDocument: buckets });
    },
    [setAccount, profiles, buckets]
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex flex-row p-1 gap-x-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {profiles[account]?.email || 'Create Profile'}
            </span>
            <span className="truncate text-xs">
              {profiles[account]?.first_name || ''}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Profiles
        </DropdownMenuLabel>
        {profiles.map((profile, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => handleClick(index)}
            className="gap-2 p-2"
          >
            <div className="flex size-6 items-center justify-center rounded-sm border">
              <GalleryVerticalEnd className="size-4 shrink-0" />
            </div>
            {profile?.email || ''}
            <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 p-2"
          onClick={() => handleClick(profiles?.length || 1)}
        >
          <div className="flex size-6 items-center justify-center rounded-md border bg-background">
            <Plus className="size-4" />
          </div>
          <div className="font-medium text-muted-foreground">Add Profile</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const ProfileSwitcher = memo(ProfileSwitcherComponent);
