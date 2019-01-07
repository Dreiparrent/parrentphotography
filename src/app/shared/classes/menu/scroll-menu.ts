import { IMenuClass } from '../../services/canvas.service';
import { ResizeService } from '../../services/resize.service';
import { Menu } from './menu';
import { PageService } from '../../services/page.service';
import { Injectable } from '@angular/core';
declare var TweenLite: typeof gsap.TweenLite;

export class ScrollMenu extends Menu implements IMenuClass {

    get position() {
        return {
            x: 100 + this.resizeService.positions.innerWidth - this.resizeService.positions.innerWidth / 25,
            y: this.resizeService.positions.halfHeight
        };
    }

    _currentIndex: number;

    designBG: PIXI.Sprite; // TODO: Make these some more classes or maybe even a service
    photoBG;

    constructor(container: PIXI.Container, resizeService: ResizeService, pageService: PageService) {
        super(container, resizeService);
        const graphics = new PIXI.Graphics;
        this._currentIndex = pageService.scrollIndex;
        graphics.moveTo(0, 0);
        graphics.beginFill(0x00FFFF);
        graphics.drawCircle(0, 0, 200);
        graphics.endFill();
        const texture = graphics.generateCanvasTexture();
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.on('pointerdown', this.open);
        this._init();
        // document.addEventListener('scroll', this.onScroll.bind(this));
    }

    public open = (up = false) => {
        if (this.isOpen)
            return;
        console.log('test');
        /*
        TweenLite.to(this.designBG.position, 0.75,
            { x: this.resizeService.positions.innerWidth, y: this.resizeService.positions.halfHeight });
            */
        TweenLite.to(this.designBG, 0.5, { rotation: 0 });
        setTimeout(() => {
            this.designBG.position.set(this.resizeService.positions.innerWidth * 1.5, this.resizeService.positions.halfHeight);
            this.designBG.rotation = 1;
            this._isOpen = false;
        }, 2500);
    }

    public close = () => {

    }
}
