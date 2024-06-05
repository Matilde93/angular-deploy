import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgFor, CommonModule } from '@angular/common';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { Timestamp } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-adminpage',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    AsyncPipe,
    NgFor,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule
  ],
  templateUrl: './adminpage.component.html',
  styleUrl: './adminpage.component.css',
  providers: [provideNativeDateAdapter()],
})
export class AdminpageComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  firestoreService = inject(FirestoreService);
  router = inject(Router);

  allActivities!: Observable<any>;
  allMembers!: Observable<any>;

  constructor() {
    this.getAllActivities();
    this.getAllMembers();
  }

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    location: ['', Validators.required],
    quantity: [0, Validators.required],
    date: [new Date(), Validators.required],
    time: ['', Validators.required],
  });
  errorMessage: string | null = null;


  getAllActivities() {
    this.allActivities = this.firestoreService.getAllActivities();
  }

  getAllMembers() {
    this.allMembers = this.firestoreService.getAllMembers();
  }

  onSubmit() {
    const rawForm = this.form.getRawValue();
    
    const date: Date = rawForm.date;
    const time: string = rawForm.time;
  
    const [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours);
    date.setMinutes(minutes);
  
    const timestamp = Timestamp.fromDate(date);
  
    this.firestoreService.addActivity(
      rawForm.name,
      rawForm.location,
      rawForm.quantity,
      timestamp
    )
    .subscribe({
      next: () => {
        console.log("Activity added to database")
      },
      error: (error) => {
        this.errorMessage = error.code;
      }
    });
    alert('Hold tilføjet')
    this.form.reset();
  }
  
  deleteActivity(id: string) {
    this.firestoreService.deleteActivity(id);
    alert('Hold slettet')
  }

  deleteMember(id: string) {
    this.firestoreService.deleteMember(id);
    alert('Medlem slettet')
  }

}
