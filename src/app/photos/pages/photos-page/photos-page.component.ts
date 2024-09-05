import { Component, OnInit } from '@angular/core';
import { NasaApiService } from '../../services/nasaapiservice.service';
import { Item, Media } from '../../interfaces/media.interface';

@Component({
  selector: 'app-photos-page',
  templateUrl: './photos-page.component.html',
  styleUrls: ['./photos-page.component.css']
})
export class PhotosPageComponent implements OnInit {

  media: Item[] = [];
  viewMode: string = 'popular';
  searchQuery: string = '';

  constructor(
    private nasaApiService: NasaApiService
  ) { }

  ngOnInit(): void {
    this.loadImages('popular');
  }

  loadImages(type: string) {
    this.media = [];
    this.viewMode = type;

    if (type === 'popular') {
      this.nasaApiService.fetchPopularImages().subscribe(
        (resp: any) => {
          this.media.push(...resp.collection.items)
        }
      );
    } else if (type === 'trending') {
      this.nasaApiService.fetchTrendingImages().subscribe(
        (resp: any) => {
          this.media.push(...resp.collection.items)
        }
      );
    }
  }

  searchImages() {
    this.media = [];

    if (this.searchQuery.trim() === '') {
      return;
    }

    this.nasaApiService.searchImages(this.searchQuery).subscribe(
      (response: any) => {
        this.media = response.collection.items;
      }
    );
  }

}
