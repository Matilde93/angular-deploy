import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AsyncPipe, NgFor, CommonModule, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FirestoreService } from '../../services/firestore/firestore.service';

@Component({
  selector: 'app-eventpage',
  standalone: true,
  imports: [FormsModule, RouterOutlet, AsyncPipe, NgFor, CommonModule, MatCardModule, MatButtonModule, NgIf],
  templateUrl: './eventpage.component.html',
  styleUrl: './eventpage.component.css'
})
export class EventpageComponent implements OnInit {
  userData!: Observable<any>;
  firestoreService = inject(FirestoreService);

  ngOnInit(){
    this.getData();
  }

  getData() {
   this.userData = this.firestoreService.getAllEvents()
  }
}
