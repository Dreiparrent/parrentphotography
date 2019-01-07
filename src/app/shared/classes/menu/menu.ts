import { environment } from 'src/environments/environment';
import { CanvasService, Styles, MenuType } from '../../services/canvas.service';
import { ResizeService } from '../../services/resize.service';
import * as GSAP from 'gsap';

export class Menu {
    public sprite: PIXI.Sprite;
    public position: { x: number, y: number };
    public _anchor = { x: 0.5, y: 0.5 };

    protected _isInit = false;

    protected _currentIndex = 0;
    public get currentIndex() {
        return this._currentIndex;
    }

    protected _isOpen = false;
    public get isOpen() {
        return this._isOpen;
    }

    protected _animations: GSAP.TweenLite[];

    constructor(protected container: PIXI.Container, protected resizeService: ResizeService) {
        resizeService.onResize$.subscribe(this._resize.bind(this));
    }

    _init() {
        this.sprite.buttonMode = this.sprite.interactive = true;
        this.sprite.anchor.set(this._anchor.x, this._anchor.y);
        this._resize();
        this.container.addChild(this.sprite);
    }

    _resize() {
        this.sprite.position.set(this.position.x, this.position.y);
    }
}