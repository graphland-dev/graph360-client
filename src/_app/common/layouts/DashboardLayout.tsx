import { AppNavLink } from "@/_app/models/AppNavLink.type";
import { AppShell, NavLink, Navbar, ScrollArea, Title } from "@mantine/core";
import React from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import CommonHeader from "./componants/CommonHeader";

interface Prop {
  navlinks: AppNavLink[];
  title?: string;
  path: string;
}

const DashboardLayout: React.FC<Prop> = ({ navlinks, title, path }) => {
  const { pathname } = useLocation();
  const params = useParams<{ tenant: string }>();

  const linkWithTenant = (link: string) => {
    if (params.tenant) return `/${params.tenant}/${link}`;
    return `/${link}`;
  };

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      header={<CommonHeader />}
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
          {title && (
            <Navbar.Section p={"sm"}>
              <Title order={4}>{title}</Title>
            </Navbar.Section>
          )}
          <Navbar.Section grow mt="md" component={ScrollArea}>
            {navlinks.map((item, index) => (
              <NavLink
                key={index}
                label={item.label}
                component={Link}
                to={linkWithTenant(`${path}/${item?.href}`)}
                icon={item.icon}
                className="rounded-md "
                active={pathname.includes(item?.href as string)}
              >
                {item?.children &&
                  item.children.map((_item, key) => (
                    <NavLink
                      key={key}
                      label={_item.label}
                      component={Link}
                      px={"xs"}
                      py={2}
                      active={pathname.startsWith(
                        linkWithTenant(`${path}/${item?.href}/${_item.href}`)
                      )}
                      to={linkWithTenant(`${path}/${item?.href}/${_item.href}`)}
                    />
                  ))}
              </NavLink>
            ))}
          </Navbar.Section>
        </Navbar>
      }
    >
      <Outlet />
    </AppShell>
  );
};

export default DashboardLayout;
