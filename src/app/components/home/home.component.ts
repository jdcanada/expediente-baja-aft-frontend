import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    RouterModule 
  
    
  ],

})
export class HomeComponent implements AfterViewInit {
  showZoom = false;



  ngAfterViewInit() {
    
  }
}