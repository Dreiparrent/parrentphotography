import { EventManager } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {
    private resizeSubject: Subject<Window>;
    public positions = { innerWidth: 0, innerHeight: 0, halfWidth: 0, halfHeight: 0 };
    get onResize$(): Observable<Window> {
        return this.resizeSubject;
    }

    constructor(private eventManager: EventManager) {
        this.resizeSubject = new Subject();
        this.eventManager.addGlobalEventListener('window', 'resize', this.onResize.bind(this));
        this.onResize();
    }

    private onResize(event?: UIEvent) {
        this.positions = {
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            halfWidth: window.innerWidth / 2,
            halfHeight: window.innerHeight / 2
        };
        if (event)
            this.resizeSubject.next(<Window>event.target);
    }
}
