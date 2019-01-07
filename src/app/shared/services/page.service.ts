import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef, EmbeddedViewRef } from '@angular/core';
import { CanvasService, MenuType } from './canvas.service';
import { ScrollMenu } from '../classes/menu/scroll-menu';
import { ResizeService } from './resize.service';
import { BehaviorSubject } from 'rxjs';
import { PhotographyComponent } from 'src/app/pages/desktop/photography/photography.component';
import { DesignComponent } from 'src/app/pages/desktop/design/design.component';

declare var TweenLite: typeof gsap.TweenLite;

@Injectable({
  providedIn: 'root'
})
export class PageService {

    public photography: PIXI.Container;

    public scrollMenu: ScrollMenu;
    private _scrollIndex = new BehaviorSubject(0);
    private hider;

    get scrollIndex() {
        return this._scrollIndex.getValue();
    }
    set scrollIndex(i: number) {
        this._scrollIndex.next(i);
    }

    constructor(private canvasService: CanvasService, private resizeService: ResizeService,
        private compFact: ComponentFactoryResolver, private appRef: ApplicationRef, private injector: Injector) {
        this.scrollMenu = canvasService.menus[MenuType.scroll] as ScrollMenu;
        document.addEventListener('wheel', this.onScroll.bind(this));
    }

    public init() {
        /*
        const scrollComponents = [
            this.compFact.resolveComponentFactory(PhotographyComponent).create(this.injector),
            this.compFact.resolveComponentFactory(DesignComponent).create(this.injector)
        ];
        scrollComponents.forEach(c => {
            this.appRef.attachView(c.hostView);
            const domElem = (c.hostView as EmbeddedViewRef<PhotographyComponent | DesignComponent>).rootNodes[0] as HTMLElement;
            document.body.appendChild(domElem);
        });
        */
    }
    /*
    public open = (up = false) => {
        if (this.isOpen)
            return;
        if (!this._isInit)
            this.init();
        console.log('test');
        TweenLite.to(this.designBG, 0.5, { rotation: 0 });
        setTimeout(() => {
            this.designBG.position.set(this.resizeService.positions.innerWidth * 1.5, this.resizeService.positions.halfHeight);
            this.designBG.rotation = 1;
            this._isOpen = false;
        }, 2500);
    }*/

    public onScroll(e: WheelEvent) {
        const prevIndex = this.scrollIndex;
        if (e.deltaY < 0)
            this.scrollIndex += 1;
        else
            this.scrollIndex -= 1;
        if (this.scrollIndex > 0) {
            /*
            TweenLite.to(this.canvasService.photo.background, 0.25, { alpha: 1 });
            TweenLite.to(this.canvasService.photo.background.children, 0.5, { rotation: 0 });
            // TweenLite.to(this.canvasService.menuContainer, 1, { pixi: { saturation: 0 } });
            */
            clearTimeout(this.hider);
            TweenLite.to(this.canvasService.homeContainer, 0.5, { x: 250, y: this.resizeService.positions.innerHeight });
            this.canvasService.photo.open.next(true);
            this.canvasService.design.open.next(false);
            this.scrollIndex = 1;
        } else if (this.scrollIndex < 0) {
            clearTimeout(this.hider);
            TweenLite.to(this.canvasService.homeContainer, 0.5, { x: 250, y: -this.resizeService.positions.innerHeight });
            this.canvasService.design.open.next(true);
            this.canvasService.photo.open.next(false);
            this.scrollIndex = -1;
            /*

            this.scrollIndex = -1;
            setTimeout(() => {
                this.canvasService.design.open.next(true);
            }, 500);
            this.canvasService.menuContainer.children.forEach(c => {
                // TweenLite.to(c, 0.5, { pixi: { colorize: '#B24200', colorizeAmount: 0.5 } });
                // TweenLite.to(c, 0.5, { pixi: { hue: 180 } });
            });
            */
        } else {
            clearTimeout(this.hider);
            this.canvasService.photo.open.next(false);
            this.canvasService.design.open.next(false);
            this.hider = setTimeout(() => {
                TweenLite.to(this.canvasService.homeContainer, 0.5, { x: 0, y: 0 });
                TweenLite.to(this.canvasService.photo.background.children, 0.5, { rotation: 1 });
                TweenLite.to(this.canvasService.design.background.children, 0.5, { rotation: -1 });
            }, 300);
            /*
            this.canvasService.design.open.next(false);
            this.canvasService.photo.open.next(false);
            TweenLite.to(this.canvasService.photo.background.children, 0.5, { rotation: 1 });
            TweenLite.to(this.canvasService.design.background.children, 0.5, { rotation: -1 });
            clearTimeout(this.hider);
            this.hider = setTimeout(() => {
                // if (prevIndex < this.scrollIndex)
                TweenLite.to(this.canvasService.design.background, 0.25, { alpha: 0 });
                // else
                TweenLite.to(this.canvasService.photo.background, 0.25, { alpha: 0 });
            }, 500);
            this.scrollIndex = 0;
            */
        }
        /*
        this.canvasService.homeContainer.children.forEach((c: PIXI.Container) => {
            TweenLite.to(c.children, 2, { position: { x: 500, y: 500 } });
        });
        */
    }
    /*
    public onScroll(e: WheelEvent) {
        if (e.deltaY > 0)
            console.log('down');
        else console.log('up');

        this.open(e.deltaY < 0);
        // TODO: Annnd stop here because the scoll position and such should be handled by a service
        // TODO: add a bit to move the text with it;
    }
    */
}
