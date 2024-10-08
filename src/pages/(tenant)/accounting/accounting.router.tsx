import DashboardLayout from "@/commons/components/layouts/DashboardLayout";
import { RouteObject } from "react-router-dom";
import { accountingNavlinks } from "./accounting.navlinks";
import AccountsPage from "./pages/cashbook/accounts/accounts.page";
import AdjustmentPage from "./pages/cashbook/adjustment/adjustment.page";
import PayrollPage from "./pages/cashbook/payroll/payroll.page";
import StatementPage from "./pages/cashbook/statements/statements.page";
import TransferPage from "./pages/cashbook/transfers/transfer.page";
import ExpenseCategoryPage from "./pages/expense/expenseCategory/expenseCategory.page";
import ExpenseListPage from "./pages/expense/expenseList/expenseList.page";
import AccountingRoot from "./module-root.page";
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
        path: "",
        element: <AccountingRoot />,
      },
      {
        path: "cashbook",
        children: [
          {
            path: "accounts",
            element: <AccountsPage />,
          },
          {
            path: "adjustments",
            element: <AdjustmentPage />,
          },
          // {
          //   path: "invoice-generator",
          //   element: <InvoiceGenerator />,
          // },
          {
            path: "transfers",
            element: <TransferPage />,
          },
          {
            path: "statements",
            element: <StatementPage />,
          },
          {
            path: "payroll",
            element: <PayrollPage />,
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
      // {
      //   path: "load-management",
      //   children: [
      //     {
      //       path: "authorities",
      //       element: <Authorities />,
      //     },
      //     {
      //       path: "loans",
      //       element: <Loans />,
      //     },
      //     {
      //       path: "payments",
      //       element: <Payments />,
      //     },
      //   ],
      // },
      // {
      //   path: "asset-management",
      //   children: [
      //     {
      //       path: "types",
      //       element: <TypesPage />,
      //     },
      //     {
      //       path: "assets",
      //       element: <AssetsPage />,
      //     },
      //   ],
      // },
    ],
  },
];
