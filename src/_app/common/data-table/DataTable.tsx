import { MatchOperator, SortType } from "@/_app/graphql-models/graphql";
import { Menu, UnstyledButton, rem } from "@mantine/core";
import { IconCsv, IconDownload, IconPdf } from "@tabler/icons-react";
import {
  MRT_ColumnDef,
  MRT_GlobalFilterTextInput,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import React, { useEffect, useState } from "react";

interface Prop {
  columns: MRT_ColumnDef<any>[];
  data: any[];
  refetch: (v: any) => void;
  totalCount: number;
  ActionArea: React.ReactNode;
  loading: boolean;
  onPaginationChange: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
}

const DataTable: React.FC<Prop> = ({
  columns,
  loading,
  data,
  refetch,
  ActionArea,
  totalCount,
}) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 100,
  });
  const [sorting, setSorting] = useState<any[]>([]);
  const [columnFilters, setColumnFilters] = useState<any[]>([]);

  useEffect(() => {
    refetch({
      where: {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sort: sorting[0]?.desc ? SortType.Desc : SortType.Asc,
        filters: columnFilters.length
          ? columnFilters.map((f: any) => ({
              key: f.id,
              operator: MatchOperator.Contains,
              value: f.value,
            }))
          : undefined,
      },
    });

    console.log(columnFilters);
  }, [pagination.pageIndex, pagination.pageSize, sorting, columnFilters]);

  const table = useMantineReactTable({
    columns,
    data,

    state: {
      showProgressBars: loading,
      pagination,
      sorting,
    },
    rowCount: totalCount,

    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,

    enableRowSelection: false,
    enableColumnOrdering: false,
    enableGlobalFilter: true,
    enableRowNumbers: true,

    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,

    paginationDisplayMode: "pages",
    initialState: {
      showGlobalFilter: true,
      density: "xs",
    },
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActionMenuItems: () => <h1>Hello</h1>,
    renderTopToolbar: () => {
      return (
        <div className="flex justify-between p-2">
          <div className="flex items-center gap-1">
            <MRT_GlobalFilterTextInput table={table} />
            <MRT_ToggleFiltersButton table={table} />
            <MRT_ToggleFullScreenButton table={table} />
            <MRT_ShowHideColumnsButton table={table} />
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <IconDownload color="gray" size={20} />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  icon={<IconPdf style={{ width: rem(18), height: rem(18) }} />}
                >
                  Download Pdf
                </Menu.Item>
                <Menu.Item
                  icon={<IconCsv style={{ width: rem(18), height: rem(18) }} />}
                >
                  Download Excel
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
          {ActionArea}
        </div>
      );
    },
  });
  return (
    <>
      {/* <pre>{JSON.stringify(pagination, null, 2)}</pre> */}
      <MantineReactTable table={table} />
    </>
  );
};

export default DataTable;
