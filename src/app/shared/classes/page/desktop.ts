import { ResizeService } from '../../services/resize.service';
import { CanvasService } from '../../services/canvas.service';
import * as GSAP from 'gsap';
import { Subscription, BehaviorSubject } from 'rxjs';

declare var TweenLite: typeof gsap.TweenLite;
declare var Power2: typeof gsap.Power2;

export class DesktopPage {
    protected _subscription: Subscription;
    protected _isInit = false;
    private _timer;

    protected _isOpen = new BehaviorSubject(false);
    public get isOpen() {
        return this._isOpen.getValue();
    }
    protected open: () => void;
    protected close: () => void;

    protected _animations: GSAP.TweenLite[];

    protected _bgContainer: PIXI.Container;
    protected _container: PIXI.Container;
    protected _fgContainer: PIXI.Container;

    protected _background: PIXI.Sprite;

    constructor(protected resizeService: ResizeService, protected canvasService: CanvasService) {
        this._container = new PIXI.Container;
        this._bgContainer = new PIXI.Container;
        this._fgContainer = new PIXI.Container;
        this._bgContainer.alpha = 0;
        this._container.addChild(this._bgContainer);
        this._container.addChild(this._fgContainer);
        this._subscription = this.resizeService.onResize$.subscribe(this._resize.bind(this));
        this._isOpen.subscribe(this._open.bind(this));
    }

    _resize() {
        this.canvasService.app.stage.removeChild(this._container);
        this.canvasService.app.stage.removeChild(this.canvasService.menuContainer);
        this._background.width = this.resizeService.positions.innerWidth;
        this._background.height = this.resizeService.positions.innerHeight;
        this._background.position.set(this.resizeService.positions.innerWidth * 1.5, this.resizeService.positions.halfHeight);
        // this.backgroundImage.position.set(0, 0);
        // this.background.position.set(this.resizeService.positions.innerWidth * 1.5, this.resizeService.positions.halfHeight);
        this.canvasService.app.stage.addChild(this._container);
        this.canvasService.app.stage.addChild(this.canvasService.menuContainer);
    }

    _open(isO: boolean) {
        if (isO) {
            clearTimeout(this._timer);
            TweenLite.to(this._bgContainer, 0.25, { alpha: 1 });
            TweenLite.to(this._bgContainer.children, 0.4, { rotation: 0 });
            this._timer = setTimeout(() => {
                this.open();
            }, 250);
        } else this._close();
    }

    _close() {
        if (this._isInit) {
            this.close();
            clearTimeout(this._timer);
            this._timer = setTimeout(this._hide.bind(this), 300);
        }
    }
    private _hide() {
        this._timer = setTimeout(() => {
            TweenLite.to(this._bgContainer, 0.25, { alpha: 0 });
        }, 500);
    }
}