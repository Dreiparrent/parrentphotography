import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import * as PIXI from 'pixi.js';
import { ResizeService } from './shared/services/resize.service';
import { Subscription } from 'rxjs';
import { CanvasService, Styles } from './shared/services/canvas.service';
import { PageService } from './shared/services/page.service';
import { ScrollMenu } from './shared/classes/menu/scroll-menu';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    private currentW = 801;

    constructor(private resizeService: ResizeService, private router: Router) {
        this.resizeService.onResize$.subscribe(this.resize.bind(this));
        this.resize();
    }
    ngOnInit(): void {
    }

    resize() {
        if (this.resizeService.positions.innerWidth > 800)
            this.router.navigate(['home']);
        if (this.resizeService.positions.innerWidth < 800 && this.currentW > 800)
            this.router.navigate(['/']);
    }

}
