import { TenantsWithPagination } from "@/_app/graphql-models/graphql";
import { gql, useQuery } from "@apollo/client";
import { Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";

const MY_TENANTS = gql`
  query Identity__myTenants {
    identity__myTenants {
      nodes {
        _id
        name
        uid
        createdAt
      }
    }
  }
`;

const SelectOrganization = () => {
  const { data } = useQuery<{ identity__myTenants: TenantsWithPagination }>(
    MY_TENANTS
  );

  return (
    <div className="p-14">
      <Title order={2}>Select Organization</Title>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {data?.identity__myTenants.nodes?.map((tenant) => (
          <Link
            className="p-5 text-xl border-2 rounded-md text-neutral-primary border-neutral-primary"
            to={`/${tenant.uid}`}
          >
            {tenant.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SelectOrganization;
