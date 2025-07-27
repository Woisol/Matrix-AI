import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { TopBarComponent } from "./pages/components/top-bar/top-bar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NzLayoutModule, NzMenuModule, TopBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { }
