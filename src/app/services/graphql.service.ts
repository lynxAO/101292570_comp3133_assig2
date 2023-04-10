import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LOGIN_MUTATION } from './graphql-queries';
import { CREATE_USER_MUTATION } from './graphql-queries';
import { GET_EMPLOYEES } from './graphql-queries';
import { CREATE_EMPLOYEE } from './graphql-queries';
import { DELETE_EMPLOYEE } from './graphql-queries';
import { EDIT_EMPLOYEE } from './graphql-queries';
import { EmployeeInput } from '../interfaces/EmployeeInput';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  constructor(private apollo: Apollo) {}

  query<T>(query: any, variables?: any): Observable<T> {
    return this.apollo
      .query<T>({
        query,
        variables,
      })
      .pipe(map((res) => res.data));
  }

  mutation<T>(mutation: any, variables?: any): Observable<T> {
    return this.apollo
      .mutate<T>({
        mutation,
        variables,
      })
      .pipe(map((res) => res.data || ({} as T)));
  }

  login(email: string, password: string): Observable<any> {
    return this.mutation<any>(LOGIN_MUTATION, {
      input: {
        email,
        password,
      },
    });
  }

  createUser(
    username: string,
    email: string,
    password: string
  ): Observable<any> {
    return this.mutation<any>(CREATE_USER_MUTATION, {
      input: {
        username,
        email,
        password,
      },
    });
  }

  getEmployees(): Observable<any> {
    return this.query<any>(GET_EMPLOYEES);
  }

  createEmployee(employeeInput: EmployeeInput): Observable<any> {
    return this.mutation<any>(CREATE_EMPLOYEE, {
      EmployeeInput: employeeInput,
    }).pipe(
      map((res) => res.data?.createEmployee),
      // Add refetchQueries to automatically refetch the getEmployees query
      switchMap(() => {
        return this.apollo
          .query<any>({
            query: GET_EMPLOYEES,
            fetchPolicy: 'network-only',
          })
          .pipe(map((res) => res.data?.getEmployees));
      })
    );
  }

  deleteEmployee(id: string): Observable<any> {
    return this.mutation<any>(DELETE_EMPLOYEE, {
      id,
    });
  }

  editEmployee(id: string, employeeInput: EmployeeInput): Observable<any> {
    return this.mutation<any>(EDIT_EMPLOYEE, {
      id,
      EmployeeInput: employeeInput,
    }).pipe(map((res) => res.data?.editEmployee));
  }
}
