import { Component, OnInit, OnDestroy } from '@angular/core';
import { CanvasService } from 'src/app/shared/services/canvas.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { DesktopPage } from 'src/app/shared/classes/page/desktop';
import { ResizeService } from 'src/app/shared/services/resize.service';
declare var TweenLite: typeof gsap.TweenLite;
declare var Power2: typeof gsap.Power2;
import * as PIXI from 'pixi.js';
import 'pixi-projection';
// declare var delay: typeof gsap.Tw;

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css']
})
export class DesignComponent extends DesktopPage implements OnInit, OnDestroy {

    private boxHeight = 200;
    private mousePosition: { x: number, y: number };
    private hoverSquare: PIXI.Sprite;
    private boxContainer: PIXI.Container;
    private boxArray: PIXI.projection.Sprite2d[] = [];
    private hovering = false;
    private hoverArea: PIXI.Sprite;

    constructor(resizeService: ResizeService, canvasService: CanvasService) {
        super(resizeService, canvasService);
        this._fgContainer.position.y = 200;
        this.canvasService.design = {
            container: this._container,
            background: this._bgContainer,
            foreground: this._fgContainer,
            open: this._isOpen
        };
        this.canvasService.app.stage.addChild(this._container);
        // this._isOpen.subscribe(this.open.bind(this));
    }

    ngOnInit() {
        const graphics = new PIXI.Graphics;
        graphics.moveTo(0, 0);
        graphics.beginFill(0x3D6999, 1);
        // graphics.beginFill(0x146BCC, 1);
        graphics.drawRect(0, 0, this.resizeService.positions.innerWidth, this.resizeService.positions.innerHeight);
        graphics.endFill();
        const texture = graphics.generateCanvasTexture();
        this._background = new PIXI.Sprite(texture);
        this._background.anchor.set(1.5, 0.5);
        this._background.rotation = -1;
        this._bgContainer.addChild(this._background);
        // TODO: Dont make this a service, make it another component to match home component
        // this.container.addChild(this.background); // TODO: this should NOT be in the container
        // this._resize();

        graphics.clear();
        graphics.beginFill(0x000000, 1);
        graphics.drawRect(0, 0, 200, 400);
        graphics.endFill();

        // this.canvasService.app.stage.addChild(graphics);
        this._resize();
        this.addTicker();
    }

    init() {
        const graphics = new PIXI.Graphics;
        graphics.lineStyle(5, 0xFF6B40);
        graphics.moveTo(0, 0);
        graphics.drawRect(0, 0, this.boxHeight, this.boxHeight);
        const texture = graphics.generateCanvasTexture();

        const emptyGraphics = new PIXI.Graphics;
        emptyGraphics.moveTo(0, 0);
        emptyGraphics.drawRect(0, 0, this.boxHeight, this.boxHeight);
        const empty = emptyGraphics.generateCanvasTexture();
        const shadowGraphics = new PIXI.Graphics;
        shadowGraphics.beginFill(0x000000, 0.7);
        shadowGraphics.drawRect(0, 0, this.boxHeight, this.boxHeight);
        shadowGraphics.endFill();
        const row1 = new PIXI.Container;
        const row2 = new PIXI.Container;
        const row3 = new PIXI.Container;
        row1.position.y = 200;
        row2.position.y = this.boxHeight + 200;
        row3.position.y = 2 * this.boxHeight + 200;
        for (let i = 0; i < 6; i++) {
            const box = new PIXI.projection.Sprite2d(texture);
            const shadow = CanvasService.createShadow(shadowGraphics, this.boxHeight + 20, this.boxHeight + 20);
            shadow.position.set(20, 20);
            box.addChild(shadow);
            const sprite = new PIXI.Sprite(empty);
            // sprite.on('mouseover', this.hover.bind(this, box));
            // sprite.on('mouseout', this.unhover.bind(this, box));
            sprite.interactive = true;
            box.addChild(sprite);
            switch (i) {
                case 5:
                    box.position.set(0, 0);
                    row3.addChild(box);
                    break;
                case 3:
                case 4:
                    box.position.set(this.boxHeight * (i - 3) + 0, 0);
                    row2.addChild(box);
                    break;
                default:
                    box.position.set(this.boxHeight * i + 0, 0);
                    row1.addChild(box);
            }
            this.boxArray.push(box);
        }
        this.boxContainer = new PIXI.Container;
        this.boxContainer.addChild(row1, row2, row3);
        this._fgContainer.addChild(this.boxContainer);
        const hoverGraphics = new PIXI.Graphics;
        hoverGraphics.moveTo(0, 0);
        hoverGraphics.beginFill(0x000000, 0);
        hoverGraphics.lineTo(3 * this.boxHeight, 0);
        hoverGraphics.lineTo(3 * this.boxHeight, this.boxHeight);
        hoverGraphics.lineTo(2 * this.boxHeight, this.boxHeight);
        hoverGraphics.lineTo(2 * this.boxHeight, 2 * this.boxHeight);
        hoverGraphics.lineTo(this.boxHeight, 2 * this.boxHeight);
        hoverGraphics.lineTo(this.boxHeight, 3 * this.boxHeight);
        hoverGraphics.lineTo(0, 3 * this.boxHeight);
        hoverGraphics.lineTo(0, 0);
        hoverGraphics.endFill();
        this.hoverArea = new PIXI.Sprite(hoverGraphics.generateCanvasTexture());
        this.hoverArea.position.x = 175;

        function createSquare(x, y) {
            const square = new PIXI.Sprite(PIXI.Texture.WHITE);
            // square.tint = 0xff0000;
            // square.factor = 1;
            // square.anchor.set(0.5);
            square.position.set(x, y);
            return square;
        }

        const squares = [
            createSquare(175, 0),
            createSquare(375, 0),
            createSquare(375, 200),
            createSquare(175, 200)
        ];
        this.boxArray.forEach((b, i) => {
            squares.push(createSquare(175 + this.boxHeight * i, this.boxHeight * i),
                createSquare(375 + this.boxHeight * i, this.boxHeight * i),
                createSquare(375 + this.boxHeight * i, 200 + this.boxHeight * i),
                createSquare(175 + this.boxHeight * i, 200 + this.boxHeight * i)
            );
        });
        squares.forEach(s => this._fgContainer.addChild(s));
        const quad = squares.map(function (s) { return s.position; });
        this.canvasService.app.ticker.add(() => {
            this.boxArray.forEach(box => {
                box.proj.mapSprite(box, quad);
            });
            // this.boxArray[0].proj.mapSprite(this.boxArray[0], quad);
            // this.boxArray[0].proj.setAxisX(quad[2], 1);
        });
        this.hoverArea.on('mouseover', () => {
            // this.boxArray[0].proj.mapSprite(this.boxArray[0], quad);
            squares[2].y -= 30;
            squares[2].x -= 30;
            squares[0].y += 30;
            squares[0].x += 30;
            console.log(squares[3].y);
            // const gr = new PIXI.Graphics;
        });

        this.hoverArea.on('mousedown', () => {
            console.log('test');
            this.boxArray[0].pivot.x = 20;
            // this.boxArray[0].skew.set(0.1, 0.1);
            // this.boxArray[1].skew.set(0.1, -0.1);
            // this.boxArray[2].skew.set(-0.1, 0.1);
            // this.boxArray[3].skew.set(-0.1, -0.1);
        });
        // this.hoverArea.on('mouseover', () => this.hovering = true);
        this.hoverArea.on('mouseout', this.unhover.bind(this, null));
        this.hoverArea.interactive = true;
        this._fgContainer.addChild(this.hoverArea);
        // TODO: loop these
        // TODO: use shades to color this (pallete or kuler)
        this._isInit = true;
        this._resize();
    }

    open = () => {
        console.log('open', this._fgContainer);
        if (!this._isInit)
            this.init();
        const boxes = (this._fgContainer.children[0] as PIXI.Container).children;
        for (let i = 0; i < boxes.length; i++) {
            TweenLite.to(boxes[i].position, 0.3, { y: i * this.boxHeight, ease: Power2.easeOut, delay: i * 0.05 });
            TweenLite.to(boxes[i], 0.3, { alpha: 1, ease: Power2.easeOut, delay: i * 0.05 });
        }
    }

    close = () => {
        const boxes = (this._fgContainer.children[0] as PIXI.Container).children;
        const max = (boxes.length - 1) * 0.05;
        for (let i = 0; i < boxes.length; i++) {
            TweenLite.to(boxes[i].position, 0.3, { y: i * this.boxHeight + 200, ease: Power2.easeOut, delay: max - i * 0.05 });
            TweenLite.to(boxes[i], 0.3, { alpha: 0, ease: Power2.easeOut, delay: max - i * 0.05 });
        }
    }

    hover(sprite: PIXI.Sprite) {
        this.hoverSquare = sprite;
        // sprite.skew.set(sprite.position.x - this.mousePosition.x, sprite.position.y - this.mousePosition.y);
    }
    unhover(sprite: PIXI.Sprite) {
        this.hoverSquare = null;
        this.hovering = false;
        this.boxArray.forEach(box => box.skew.set(0, 0));
        // sprite.skew.set(0, 0);
    }

    addTicker() {
        this.canvasService.app.ticker.add(delta => {
            const mousePosition = this.canvasService.app.renderer.plugins.interaction.mouse.global;
            this.mousePosition = mousePosition;
            if (this.hovering) {
                const rows = (this._fgContainer.children[0] as PIXI.Container).children as PIXI.Container[];
                rows.forEach((row, i) => {
                    const rowNumber = i + 1;
                    console.log((this.mousePosition.y - row.y - 100));
                    row.children.forEach((box, j) => {
                        box.skew.set((this.mousePosition.x - box.x - 100) / -1000,
                            (this.mousePosition.y - box.y - rowNumber * 300) / -1000);
                    });
                    // row.skew.set((this.mousePosition.x - row.x - 500) / -1000, (this.mousePosition.y - row.y - 300) / -1000);
                });
                /*
                this.boxArray.forEach((box, i) => {
                    box.skew.set((this.mousePosition.x - box.x - 100) / -1000, (this.mousePosition.y - box.y - 300) / -1000);
                });
                */
            }
            /*
            if (this.hoverSquare) {
                // console.log(this.mousePosition.y - 300 - this.hoverSquare.position.y);
                this.hoverSquare.skew.set((mousePosition.x - this.hoverSquare.position.x) / 100,
                    (mousePosition.y - 300 - this.hoverSquare.position.y) / 100);
                // console.log(this.mousePosition.x, this.hoverSquare);
            }
            */
        });
    }

    resize() {

    }

    ngOnDestroy(): void {
        if (this._subscription)
            this._subscription.unsubscribe();
    }

}
