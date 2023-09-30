import { gql } from "@apollo/client";

export const ACCOUNTING_EXPENSE_QUERY_LIST = gql`
  query Nodes {
    accounting__expenses {
      nodes {
        _id
        account {
          _id
          name
          referenceNumber
        }
        amount
        date
        note
        purpose
      }
      meta {
        totalCount
      }
    }
  }
`;

export const ACCOUNTING_EXPENSE_CREATE_MUTATION = gql`
  mutation Accounting__createExpense($body: CreateExpenseInput!) {
    accounting__createExpense(body: $body) {
      _id
    }
  }
`;


export const ACCOUNTING_EXPENSE_DELETE_MUTATION = gql`
  mutation Accounting__removeExpense($where: CommonFindDocumentDto!) {
    accounting__removeExpense(where: $where)
  }
`;