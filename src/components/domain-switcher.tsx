'use client';

import { useState, type FC } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

import { cn } from '@/lib';

import type { Domain } from '@/types';

interface DomainSwitcherProps {
  isCollapsed: boolean;
  domains: Domain[];
}

export const DomainSwitcher: FC<DomainSwitcherProps> = ({
  isCollapsed,
  domains,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>(
    domains[0]?.domain || ''
  );

  return (
    <Select defaultValue={selectedDomain} onValueChange={setSelectedDomain}>
      <SelectTrigger
        className={cn(
          'flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0',
          isCollapsed &&
            'flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden'
        )}
        aria-label="Select domain"
      >
        <SelectValue placeholder="Select an domain">
          <span className={cn('ml-2', isCollapsed && 'hidden')}>
            {domains.find((domain) => domain.domain === selectedDomain)?.domain}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {domains.map((domain) => (
          <SelectItem key={domain.domain} value={domain.domain}>
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              {domain.domain}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
