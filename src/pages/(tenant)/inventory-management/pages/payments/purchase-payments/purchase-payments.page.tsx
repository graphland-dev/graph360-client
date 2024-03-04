import PageTitle from "@/_app/common/PageTitle";
import DataTable from "@/_app/common/data-table/DataTable";
import {
  PurchasePayment,
  PurchasePaymentsWithPagination,
} from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import { Button, Drawer, Menu } from "@mantine/core";
import { useDisclosure, useSetState } from "@mantine/hooks";
import { IconListDetails, IconPlus } from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import { PURCHASE_PAYMENTS_QUERY } from "./utils/query.gql";
import PurchasePaymentsDetails from "./components/PurchasePaymentsDetails";
import { Link, useParams } from "react-router-dom";

interface IState {
  refetching: boolean;
  purchasePaymentsRow: null | PurchasePayment;
}

const PurchasePaymentPage = () => {
  const [state, setState] = useSetState<IState>({
    refetching: false,
    purchasePaymentsRow: null,
  });
  const [openedDetailsDrawer, detailsDrawerHandler] = useDisclosure();
  const params = useParams<{ tenant: string }>();

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "paymentUID",
        header: "Payment UID",
      },
      {
        accessorFn: (row: PurchasePayment) =>
          `${row?.account?.name} [${row?.account?.referenceNumber}]`,
        header: "Account",
      },
      {
        accessorKey: "supplier",
        accessorFn: (row: PurchasePayment) => `${row?.supplier.name}`,
        header: "Supplier",
      },

      // {
      //   accessorKey: "supplier",
      //   header: "Supplier ",
      // },
      {
        accessorKey: "paidAmount",
        header: "Paid Amount",
      },
    ],
    []
  );

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  const { data, loading, refetch } = useQuery<{
    accounting__purchasePayments: PurchasePaymentsWithPagination;
  }>(PURCHASE_PAYMENTS_QUERY, {
    variables: {
      where: {
        limit: 10,
        page: 1,
      },
    },
  });

  return (
    <>
      <PageTitle title="Purchase Payment-list" />
      <DataTable
        columns={columns}
        data={data?.accounting__purchasePayments.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.accounting__purchasePayments?.meta?.totalCount ?? 10}
        RowActionMenu={(row: PurchasePayment) => (
          <>
            <Menu.Item
              // component={Link}
              // to={`/${params.tenant}/inventory-management/products/${row?._id}`}
              // onClick={() => {
              //   console.log(row);
              // }}
              // icon={<IconFileInfo size={18} />}
              icon={<IconListDetails size={18} />}
              onClick={() => {
                setState({
                  purchasePaymentsRow: row,
                });
                detailsDrawerHandler.open();
              }}
            >
              View
            </Menu.Item>
            {/* <Menu.Item
              onClick={() => handleDeleteAccount(row._id)}
              icon={<IconTrash size={18} />}
            >
              Delete
            </Menu.Item> */}
          </>
        )}
        ActionArea={
          <>
            <Button
              leftIcon={<IconPlus size={16} />}
              component={Link}
              to={`/${params.tenant}/inventory-management/payments/create-purchase-payment`}
              size="sm"
            >
              Make a payment
            </Button>
          </>
        }
        loading={loading || state.refetching}
      />

      <Drawer
        opened={openedDetailsDrawer}
        onClose={detailsDrawerHandler.close}
        position="right"
        title="Purchase Payment details"
        withCloseButton={true}
      >
        <PurchasePaymentsDetails
          purchasePaymentsRow={state?.purchasePaymentsRow as PurchasePayment}
        />
      </Drawer>
    </>
  );
};

export default PurchasePaymentPage;