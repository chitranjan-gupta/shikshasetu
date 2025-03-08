'use client';

import { ColumnDef } from '@tanstack/react-table';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { CirclePlus, Trash2, MoreHorizontal } from 'lucide-react';

import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { DataTable } from './data-table';

import { generateRandomString } from '@/lib';

import type { FormSchemaType, Pickup } from '@/types';

export const PickupInput = ({
  form,
}: {
  form: UseFormReturn<FormSchemaType>;
}) => {
  const field_types = ['text', 'select', 'radio'];
  const search_types = ['name', 'id', 'class'];

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'custom_fields',
  });

  const columns: ColumnDef<Pickup>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          name="select-all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          name="select-row"
        />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'field_type',
      header: 'Field Type',
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`custom_fields.${row.index}.field_type`}
          key={fields[row.index].id}
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Field Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Field Type</SelectLabel>
                    {field_types.map((field_) => (
                      <SelectItem key={field_} value={field_}>
                        {field_}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        // <Select name="field_type" onValueChange={(v) => { setData((prev) => [...(prev.filter((d) => d.id !== row.original.id)), { ...row.original, field_type: v }]) }} defaultValue={row.getValue("field_type")}>
        //   <SelectTrigger className="w-[180px]">
        //     <SelectValue placeholder="Select a Field Type" />
        //   </SelectTrigger>
        //   <SelectContent>
        //     <SelectGroup>
        //       <SelectLabel>Field Type</SelectLabel>
        //       {options.map((field) => <SelectItem key={field} value={field}>{field}</SelectItem>)}
        //     </SelectGroup>
        //   </SelectContent>
        // </Select>
      ),
    },
    {
      accessorKey: 'search_type',
      header: 'Search Type',
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`custom_fields.${row.index}.search_type`}
          key={fields[row.index].id}
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Search Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Search Type</SelectLabel>
                    {search_types.map((search) => (
                      <SelectItem key={search} value={search}>
                        {search}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        // <Select name="search_type" onValueChange={(v) => { setData((prev) => [...(prev.filter((d) => d.id !== row.original.id)), { ...row.original, search_type: v }]) }} defaultValue={row.getValue("search_type")}>
        //   <SelectTrigger className="w-[180px]">
        //     <SelectValue placeholder="Select a Search Type" />
        //   </SelectTrigger>
        //   <SelectContent>
        //     <SelectGroup>
        //       <SelectLabel>Search Type</SelectLabel>
        //       {options.map((search) => <SelectItem key={search} value={search}>{search}</SelectItem>)}
        //     </SelectGroup>
        //   </SelectContent>
        // </Select>
      ),
    },
    {
      accessorKey: 'selector',
      header: 'Selector',
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`custom_fields.${row.index}.selector`}
          key={fields[row.index].id}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  value={
                    (field.value.length > 0 ? field.value : false) ||
                    form.getValues(`custom_fields.${row.index}.attribute_name`)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        // <Input name="selector" value={row.getValue("selector")} onChange={(event) => { setData((prev) => [...(prev.filter((d) => d.id !== row.original.id)), { ...row.original, selector: event.target.value }]) }} />
      ),
    },
    {
      accessorKey: 'attribute_name',
      header: 'Attribute Name',
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`custom_fields.${row.index}.attribute_name`}
          key={fields[row.index].id}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex flex-row">
                  <Input {...field} />
                  <span className="text-red-500 font-black">*</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        // <Input name="attribute_name" value={row.getValue("attribute_name")} onChange={(event) => { setData((prev) => [...(prev.filter((d) => d.id !== row.original.id)), { ...row.original, attribute_name: event.target.value }]) }} />
      ),
    },
    {
      accessorKey: 'value',
      header: 'Value',
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`custom_fields.${row.index}.value`}
          key={fields[row.index].id}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex flex-row">
                  <Input {...field} />
                  <span className="text-red-500 font-black">*</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        // <Input name="value" value={row.getValue("value")} onChange={(event) => { setData((prev) => [...(prev.filter((d) => d.id !== row.original.id)), { ...row.original, value: event.target.value }]) }} />
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => remove(row.index)}>
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <div className="container mx-auto py-10">
      <div>
        <Button
          type="button"
          onClick={() => {
            append({
              id: generateRandomString(6),
              field_type: 'text',
              search_type: 'name',
              selector: '',
              attribute_name: '',
              value: '',
            });
          }}
        >
          <CirclePlus />
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={form.getValues('custom_fields') || []}
      />
    </div>
  );
};
