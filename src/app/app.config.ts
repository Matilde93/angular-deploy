import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"erichsons-garage","appId":"1:68691902180:web:ef9c3df5cfbf5ccd39b6f1","storageBucket":"erichsons-garage.appspot.com","apiKey":"AIzaSyBMCEx8BY6HOx7SuCUmvI4H3c33_oSRsXI","authDomain":"erichsons-garage.firebaseapp.com","messagingSenderId":"68691902180","measurementId":"G-920XPMKEY6"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage())]
};
