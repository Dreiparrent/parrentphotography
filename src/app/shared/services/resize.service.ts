import { EventManager } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {
    private resizeSubject: Subject<Window>;
    get onResize$(): Observable<Window> {
        return this.resizeSubject;
    }

    constructor(private eventManager: EventManager) {
        this.resizeSubject = new Subject();
        this.eventManager.addGlobalEventListener('window', 'resize', this.onResize.bind(this));
    }

    private onResize(event: UIEvent) {
        this.resizeSubject.next(<Window>event.target);
    }
}
