import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ActivitypageComponent } from './pages/activitypage/activitypage.component';
import { AdminpageComponent } from './pages/adminpage/adminpage.component';
import { EventpageComponent } from './pages/eventpage/eventpage.component';
import { MembershipComponent } from './pages/membership/membership.component';
import { InformationComponent } from './pages/information/information.component';
import { UserpageComponent } from './pages/userpage/userpage.component';
import { AdminGuard, AuthGuard } from './guards/auth/auth.guard';
import { AboutpageComponent } from './pages/aboutpage/aboutpage.component';

export const routes: Routes = [
        { path: 'hjem', component: HomepageComponent },
        { path: 'ommig', component: AboutpageComponent },
        { path: 'hold', component: ActivitypageComponent },
        { path: 'events', component: EventpageComponent },
        { path: 'admin', component: AdminpageComponent, canActivate: [AdminGuard] },
        { path: 'medlemskab', component: MembershipComponent},
        { path: 'kontakt', component: InformationComponent},
        { path: 'profil', component: UserpageComponent, canActivate: [AuthGuard]},
        { path: '', redirectTo: 'hjem', pathMatch: 'full' }
];
