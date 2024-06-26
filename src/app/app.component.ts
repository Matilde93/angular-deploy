import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth/auth.service'; 


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, HomepageComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'erichsons-garage';

  authService = inject(AuthService)

  constructor(private router: Router) {}

  
  ngOnInit(): void {
      this.authService.user$.subscribe((user: { email: string; displayName: string; }) => {
        if (user){
          this.authService.currentUserSig.set({
            email: user.email!,
            name: user.displayName!
          });
        } else {
          this.authService.currentUserSig.set(null);
        }
        console.log("User logged in: " + this.authService.currentUserSig()?.name)
      });

      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          window.scrollTo(0, 0);
        }
      });
  }
}
