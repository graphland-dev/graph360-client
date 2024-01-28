import { confirmModal } from '@/_app/common/confirm/confirm';
import DataTable from '@/_app/common/data-table/DataTable';
import {
	MatchOperator,
	ProductPurchase,
	ProductPurchasesWithPagination,
	PurchaseProductItemReference,
} from '@/_app/graphql-models/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Drawer, Menu } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { IconFileInfo, IconPlus, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { MRT_ColumnDef } from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PurchaseItemsShowCase from './components/PurchaseItemsShowCase';
import {
	Inventory__Remove_Product_Purchase,
	Inventory__product_Purchases_Query,
} from './utils/query';
import PageTitle from '@/_app/common/PageTitle';

interface IState {
	refetching: boolean;
	openDrawer: boolean;
}

const PurchaseListPage = () => {
	const [products, setProducts] = useState<PurchaseProductItemReference[]>();
	const [state, setState] = useSetState<IState>({
		refetching: false,
		openDrawer: false,
	});

	const { data, loading, refetch } = useQuery<{
		inventory__productPurchases: ProductPurchasesWithPagination;
	}>(Inventory__product_Purchases_Query, {
		variables: {
			where: {
				limit: 10,
				page: 1,
			},
		},
	});

	const [deleteProductMutation] = useMutation(
		Inventory__Remove_Product_Purchase,
		{
			onCompleted: () => handleRefetch({}),
		}
	);

	const handleRefetch = (variables: any) => {
		setState({ refetching: true });
		refetch(variables).finally(() => {
			setState({ refetching: false });
		});
	};

	const handleDeleteAccount = (_id: string) => {
		confirmModal({
			title: 'Sure to delete product?',
			description: 'Be careful!! Once you deleted, it can not be undone',
			isDangerous: true,
			onConfirm() {
				deleteProductMutation({
					variables: {
						where: { key: '_id', operator: MatchOperator.Eq, value: _id },
					},
				});
			},
		});
	};

	const columns = useMemo<MRT_ColumnDef<any>[]>(
		() => [
			{
				accessorKey: 'supplier.name',
				header: 'Supplier Name',
			},
			{
				accessorKey: 'purchaseDate',

				accessorFn: (row: ProductPurchase) =>
					dayjs(row?.purchaseDate).format('MMMM D, YYYY h:mm A'),
				header: 'Purchase Date',
			},
			{
				accessorKey: 'purchaseOrderDate',

				accessorFn: (row: ProductPurchase) =>
					dayjs(row?.purchaseOrderDate).format('MMMM D, YYYY h:mm A'),
				header: 'Order Date',
			},
			// {
			// 	header: 'Stock Quantity',
			// 	accessorFn(originalRow: Product) {
			// 		return (
			// 			originalRow?.stockInQuantity - originalRow?.stockOutQuantity || 0
			// 		);
			// 	},
			// },
			{
				accessorKey: 'dueAmount',
				accessorFn: (originalRow: ProductPurchase) =>
					`${originalRow?.dueAmount} BDT`,
				header: 'Due Amount',
			},
			{
				accessorKey: 'paidAmount',
				accessorFn: (originalRow: ProductPurchase) =>
					`${originalRow?.paidAmount} BDT`,
				header: 'Paid Amount',
			},
			{
				accessorKey: 'netTotal',
				accessorFn: (originalRow: ProductPurchase) =>
					`${originalRow?.netTotal} BDT`,
				header: 'Net Total',
			},
			// {
			// 	accessorKey: 'price',
			// 	header: 'Price',
			// },
		],
		[]
	);

	return (
    <>
      <PageTitle title="purchase-list" />
      <Drawer
        onClose={() =>
          setState({
            openDrawer: false,
          })
        }
        title="Product items in purchase"
        opened={state.openDrawer}
      >
        <PurchaseItemsShowCase items={products!} />
      </Drawer>
      <DataTable
        columns={columns}
        data={data?.inventory__productPurchases.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.inventory__productPurchases.meta?.totalCount ?? 10}
        RowActionMenu={(row: ProductPurchase) => (
          <>
            <Menu.Item
              icon={<IconFileInfo size={18} />}
              onClick={() => {
                setProducts(row?.products);
                setState({
                  openDrawer: true,
                });
              }}
              color="yellow"
            >
              View
            </Menu.Item>
            <Menu.Item
              onClick={() => handleDeleteAccount(row._id)}
              icon={<IconTrash size={18} />}
              color="red"
            >
              Delete
            </Menu.Item>
          </>
        )}
        ActionArea={
          <>
            <Button
              leftIcon={<IconPlus size={16} />}
              component={Link}
              to="/inventory-management/purchases/create"
              size="sm"
            >
              Add new
            </Button>
          </>
        }
        loading={loading || state.refetching}
      />
    </>
  );
};

export default PurchaseListPage;