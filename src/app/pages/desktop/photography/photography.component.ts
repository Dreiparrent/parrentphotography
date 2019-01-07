import { Component, OnInit, OnDestroy } from '@angular/core';
import { CanvasService } from 'src/app/shared/services/canvas.service';
import { ResizeService } from 'src/app/shared/services/resize.service';
import { PageService } from 'src/app/shared/services/page.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { DesktopPage } from 'src/app/shared/classes/page/desktop';

@Component({
  selector: 'app-photography',
  templateUrl: './photography.component.html',
  styleUrls: ['./photography.component.css']
})
export class PhotographyComponent extends DesktopPage implements OnInit, OnDestroy {

    public backgroundImage: PIXI.Sprite;

    constructor(resizeService: ResizeService, canvasService: CanvasService) {
        super(resizeService, canvasService);
        /*
        this.container = new PIXI.Container;
        this.bgContainer = new PIXI.Container;
        this.fgContainer = new PIXI.Container;
        this.bgContainer.alpha = 0;
        this.container.addChild(this.bgContainer);
        this.container.addChild(this.fgContainer);
        this.canvasService.app.stage.addChild(this.container);
        */
        this.canvasService.photo = {
            container: this._container,
            background: this._bgContainer,
            foreground: this._fgContainer,
            open: this._isOpen
        };
    }

    ngOnInit() {
        let texture = PIXI.Texture.fromImage('assets/mcb.jpg');
        // console.log(texture.width, texture.height);
        this.backgroundImage = new PIXI.Sprite(texture);
        console.log(this.backgroundImage.width, this.backgroundImage.height);
        console.log(this.backgroundImage.getBounds());
        const multiplier = this.resizeService.positions.innerHeight / this.backgroundImage.height; // * this.backgroundImage.width;
        // this.backgroundImage.height = this.resizeService.positions.innerHeight;
        // this.backgroundImage.width = this.resizeService.positions.innerHeight;
        console.log(multiplier);
        // this.backgroundImage.width = this.background.width; // * multiplier;
        // this.backgroundImage.height = this.resizeService.positions.innerHeight;
        // this.backgroundImage.anchor.set(1.5, 0.5);
        // this.backgroundImage.rotation = 1;
        // this.backgroundImage.anchor.set(2, 0.5);
        // this.container.addChild(this.backgroundImage);
        const graphics = new PIXI.Graphics;
        graphics.moveTo(0, 0);
        graphics.beginFill(0x000000, 0.7);
        // graphics.beginFill(0x3D6999, 0.7);
        graphics.drawRect(0, 0, this.resizeService.positions.innerWidth, this.resizeService.positions.innerHeight);
        graphics.endFill();
        texture = graphics.generateCanvasTexture();
        this._background = new PIXI.Sprite(texture);
        this._background.anchor.set(1.5, 0.5);
        this._background.rotation = 1;
        this._bgContainer.addChild(this._background);

        this._resize();
    }

    init() {
        this._isInit = true;
    }
    /*
    resize() {
        this.canvasService.app.stage.removeChild(this.container);
        this.canvasService.app.stage.removeChild(this.canvasService.menuContainer);
        // TODO: resize not working
        this.backgroundImage.width = this.resizeService.positions.innerWidth;
        this.backgroundImage.height = this.resizeService.positions.innerHeight;
        // this.backgroundImage.position.set(this.resizeService.positions.innerWidth * 1.5, this.resizeService.positions.halfHeight);
        this.background.width = this.resizeService.positions.innerWidth;
        this.background.height = this.resizeService.positions.innerHeight;
        this.background.position.set(this.resizeService.positions.innerWidth * 1.5, this.resizeService.positions.halfHeight);
        // this.backgroundImage.position.set(0, 0);
        // this.background.position.set(this.resizeService.positions.innerWidth * 1.5, this.resizeService.positions.halfHeight);
        this.canvasService.app.stage.addChild(this.container);
        this.canvasService.app.stage.addChild(this.canvasService.menuContainer);
    }
    */

    open = () => {
        if (!this._isInit)
            this.init();
    }

    close = () => {

    }
    ngOnDestroy(): void {
        if (this._subscription)
            this._subscription.unsubscribe();
    }

}
