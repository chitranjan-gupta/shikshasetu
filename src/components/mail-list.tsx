'use client';

import { memo, useCallback, type FC } from 'react';
import { formatDistanceToNow } from 'date-fns';

// import { Badge } from "./ui/badge"
import { ScrollArea } from './ui/scroll-area';

import { cn } from '@/lib';

import type { MailListProps } from '@/types';

const MailListComponent: FC<MailListProps> = ({ items, handleClick }) => {
  const handleItemClick = useCallback(
    (item: (typeof items)[0]) => {
      if (handleClick) {
        handleClick(item);
      }
    },
    [handleClick]
  );
  return (
    <ScrollArea className="h-[80vh]">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
              items[0].id === item.id && 'bg-muted'
            )}
            onClick={() => handleItemClick(item)}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item?.from?.name || ''}</div>
                  {!item?.seen && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div
                  className={cn(
                    'ml-auto text-xs',
                    items[0].id === item.id
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {formatDistanceToNow(
                    new Date(item?.updatedAt || new Date()),
                    {
                      addSuffix: true,
                    }
                  )}
                </div>
              </div>
              <div className="text-xs font-medium">{item?.subject || ''}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {(item?.intro || '').substring(0, 300)}
            </div>
            {/*            {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
*/}{' '}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};

// function getBadgeVariantFromLabel(
//   label: string
// ): ComponentProps<typeof Badge>["variant"] {
//   if (["work"].includes(label.toLowerCase())) {
//     return "default"
//   }

//   if (["personal"].includes(label.toLowerCase())) {
//     return "outline"
//   }

//   return "secondary"
// }

export const MailList = memo(MailListComponent);
