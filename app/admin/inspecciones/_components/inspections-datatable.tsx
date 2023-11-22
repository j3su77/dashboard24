"use client";
import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function InspectionsDataTable<TData, TValue>({
  columns: columnsAll,
  data,
}: DataTableProps<TData, TValue>) {
  const { data: session } = useSession();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [itemFilter, setItemFilter] = useState("city");

  const columns = columnsAll.filter((column) => {
    return !(session && session?.user.role !== "ADMIN" && column.id === "actions");
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const handleFilterItem = (e: string) => {
    table.getColumn(itemFilter)?.setFilterValue("");
    setItemFilter(e);
  };
  
  const handleFiltering = (e:  ChangeEvent<HTMLInputElement>) => {
      table.getColumn(itemFilter)?.setFilterValue(e.target.value);
  };

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div className="flex gap-2">
          <Input
            placeholder={`Buscar`}
            value={
              (table.getColumn(itemFilter)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
             handleFiltering(event)
            }
            className="min-w-[300px]"
          />

          <Select value={itemFilter} onValueChange={(e) => handleFilterItem(e)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectGroup>
              
                <SelectItem value="city">Ciudad</SelectItem>
                <SelectItem value="date">fecha de ejecución</SelectItem>
                <SelectItem value="isExecuted">Estado</SelectItem> 
              </SelectGroup>
            </SelectContent>
          </Select>

        </div>
          {session && session.user.role === "ADMIN" && (
                <Link href="/admin/inspecciones/crear">
                <Button>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Agregar Inspección
                </Button>
              </Link>
        )}

      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
