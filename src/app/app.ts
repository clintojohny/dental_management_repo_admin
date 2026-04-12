import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar, Header],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'Dental Admin Panel';
  sidebarOpen = false;
  isAuthPage = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAuthPage = event.url === '/login' || event.url === '/signup';
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
