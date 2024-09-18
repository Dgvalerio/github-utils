'use client';

import { FC, useState } from 'react';

import { FormProps } from '@/components/form/form';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/tailwind/utils';

import { CheckIcon, ChevronDown } from 'lucide-react';

export const Combobox: FC<
  Pick<
    FormProps.Combobox<NonNullable<unknown>>,
    'label' | 'containerClassName' | 'loading' | 'placeholder' | 'items'
  > & { handleSelect(name: string): void }
> = ({ containerClassName, loading, placeholder, items, handleSelect }) => {
  const [value, setValue] = useState<string>();

  const selectHandler = (name: string): void => {
    setValue(name);
    handleSelect(name);
  };

  if (loading)
    return (
      <Skeleton
        className={cn(
          'flex h-10 w-full cursor-not-allowed rounded-md',
          containerClassName
        )}
      />
    );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            'justify-between',
            !value && 'text-muted-foreground',
            containerClassName
          )}
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'p-0',
          'w-full min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)]'
        )}
      >
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>Sem itens</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  value={item.label}
                  key={item.value}
                  onSelect={selectHandler.bind(null, item.value)}
                >
                  {item.label}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      item.value === value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
