import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  template: '<p>Redirecting...</p>'
})
export class CallbackComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {
    const hash = window.location.hash;
    const token = hash.split('&').find(elem => elem.includes('access_token'))?.split('=')[1];

    if (token) {
      localStorage.setItem('spotifyToken', token);
      this.router.navigate(['/home']);
    } else {
      console.error('Failed to obtain access token');
    }
  }
}
