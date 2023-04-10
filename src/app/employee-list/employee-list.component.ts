import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GraphqlService } from '../services/graphql.service';
import { GET_EMPLOYEES } from '../services/graphql-queries';
import { EmployeeInput } from '../interfaces/EmployeeInput';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  showAddForm = false;
  showEditForm = false;
  addForm: FormGroup;
  editForm: FormGroup;
  selectedEmployee: any;

  constructor(
    private apollo: Apollo,
    private fb: FormBuilder,
    private graphqlService: GraphqlService
  ) {
    this.addForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      salary: ['', Validators.required],
    });

    this.editForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      salary: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.apollo
      .watchQuery({
        query: GET_EMPLOYEES,
      })
      .valueChanges.subscribe((result: any) => {
        this.employees = result?.data?.getEmployees;
      });
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  toggleEditForm() {
    this.showEditForm = !this.showEditForm;
  }

  onDelete(id: string) {
    this.graphqlService.deleteEmployee(id).subscribe(
      ({ data }) => {
        // Update the employees array to remove the deleted employee
        this.employees = this.employees.filter(
          (employee) => employee.id !== id
        );
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onEdit(employee: any) {
    // Set the selected employee and the values of the edit form fields
    this.selectedEmployee = employee;
    this.editForm.setValue({
      firstName: employee.first_name,
      lastName: employee.last_name,
      email: employee.email,
      gender: employee.gender,
      salary: employee.salary,
    });

    // Show the edit form
    this.toggleEditForm();
  }

  onSubmitAddForm() {
    const { firstName, lastName, email, gender, salary } = this.addForm.value;
    const employeeInput: EmployeeInput = {
      first_name: firstName,
      last_name: lastName,
      email,
      gender,
      salary,
    };
    this.graphqlService.createEmployee(employeeInput).subscribe(
      ({ data }) => {
        // Push the newly created employee to the employees array
        const newEmployee = data.createEmployee;
        this.employees = this.employees.concat(newEmployee);

        // Hide the form and reset the form fields
        this.toggleAddForm();
        this.addForm.reset();
      },
      (error) => {
        console.error(error);
      },
      () => {
        this.apollo
          .watchQuery({
            query: GET_EMPLOYEES,
          })
          .valueChanges.subscribe((result: any) => {
            this.employees = result?.data?.getEmployees;
          });
      }
    );
  }

  onSubmitEditForm() {
    const { firstName, lastName, email, gender, salary } = this.editForm.value;
    const employeeInput: EmployeeInput = {
      first_name: firstName,
      last_name: lastName,
      email,
      gender,
      salary,
    };
    this.graphqlService
      .editEmployee(this.selectedEmployee.id, employeeInput)
      .subscribe(
        ({ data }) => {
          // Update the employees array with the updated employee
          const index = this.employees.findIndex(
            (e) => e.id === this.selectedEmployee.id
          );
          this.employees[index] = data.editEmployee;

          // Hide the form and reset the form fields
          this.toggleEditForm();
          this.editForm.reset();
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
