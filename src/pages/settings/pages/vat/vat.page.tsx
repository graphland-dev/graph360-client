import { Button, Drawer, Menu } from "@mantine/core";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import VatForm from "./components/VatForm";
import DataTable from "@/_app/common/data-table/DataTable";
import { useSetState } from "@mantine/hooks";
import { useMutation, useQuery } from "@apollo/client";
import {useMemo} from "react";
import { SETTINGS_VAT_QUERY, SETTING_VAT_REMOVE_MUTATION } from "./utils/query";
import { MatchOperator, Vat, VatsWithPagination } from "@/_app/graphql-models/graphql";
import { MRT_ColumnDef } from "mantine-react-table";
import dayjs from "dayjs";
import { confirmModal } from "@/_app/common/confirm/confirm";

interface IState {
  modalOpened: boolean;
  operationType: "create" | "update";
  operationId?: string | null;
  operationPayload?: any;
  refetching: boolean;
}

const VatPage = () => {
  const [state, setState] = useSetState<IState>({
    modalOpened: false,
    operationType: "create",
    operationId: null,
    operationPayload: {},
    refetching: false,
  });

  const { data, loading, refetch } = useQuery<{ setup__vats: VatsWithPagination }>(SETTINGS_VAT_QUERY, {
    variables: {
        where: { limit: -1 },
      },
  }) 

  const [deleteVatMutation] = useMutation(
    SETTING_VAT_REMOVE_MUTATION
  );

   const handleDeleteVat = (_id: string) => {
    confirmModal({
      title: "Sure to delete?",
      description: "Be careful!! Once you deleted, it can not be undone",
      isDangerous: true,
      onConfirm() {
        deleteVatMutation({
          variables: {
            where: { key: "_id", operator: MatchOperator.Eq, value: _id },
          },
          onCompleted: () => handleRefetch({}),
          onError: (error) => console.log({ error }),
        });
      },
    });
  };
  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetch();
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorFn: (row: Vat) =>(row?._id),
        accessorKey: "id",
        header: "Id",
      },
      
      {
        accessorFn: (row: Vat) =>
          dayjs(row?.createdAt)?.format("MMMM D, YYYY h:mm A"),
        accessorKey: "createdAt",
        header: "Created Date",
      },
      {
        accessorFn: (row: Vat) =>
          dayjs(row?.updatedAt)?.format("MMMM D, YYYY h:mm A"),
        accessorKey: "updatedAt",
        header: "Update Date",
      },
      
    ],
    []
  );

  return  <>
  <Drawer
    opened={state.modalOpened}
    onClose={() => setState({ modalOpened: false })}
    position="right"
    size={"md"}
  >
    <VatForm
      onSubmissionDone={() => {
        handleRefetch({});
        setState({ modalOpened: false });
      }}
      
      operationType={state.operationType}
      operationId={state.operationId}
      formData={state.operationPayload}
    />
  </Drawer>
  <DataTable
    columns={columns}
    data={data?.setup__vats?.nodes ?? []}
    refetch={handleRefetch}
    totalCount={data?.setup__vats?.meta?.totalCount ?? 10}
    RowActionMenu={(row: Vat) => (
      <>
        <Menu.Item
          onClick={() =>
            setState({
              modalOpened: true,
              operationType: "update",
              operationId: row._id,
              operationPayload: row,
            })
          }
          icon={<IconPencil size={18} />}
        >
          Edit
        </Menu.Item>
        <Menu.Item
          onClick={() => handleDeleteVat(row._id)}
          icon={<IconTrash size={18} />}
        >
          Delete
        </Menu.Item>
       
      </>
    )}
    ActionArea={
      <>
        <Button
          leftIcon={<IconPlus size={16} />}
          onClick={() =>
            setState({ modalOpened: true, operationPayload: "create" })
          }
          size="sm"
        >
          Add new
        </Button>
      </>
    }
    loading={loading || state.refetching}
  />
</>;
};

export default VatPage;
