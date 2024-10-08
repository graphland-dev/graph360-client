import PageTitle from "@/commons/components/PageTitle";
import DataTable from "@/commons/components/DataTable.tsx";
import {
  MatchOperator,
  PurchasePayment,
  PurchasePaymentsWithPagination,
} from "@/commons/graphql-models/graphql";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Button, Drawer, Menu, Title } from "@mantine/core";
import { useDisclosure, useSetState } from "@mantine/hooks";
import { IconListDetails, IconPlus } from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useEffect, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import PurchasePaymentsDetails from "./components/PurchasePaymentsDetails";
import { PURCHASE_PAYMENTS_QUERY } from "./utils/query.gql";

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

  const { data, loading, refetch } = useQuery<{
    accounting__purchasePayments: PurchasePaymentsWithPagination;
  }>(PURCHASE_PAYMENTS_QUERY, {
    variables: { where: { limit: 100, page: 1 } },
  });

  const [searchParams] = useSearchParams();
  const purchasePaymentId = searchParams.get("purchasePaymentId");


    const [productPurchase] = useLazyQuery<{
      accounting__purchasePayments: PurchasePaymentsWithPagination;
    }>(PURCHASE_PAYMENTS_QUERY, {
      fetchPolicy: "network-only",
    });

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
      {
        accessorKey: "paidAmount",
        // accessorFn: (row: PurchasePayment) => {
        //   const totalAmount = row?.items?.reduce(
        //     (total, current) => total + (current?.purchase.paidAmount ?? 0),
        //     0
        //   );

        //   let color = "red";
        //   if (totalAmount - row.paidAmount === 0) {
        //     color = "green"
        //   }
        //   if (totalAmount - row.paidAmount > 0) {
        //     color = "yellow"
        //   }

        //   return <Badge color={color}>{row.paidAmount}</Badge>;
        // },
        header: "Paid Amount",
      },
      // {
      //   accessorFn: (row: PurchasePayment) =>
      //     `${row?.account?.name} [${row?.account?.referenceNumber}]`,
      //   header: "Account",
      // },
      // {
      //   accessorFn: (row: PurchasePayment) =>
      //   {
      //     return (
      //       <>

      //         <Menu.Item
      //           icon={<IconListDetails size={18} />}
      //           onClick={() => {
      //             setState({
      //               purchasePaymentsRow: row,
      //             });
      //             detailsDrawerHandler.open();
      //           }}
      //         >
      //           View
      //         </Menu.Item>
      //       </>
      //     );
      //     },
      //   header: "Action",
      // },
    ],
    []
  );

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

    useEffect(() => {
   
      if (purchasePaymentId) {
        // alert(invoiceId);
        productPurchase({
          variables: {
            where: {
              filters: [
                {
                  key: "_id",
                  operator: MatchOperator.Eq,
                  value: purchasePaymentId,
                },
              ],
            },
          },
          onError: (err) => console.log(err)
        }).then((res) => {
         
          setState({
            purchasePaymentsRow:
              res.data?.accounting__purchasePayments?.nodes?.[0],
          });
          detailsDrawerHandler.open();
        });
      }
    }, [searchParams]);

  return (
    <>
      <PageTitle title="Purchase Payment-list" />
      <DataTable
        columns={columns}
        data={data?.accounting__purchasePayments.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.accounting__purchasePayments?.meta?.totalCount ?? 100}
        RowActionMenu={(row: PurchasePayment) => (
          <>
            <Menu.Item
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
      {/* <MantineReactTable
        columns={columns}
        data={data?.accounting__purchasePayments.nodes ?? []}
        // refetch={handleRefetch}
        totalCount={data?.accounting__purchasePayments?.meta?.totalCount ?? 100}
        mantineTableBodyRowProps={({ row }) => {
          let background = "unset";
          console.log(row.original);
          if (row.original.paidAmount >= 0) {
            background = "lightgreen"; // or any color you prefer
          } else {
            background = "salmon"; // or any color you prefer for negative paidAmount
          }
          return {
            sx: { background, color: "white" },
          };
        }}
        mantineTableBodyProps={{
          sx: {
            //stripe the rows, make odd rows a darker color
            // "& tr:nth-of-type(odd)": {
            //   backgroundColor: "#f5f5f5",
            // },
            "& td": {
              backgroundColor: "unset",
            },
          },
        }}
        RowActionMenu={(row: PurchasePayment) => (
          <>
            <Menu.Item
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
      /> */}

      <Drawer
        opened={openedDetailsDrawer}
        onClose={detailsDrawerHandler.close}
        position="left"
        size={"90%"}
        title={<Title order={3}>Purchase Payment details</Title>}
        withCloseButton={true}
      >
        <PurchasePaymentsDetails
          purchasePaymentsRow={state?.purchasePaymentsRow as PurchasePayment}
          loading={loading}
        />
      </Drawer>
    </>
  );
};

export default PurchasePaymentPage;
