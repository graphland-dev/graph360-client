import {
  Navigate,
  Outlet,
  createBrowserRouter,
  useParams,
} from "react-router-dom";
import NotFoundPage from "./pages/_404.page";

import { AuthGuardedWrapper } from "./_app/common/components/AuthGuardedWrapper";
import { accountingModuleRouter } from "./pages/(tenant)/accounting/accounting.router";
import { inventoryModuleRouter } from "./pages/(tenant)/inventory-management/inventory.router";
import ModulesPage from "./pages/(tenant)/modules.page";
import { peopleModuleRouter } from "./pages/(tenant)/people/people.route";
import { reportsModuleRouter } from "./pages/(tenant)/reports/report.router";
import TenantResolver from "./pages/(tenant)/tenant-resolver";
import { tenantSettingRouter } from "./pages/(tenant)/tenant-settings/tenant-settings.route";
import { authRouter } from "./pages/auth/auth.router";
import SelectOrganization from "./pages/select-organization.page";
import DesignSystem from "./pages/design-system.page";
import { SpotlightProvider } from "@mantine/spotlight";
import { getSpotlightItems } from "./_app/configs/spotlight-items";

const SpotlightWrapper = () => {
  const params = useParams<{ tenant: string }>();

  return (
    <SpotlightProvider
      shortcut={["mod + P", "mod + K"]}
      actions={getSpotlightItems(params.tenant || "")}
    >
      <Outlet />
    </SpotlightProvider>
  );
};

export const rootRouter = createBrowserRouter([
  {
    path: "/",
    element: <SpotlightWrapper />,
    children: [
      {
        path: "/",
        element: <Navigate to="/select-tenant" />,
      },
      {
        path: "/design-system",
        element: <DesignSystem />,
      },
      {
        path: "/select-tenant",
        element: <SelectOrganization />,
      },
      {
        path: "/auth",
        children: authRouter,
      },
      {
        path: "/:tenant",
        element: (
          <AuthGuardedWrapper>
            <TenantResolver />
          </AuthGuardedWrapper>
        ),
        children: [
          {
            path: "",
            element: <ModulesPage />,
          },
          {
            // ✅
            path: "accounting",
            children: accountingModuleRouter,
          },
          {
            path: "inventory-Management",
            children: inventoryModuleRouter,
          },
          {
            path: "people",
            children: peopleModuleRouter,
          },
          {
            path: "reports",
            children: reportsModuleRouter,
          },
          // {
          //   path: "settings",
          //   children: settingModuleRouter,
          // },
          {
            path: "tenant-settings",
            children: tenantSettingRouter,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
