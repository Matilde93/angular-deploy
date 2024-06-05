import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, NgFor, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-activitypage',
  standalone: true,
  imports: [FormsModule, RouterOutlet, AsyncPipe, NgFor, CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './activitypage.component.html',
  styleUrl: './activitypage.component.css'
})
export class ActivitypageComponent {
 
}
