import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotosPageComponent } from './pages/photos-page/photos-page.component';
import { PhotoDetailComponent } from './pages/photo-detail/photo-detail.component';
import { PhotosRoutingModule } from './photos-routing.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PhotosPageComponent,
    PhotoDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PhotosRoutingModule
  ]
})
export class PhotosModule { }
