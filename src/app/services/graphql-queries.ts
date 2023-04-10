import { gql } from 'apollo-angular';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        email
        password
      }
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      email
      password
      username
    }
  }
`;

export const GET_EMPLOYEES = gql`
  query getEmployees {
    getEmployees {
      id
      first_name
      email
      gender
      last_name
      salary
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation deleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation createEmployee($EmployeeInput: EmployeeInput!) {
    createEmployee(EmployeeInput: $EmployeeInput) {
      first_name
      last_name
      email
      gender
      salary
    }
  }
`;

export const EDIT_EMPLOYEE = gql`
  mutation editEmployee($id: ID!, $EmployeeInput: EmployeeInput!) {
    editEmployee(id: $id, EmployeeInput: $EmployeeInput) {
      id
      first_name
      last_name
      email
      gender
      salary
    }
  }
`;
