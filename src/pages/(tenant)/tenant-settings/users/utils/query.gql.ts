import { gql } from "@apollo/client";

export const Organization__Employees__Query = gql`
  query Identity__currentTenantUsers {
    identity__currentTenantUsers {
      nodes {
        _id
        name
        email
        systemRoles
        avatar {
          path
          provider
          meta
        }
        memberships {
          tenant
          roles
        }
      }
    }
  }
`;

export const IDENTITY_ADD_USER_TO_CURRENT_TENANT = gql`
  mutation Identity__addUserToCurrentTenant($input: AddUserToTenantInput!) {
    identity__addUserToCurrentTenant(input: $input)
  }
`;

export const IDENTITY_UPDATE_CURRENT_TENANT_USER_ROLE = gql`
  mutation Identity__updateCurrentTenantUserRole(
    $userId: ID!
    $roles: [String!]!
  ) {
    identity__updateCurrentTenantUserRole(userId: $userId, roles: $roles)
  }
`;

export const IDENTITY_REMOVE_CURRENT_TENANT_USER_ROLE = gql`
  mutation Identity__removeUserTenantMembership($userId: ID!) {
    identity__removeUserTenantMembership(userId: $userId)
  }
`;

export const IDENTITY_CURRENT_TENANT = gql`
  query Identity__currentTenantUsers($input: CommonPaginationDto) {
    identity__currentTenantUsers(input: $input) {
      nodes {
        _id
        name
        email
        systemRoles
        memberships {
          tenant
          roles
        }
        email
        tenant
      }
    }
  }
`;
