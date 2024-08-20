import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-fan-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fan-admin.component.html',
  styleUrl: './fan-admin.component.css'
})
export class FanAdminComponent {
  newAlbum = {
    name: '',
    release_date: '',
    image: ''
  };

  addAlbum() {

  }
}
