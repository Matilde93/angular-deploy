import { Injectable } from '@angular/core';
import { Firestore, Timestamp, addDoc, arrayRemove, arrayUnion, collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, from, map, tap } from 'rxjs';
import { Activity } from '../../interfaces/activity.interface';
import { Member } from '../../interfaces/member.interface';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  activitiesInstance = collection(this.firestore, 'activities');
  eventsInstance = collection(this.firestore, 'events');
  membersInstance = collection(this.firestore, 'members');

  constructor(private firestore: Firestore) {}

  getAllActivities(): Observable<Activity[]> {
    return collectionData<Activity>(this.activitiesInstance, { idField: 'id' }).pipe(
      map((activities: Activity[]) => activities.sort((a: Activity, b: Activity) => 
        a.date.toDate().getTime() - b.date.toDate().getTime()))
    );
  }

  getAllMembers(): Observable<Member[]> {
    return collectionData<Member>(this.membersInstance, { idField: 'id' }).pipe(
      map((members: Member[]) => members.sort((a: Member, b: Member) => a.name.localeCompare(b.name)))
    );
  }

  getAllActivitiesForSignup(email: string): Observable<Activity[]> {
    return collectionData<Activity>(this.activitiesInstance, { idField: 'id' }).pipe(
      map((activities: Activity[]) => activities
        .filter(activity => !activity.signups.includes(email))
        .sort((a: Activity, b: Activity) => a.date.toDate().getTime() - b.date.toDate().getTime())),
      tap(filteredActivities => console.log(filteredActivities))
    );
  }

  getUserActivities(email: string): Observable<Activity[]> {
    return collectionData<Activity>(this.activitiesInstance, { idField: 'id' }).pipe(
      map((activities: Activity[]) => activities
        .filter(activity => activity.signups.includes(email))
        .sort((a: Activity, b: Activity) => a.date.toDate().getTime() - b.date.toDate().getTime()))
    );
  }

  getAllEvents(): Observable<any[]> {
    return collectionData(this.eventsInstance, {idField: 'id'});
  }

  addActivity(name: string, location: string, quantity: number, date: Timestamp): Observable<string> {
    const activityToCreate: Activity = { name, location, quantity, date, signups:[] };
    const promise = addDoc(this.activitiesInstance, activityToCreate).then(
      (response) => response.id
    );
    return from(promise);
  }

  deleteActivity(id: string): void {
    const docInstance = doc(this.activitiesInstance, id);
    deleteDoc(docInstance)
    .then(() =>{
      console.log('Activity deleted');
    });
  }

  getUserInfo(email: string): Observable<Member[]> {
    const filteredCollection$ = collectionData<Member>(this.membersInstance, {idField: 'id'}).pipe(
      map((members: Member[]) => members.filter(member => member.email === email))
    );

    filteredCollection$.subscribe((value: Member[]) => {
      console.log(value);
    });

    return filteredCollection$;
  }
  
  isAdmin(email: string): Observable<boolean> {
    return collectionData<Member>(this.membersInstance, { idField: 'id' }).pipe(
      map((members: Member[]) => members
        .filter(member => member.email === email && member.isAdmin === true)
        .length > 0
      )
    );
  }

  addMember(name: string, address: string, zipcode: string, city: string, email: string): Observable<string> {
    const memberToCreate: Member = { name, address, zipcode, city, email, imageUrl: '../../../assets/images/avatar.jpg', isAdmin: false};
    const promise = addDoc(this.membersInstance, memberToCreate).then(
      (response) => response.id
    );
    return from(promise);
  }

  deleteMember(id: string): void {
    const docInstance = doc(this.membersInstance, id);
    deleteDoc(docInstance)
    .then(() =>{
      console.log('Member deleted');
    });
  }

  async signupToActivity(id: string, email: string): Promise<void> {
    const docRef = doc(this.activitiesInstance, id);
    await updateDoc(docRef, {
      signups: arrayUnion(email)
    });
  }

  async removeFromActivity(id: string, email: string): Promise<void> {
    const docRef = doc(this.activitiesInstance, id);
    await updateDoc(docRef, {
      signups: arrayRemove(email)
    });
  }

  async updateUserInfo(id: string, field: string, data: string): Promise<void> {
    const docRef = doc(this.membersInstance, id);
    await updateDoc(docRef, {
      [field]: data
    });
  }

  async updateProfilePicture(id: string, url: string): Promise<void> {
    const docRef = doc(this.membersInstance, id);
    await updateDoc(docRef,{
      imageUrl: url
    });
  }
}
