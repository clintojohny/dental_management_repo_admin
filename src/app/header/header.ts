import { Component, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {
  @Output() sidebarToggle = new EventEmitter<void>();
  currentDate = new Date();
  isDarkMode = true;
  profileMenuOpen = false;
  private timerInterval: any;

  ngOnInit() {
    this.timerInterval = setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      this.isDarkMode = false;
    } else {
      this.isDarkMode = true;
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-profile-wrapper')) {
      this.profileMenuOpen = false;
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}
