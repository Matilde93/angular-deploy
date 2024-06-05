import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import {MatMenuModule} from '@angular/material/menu';
import { AuthService } from '../../services/auth/auth.service';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass, MatButtonModule, MatToolbarModule, MatIconModule, RouterLink, MatDialogModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  navbarOpen = false;
  authService = inject(AuthService);
  
  constructor(private router: Router, public dialog: MatDialog) {}

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  
  goToActivities(){
    this.router.navigate(['/activities']);
  }

  openLoginDialog() {
    const loginDialogRef = this.dialog.open(LoginComponent);

    loginDialogRef.afterClosed().subscribe(() => {});
  }

  logOut() {
    this.authService.logout();
  }

}
