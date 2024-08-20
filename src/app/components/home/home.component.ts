import { Component, OnInit } from '@angular/core';
import { BandService } from '../../services/band.service';
import { CommonModule } from '@angular/common';
import { AppBarComponent } from '../../components/app-bar/app-bar.component';
import { DurationPipe } from '../../pipes/duration.pipe';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AppBarComponent, DurationPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  artist: any;
  albums: any[] = [];
  topTracks: any[] = [];
  selectedAlbum: any;
  selectedAlbumTracks: any[] = [];
  selectedTrack: any = null;
  filteredAlbums: any[] = [];
  public audio: HTMLAudioElement | null = null;

  constructor(private bandService: BandService) { }

  ngOnInit(): void {
    this.loadArtistInfo();
    this.loadAlbums();
    this.loadTopTracks();

    this.bandService.getAlbums('7Ln80lUS6He07XvHI8qqHH').subscribe((data: any) => {
      this.albums = data.items.sort((a: any, b: any) => {
        const yearA = this.getReleaseYear(a.release_date);
        const yearB = this.getReleaseYear(b.release_date);
        return yearA - yearB;
      });
      this.filteredAlbums = [...this.albums];
      if (this.albums.length > 0) {
        this.showTracks(this.albums[0]);
      }
    });
  }

  loadArtistInfo() {
    const artistId = '7Ln80lUS6He07XvHI8qqHH';
    this.bandService.getArtistInfo(artistId).subscribe((data: any) => {
      this.artist = data;
    });
  }

  loadAlbums() {
    const artistId = '7Ln80lUS6He07XvHI8qqHH';
    this.bandService.getAlbums(artistId).subscribe((data: any) => {
      this.albums = data.items.sort((a: any, b: any) => {
        const yearA = this.getReleaseYear(a.release_date);
        const yearB = this.getReleaseYear(b.release_date);
        return yearA - yearB;
      });
    });
  }

  getReleaseYear(date: string): number {
    if (date.length === 4) {
      return parseInt(date, 10);
    } else if (date.length === 7) {
      return parseInt(date.substring(0, 4), 10);
    } else if (date.length === 10) {
      return parseInt(date.substring(0, 4), 10);
    }
    return 0;
  }

  filterAlbums(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredAlbums = this.albums.filter(album =>
      album.name.toLowerCase().includes(searchTerm)
    );
  }

  loadTopTracks() {
    const artistId = '7Ln80lUS6He07XvHI8qqHH';
    this.bandService.getTopTracks(artistId).subscribe((data: any) => {
      this.topTracks = data.tracks;
    });
  }

  showTracks(album: any) {
    this.selectedAlbum = album;
    this.selectedTrack = null;
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    this.bandService.getAlbumTracks(album.id).subscribe((data: any) => {
      this.selectedAlbumTracks = data.items;
    });
  }

  currentTrack(track: any) {
    this.selectedTrack = track;
  }

  playTrack(track: any, event?: Event) {
    if (this.selectedTrack !== track) {
      if (this.audio) {
        this.audio.pause();
      }
      this.selectedTrack = track;
      this.audio = new Audio(track.preview_url);
      this.audio.play();
    } else if (this.audio && this.audio.paused) {
      this.audio.play();
    }

    if (event) {
      event.stopPropagation();
    }
  }

  pauseTrack(event: Event) {
    event.stopPropagation();
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
  }

  stopTrack(event: Event) {
    event.stopPropagation();
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.selectedTrack = null;
      this.audio = null;
    }
  }

  adjustVolume(event: any) {
    if (this.audio) {
      this.audio.volume = event.target.value;
    }
  }
}