import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authEndpoint = 'https://accounts.spotify.com/authorize';
  private clientId = '77cad8bbb3874edaa49a539bab5eefd4';
  private redirectUri = 'http://localhost:4200/callback';
  private scopes = [
    'user-read-private',
    'user-read-email',
  ];

  constructor() { }

  login() {
    const authUrl = `${this.authEndpoint}?client_id=${this.clientId}
    &redirect_uri=${encodeURIComponent(this.redirectUri)}
    &scope=${encodeURIComponent(this.scopes.join(' '))}
    &response_type=token&show_dialog=true`;
    window.location.href = authUrl;
  }
}
