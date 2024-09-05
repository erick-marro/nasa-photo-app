import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarOptionComponent } from './navbar-option/navbar-option.component';



@NgModule({
  declarations: [
    NavbarComponent,
    NavbarOptionComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
