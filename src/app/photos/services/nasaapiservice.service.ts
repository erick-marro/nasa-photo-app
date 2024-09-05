import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Media } from '../interfaces/media.interface';
import { Observable } from 'rxjs';

const API_URL = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class NasaApiService {

  constructor(
    private http: HttpClient
  ) { }

  fetchPopularImages(): Observable<Media> {
    return this.http.get<Media>(`${API_URL}/search?year_start=2024&media_type=image`);
  }

  fetchTrendingImages(): Observable<any> {
    return this.http.get(`${API_URL}/search?q=orion&media_type=image`);
  }

  searchImages(query: string): Observable<any> {
    return this.http.get(`${API_URL}/search?q=${query}&media_type=image,video`);
  }
}
