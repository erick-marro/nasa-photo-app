import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotosPageComponent } from './pages/photos-page/photos-page.component';
import { PhotoDetailComponent } from './pages/photo-detail/photo-detail.component';

const routes: Routes = [
    {
        path: '',
        component: PhotosPageComponent
    },
    {
        path: 'photos/:id',
        component: PhotoDetailComponent
    },
    {
        path: 'photos',
        redirectTo: '',
        pathMatch: 'full'
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotosRoutingModule { }
