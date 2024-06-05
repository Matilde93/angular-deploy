import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { MatSelectModule } from '@angular/material/select';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-membership',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatInputModule, MatFormField,
    ReactiveFormsModule, MatSelectModule, CommonModule],
  templateUrl: './membership.component.html',
  styleUrl: './membership.component.css'
})
export class MembershipComponent {

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService);
  firestoreService = inject(FirestoreService);
  router = inject(Router);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    address: ['', Validators.required],
    zipcode: ['', Validators.required],
    city: ['', Validators.required],
    membershipType: ['', Validators.required],
  });
  errorMessage: string | null = null;
  isSubmitted = false;
  submittedName = '';

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    this.authService.register(rawForm.email, rawForm.name, rawForm.password)
      .subscribe({
        next: () => {
          console.log("Registered to firebase auth successfully")
          this.firestoreService.addMember(rawForm.name, rawForm.address, rawForm.zipcode, rawForm.city, rawForm.email)
            .subscribe({
              next: () => {
                console.log("Member added to database")
                this.submittedName = rawForm.name;
                this.isSubmitted = true;
              },
              error: (error) => {
                this.errorMessage = error.code;
              }
            });
        },
        error: (error) => {
          this.errorMessage = error.code;
        }
      });
  }


}
