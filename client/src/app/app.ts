import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNav } from './components/layout/bottom-nav/bottom-nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BottomNav],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}