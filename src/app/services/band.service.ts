import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BandService {
  private apiUrl = 'https://api.spotify.com/v1';
  private token = 'BQCR-tQyOxk83OhvOWKpEUIykZpDkv515sTlfyiMGgBLXImCuxU7YEgzwJYnQjqH5Cg1b_qE-tL2duUGxrLqT-iMkU2rf37WKZc1f6iiWbKFSiLjnSOHXIFXGcv0PBx4ezl6KBbDeJlIGZ7H1GY0nttlyTK6sv1a3jj7p03oBFGchj7YUZAF';
  private refreshToken = 'AQCgeEbdcYqaY_XeuJaM2chSxBm1-3Ou5HNf4a4Sck9-RDKSc4olsZgeaEwChrx3lDKG2T6FdhnOn-hFR-AWxZOg_jjBqXVvFklFsW6GGJtYw2lzZOuWQe8ChamLeKYjDEg';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }

  private refreshAccessToken(): Observable<any> {
    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', this.refreshToken);

    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('your_client_id:your_client_secret'),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('https://accounts.spotify.com/api/token', body.toString(), { headers })
      .pipe(
        catchError(error => {
          console.error('Erro ao renovar o token de acesso', error);
          return throwError(error);
        }),
        switchMap((response: any) => {
          this.token = response.access_token;
          return this.token;
        })
      );
  }

  private handleRequest<T>(request: Observable<T>): Observable<T> {
    return request.pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.refreshAccessToken().pipe(
            switchMap(() => request)
          );
        }
        return throwError(error);
      })
    );
  }

  getTrack(trackId: string): Observable<any> {
    const url = `${this.apiUrl}/tracks/${trackId}`;
    return this.handleRequest(this.http.get(url, { headers: this.getHeaders() }));
  }

  getTopTracks(artistId: string): Observable<any> {
    const url = `${this.apiUrl}/artists/${artistId}/top-tracks?market=US`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getArtistInfo(artistId: string): Observable<any> {
    const url = `${this.apiUrl}/artists/${artistId}`;
    return this.handleRequest(this.http.get(url, { headers: this.getHeaders() }));
  }

  getAlbums(artistId: string): Observable<any> {
    const url = `${this.apiUrl}/artists/${artistId}/albums`;
    return this.handleRequest(this.http.get(url, { headers: this.getHeaders() }));
  }

  getAlbumTracks(albumId: string): Observable<any> {
    const url = `${this.apiUrl}/albums/${albumId}/tracks`;
    return this.handleRequest(this.http.get(url, { headers: this.getHeaders() }));
  }

}
