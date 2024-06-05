import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { AsyncPipe, NgFor, CommonModule } from '@angular/common';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

@Component({
  selector: 'app-userpage',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    NgFor,
    CommonModule,
    AsyncPipe,
    MatIconModule,
    MatMenuModule,
    MatExpansionModule,
    MatListModule,
    MatTabsModule,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: './userpage.component.html',
  styleUrl: './userpage.component.css'
})
export class UserpageComponent {
  authService = inject(AuthService);
  firestoreService = inject(FirestoreService);

  userData!: Observable<any>;
  userActivities!: Observable<any>;
  allActivities!: Observable<any>;

  userEmail!: string;
  editableUserData: any = {};
  isEditing: any = {};

  constructor() {
    this.userEmail = this.authService.currentUserSig()?.email!;
    this.getData();
    this.getUserActivities();
    this.getAllActivities();
  }

  async fileSelected(id: string, event: any) {
    const file = event.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, file.name);

    await uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Uploaded a file!');
    });

    const url = await getDownloadURL(storageRef);
    console.log(url)

    this.firestoreService.updateProfilePicture(id, url)
  }

  getData() {
    this.userData = this.firestoreService.getUserInfo(this.userEmail);
    this.userData.subscribe(data => {
      this.editableUserData = { ...data };
    });
    console.log(this.userData);
  }

  getUserActivities() {
    this.userActivities = this.firestoreService.getUserActivities(this.userEmail);
    console.log(this.userActivities);
  }

  getAllActivities() {
    this.allActivities = this.firestoreService.getAllActivitiesForSignup(this.userEmail);
    console.log(this.allActivities);
  }

  signupForActivity(id: string) {
    this.firestoreService.signupToActivity(id, this.userEmail);
    console.log('signed up for activity');
  }

  removeFromActivity(id: string) {
    this.firestoreService.removeFromActivity(id, this.userEmail);
    console.log('removed from activity');
  }

  editField(field: string) {
    this.isEditing[field] = true;
  }

  saveField(id: string, field: string) {
    this.isEditing[field] = false;
    this.firestoreService.updateUserInfo(id, field, this.editableUserData[field]);
    console.log(`saved ${field}: ${this.editableUserData[field]}`);
  }

  cancelEdit(field: string) {
    this.isEditing[field] = false;
    this.userData.subscribe(data => {
      this.editableUserData[field] = data[field];
    });
    console.log(`cancelled edit for ${field}`);
  }
}
