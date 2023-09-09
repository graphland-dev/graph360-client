import DashboardLayout from "@/_app/common/layouts/DashboardLayout";
import { RouteObject } from "react-router-dom";
import { accountingNavlinks } from "./accounting.navlinks";
import AccountsPage from "./pages/cashbook/accounts/accounts.page";
import AdjustmentPage from "./pages/cashbook/adjustment/adjustment.page";
import TransferPage from "./pages/cashbook/Transfer/transfer.page";
import LedgerPage from "./pages/cashbook/ledger/ledger.page";
import ExpenseListPage from "./pages/expense/expenseList/expenseList.page";
import ExpenseCategoryPage from "./pages/expense/expenseCategory/expenseCategory.page";
import Authorities from "./pages/load-manegment/authorities/authorities.page";
import Loans from "./pages/load-manegment/loans/loans.page";
import Payments from "./pages/load-manegment/payments/payments.page";
import TypesPage from "./pages/asset-management/types/types.page";
import AssetsPage from "./pages/asset-management/assets/assets.page";
export const accountingModuleRouter: RouteObject[] = [
  {
    path: "",
    element: (
      <DashboardLayout
        navlinks={accountingNavlinks}
        title="Accounting"
        path="accounting"
      />
    ),
    children: [
      {
        path: "cashbook",
        children: [
          {
            path: "accounts",
            element: <AccountsPage />,
          },
          {
            path: "adjustment",
            element: <AdjustmentPage />,
          },
          {
            path: "transfer",
            element: <TransferPage />,
          },
          {
            path: "ledger",
            element: <LedgerPage />,
          },
        ],
      },

      {
        path: "expense",
        children: [
          {
            path: "expense-list",
            element: <ExpenseListPage />,
          },
          {
            path: "expense-category",
            element: <ExpenseCategoryPage />,
          },
        ],
      },
      {
        path: "load-management",
        children: [
          {
            path: "authorities",
            element: <Authorities />,
          },
          {
            path: "loans",
            element: <Loans />,
          },
          {
            path: "payments",
            element: <Payments />,
          },
        ],
      },
      {
        path: "asset-management",
        children: [
          {
            path: "types",
            element: <TypesPage />,
          },
          {
            path: "assets",
            element: <AssetsPage />,
          },
        ],
      },
      {
        path: "payroll",
        element: <TypesPage />,
      },
    ],
  },
];
