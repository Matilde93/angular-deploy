import { Injectable, signal, inject } from '@angular/core';
import { Auth, user, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { UserInterface } from '../../interfaces/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<UserInterface | null | undefined>(undefined);

  constructor(private router: Router) {
    this.user$.subscribe(user => {
      this.currentUserSig();
    });
  }

  register(email: string, name: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(response => updateProfile(response.user, { displayName: name }));
    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {
      this.router.navigate(['/profil']);
    });
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }
}
