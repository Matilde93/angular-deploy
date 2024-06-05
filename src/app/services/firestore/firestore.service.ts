import { Injectable } from '@angular/core';
import { Firestore, Timestamp, addDoc, arrayRemove, arrayUnion,
  collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, from, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  activitiesInstance = collection(this.firestore, 'activities');
  eventsInstance = collection(this.firestore, 'events');
  membersInstance = collection(this.firestore, 'members');

  constructor(private firestore: Firestore) {}

  getAllActivities(): Observable<any[]> {
    return collectionData(this.activitiesInstance, { idField: 'id' }).pipe(
      map(activities => activities.sort((a, b) => 
        a['date'].toDate().getTime() - b['date'].toDate().getTime()))
    );
  }

  getAllMembers(): Observable<any[]> {
    return collectionData(this.membersInstance, { idField: 'id' }).pipe(
      map(activities => activities.sort((a, b) => a['navn'] - b['navn']))
    );
  }

  getAllActivitiesForSignup(email: string): Observable<any[]> {
    return collectionData(this.activitiesInstance, { idField: 'id' }).pipe(
      map(activities => activities
        .filter(activity => !activity['signups'].includes(email))
        .sort((a, b) => a['date'].toDate().getTime() - b['date'].toDate().getTime())),
      tap(filteredActivities => console.log(filteredActivities))
    );
  }

  getUserActivities(email: string): Observable<any[]> {
    return collectionData(this.activitiesInstance, { idField: 'id' }).pipe(
      map(activities => activities
        .filter(activity => activity['signups'].includes(email))
        .sort((a, b) => a['date'].toDate().getTime() - b['date'].toDate().getTime()))
    );
  }

  getAllEvents(): Observable<any[]> {
    return collectionData(this.eventsInstance, {idField: 'id'});
  }

  addActivity(name: string, location: string, quantity: number, date: Timestamp): Observable<string> {
    const activityToCreate = { name, location, quantity, date, signups:[] }
    const promise = addDoc(this.activitiesInstance, activityToCreate).then(
      (response) => response.id
    );
    return from(promise);
  }

  deleteActivity(id: string){
    const docInstance = doc(this.activitiesInstance, id);
    deleteDoc(docInstance)
    .then(() =>{
      console.log('Activity deleted')
    })
  }

  getUserInfo(email: string) {
    const filteredCollection$ = collectionData(this.membersInstance, {idField: 'id'}).pipe(
      map(members => members.filter(member => member['email'] === email))
    );

    filteredCollection$.subscribe(value => {
      console.log(value);
    });

    return filteredCollection$;
  }
  
  isAdmin(email: string): Observable<boolean> {
    return collectionData(this.membersInstance, { idField: 'id' }).pipe(
      map(members => members
        .filter(member => member['email'] === email && member['isAdmin'] === true)
        .length > 0
      )
    );
  }

  addMember(name: string, address: string, zipcode: string, city: string, email: string): Observable<string> {
    const memberToCreate = { name, address, zipcode, city, email, imageUrl: '/assets/images/avatar.jpg' };
    const promise = addDoc(this.membersInstance, memberToCreate).then(
      (response) => response.id
    );
    return from(promise);
  }

  deleteMember(id: string){
    const docInstance = doc(this.membersInstance, id);
    deleteDoc(docInstance)
    .then(() =>{
      console.log('Member deleted')
    })
  }

  async signupToActivity(id:string, email: string){
    const docRef = doc(this.activitiesInstance, id);
    await updateDoc(docRef, {
      signups: arrayUnion(email)
    })
  }

  async removeFromActivity(id:string, email: string){
    const docRef = doc(this.activitiesInstance, id);
    await updateDoc(docRef, {
      signups: arrayRemove(email)
    })
  }

  async updateUserInfo(id: string, field: string, data: string) {
    const docRef = doc(this.membersInstance, id);
    await updateDoc(docRef, {
      [field]: data
    });
  }

  async updateProfilePicture(id: string, url: string){
    const docRef = doc(this.membersInstance, id);
    await updateDoc(docRef,{
      imageUrl: url
    })
  }
  

}
