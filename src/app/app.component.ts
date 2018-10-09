import { Component, OnInit, OnDestroy } from '@angular/core';
import * as PIXI from 'pixi.js';
import { ResizeService } from './shared/services/resize.service';
import { Subscription } from 'rxjs';
import { CanvasService, Styles } from './shared/services/canvas.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    private sizeSub: Subscription;
    private app: PIXI.Application;
    private tilingSprite: PIXI.extras.TilingSprite;
    private arrowTexture: PIXI.Texture;
    positions = { innerWidth: 0, innerHeight: 0, halfWidth: 0, halfHeight: 0 };

    private text: IText[] = [
        {
            text: 'Andrei Parrent',
            style: Styles.extraLarge,
            anchor: { x: 0.5, y: 0.5 },
            rotation: 0
        },
        {
            text: 'My Name',
            style: Styles.medium,
            anchor: { x: -0.2, y: 4 },
            rotation: 0
        },
        {
            text: 'Scroll up to see photography',
            style: Styles.large,
            anchor: { x: 2, y: 1 },
            rotation: 0.5
        },
        {
            text: 'Scroll down to see design',
            style: Styles.large,
            anchor: { x: 2, y: 0 },
            rotation: -0.5
        },
        {
            text: 'This is a menu',
            style: Styles.medium,
            anchor: { x: -0.2, y: 5 },
            rotation: 0.5
        },
        {
            text: 'For my fans',
            style: Styles.medium,
            anchor: { x: 0, y: -0.1 },
            rotation: 0
        },
        {
            text: 'Click here if you\'re unsure',
            style: Styles.small,
            anchor: { x: 0, y: 2.5 },
            rotation: 0.55
        },
    ];
    private graphics: PIXI.Graphics;
    private arrowContainer: PIXI.Container;

    constructor(private resizeService: ResizeService, private canvasService: CanvasService) {
    }
    ngOnInit(): void {
        this.app = this.canvasService.init();

        const texture = PIXI.Texture.fromImage('assets/grid.png');
        this.tilingSprite = new PIXI.extras.TilingSprite(texture, this.app.screen.width, this.app.screen.height);
        this.app.stage.addChild(this.tilingSprite);
        this.text.forEach(t => {
            const txt = new PIXI.Text(t.text, this.canvasService.styles[t.style]);
            txt.anchor.set(t.anchor.x, t.anchor.y);
            txt.rotation = t.rotation;
            this.app.stage.addChild(txt);
            t.element = txt;
        });
        this.graphics = new PIXI.Graphics();
        this.arrowTexture = PIXI.Texture.fromImage('assets/arrowHead.png');
        this.arrowContainer = new PIXI.Container();
        // this.arrowHead.anchor.set(0.2, 0.5);
        this.addBlocks();
        // resize
        this.sizeSub = this.resizeService.onResize$.subscribe(this.resizeCanvas.bind(this));
        this.resizeCanvas(window);
    }

    setText() {
        const textPositions = [
            { // Name
                x: this.positions.halfWidth, y: this.positions.halfHeight
            },
            { // My Name
                x: this.positions.halfWidth, y: this.positions.halfHeight
            },
            { // Scroll Up
                x: this.positions.innerWidth + (window.innerWidth / 30), y: this.positions.halfHeight
            },
            { // Scroll Down
                x: this.positions.innerWidth + (window.innerWidth / 30), y: this.positions.halfHeight
            },
            { // Menu
                x: 0, y: this.positions.halfHeight
            },
            { // Fans
                x: 300, y: 0
            },
            { // Unsure
                x: 0, y: this.positions.innerHeight
            }
        ];

        this.text.forEach((t, i) => {
            this.positionText(t.element, textPositions[i].x, textPositions[i].y);
        });
    }

    positionText(text: PIXI.Text, x, y) {
        text.position.set(x, y);
    }

    addBlocks() {
        this.arrowContainer.removeChildren();
        this.graphics.lineStyle(0);
        // Fans Circle
        this.graphics.beginFill(0x00FFFF);
        this.graphics.drawCircle(0, 0, 200);
        this.graphics.endFill();
        // Scroll Circle
        this.graphics.beginFill(0x00FFFF);
        this.graphics.drawCircle(100 + this.positions.innerWidth - this.positions.innerWidth / 25,
            this.positions.halfHeight, 180);
        this.graphics.endFill();
        // Menu
        this.graphics.beginFill(0x00FFFF);
        this.graphics.moveTo(0, this.positions.halfHeight - 50);
        this.graphics.lineTo(100, this.positions.halfHeight);
        this.graphics.lineTo(0, this.positions.halfHeight + 50);
        this.graphics.endFill();
        // Unsure
        this.graphics.beginFill(0x00FFFF);
        this.graphics.moveTo(0, this.positions.innerHeight - 150);
        this.graphics.quadraticCurveTo(0, this.positions.innerHeight, 150, this.positions.innerHeight);
        this.graphics.lineTo(0, innerHeight);
        this.graphics.endFill();

        this.graphics.lineStyle(5, 0x000000, 1);

        // Fans
        this.createArrow(280, 30, 250, 38, 210, 35, 0.1);
        // Menu
        this.createArrow(180, this.positions.halfHeight - 100, 160, this.positions.halfHeight - 55,
            80, this.positions.halfHeight - 35, -0.2);
        // Unsure
        this.createArrow(130, this.positions.innerHeight - 50, 105, this.positions.innerHeight - 55,
            70, this.positions.innerHeight - 30, -0.5);
        // My Name
        this.createArrow(this.positions.halfWidth + 50, this.positions.halfHeight - 150,
            this.positions.halfWidth - 15, this.positions.halfHeight - 110,
            this.positions.halfWidth - 20, this.positions.halfHeight - 50, -1.4);
        // Scroll Up
        this.createArrow(this.positions.innerWidth - 250, this.positions.halfHeight - 300,
            innerWidth - 150, this.positions.halfHeight / 2, innerWidth - 150, 30, 1.6);
        // Scroll Up Menu
        this.createArrow(this.positions.innerWidth - 200, this.positions.halfHeight - 170,
            this.positions.innerWidth - 200, this.positions.halfHeight - 120,
            this.positions.innerWidth - 150, this.positions.halfHeight - 100, -2.7);

        // Scroll Down
        this.createArrow(this.positions.innerWidth - 270, this.positions.halfHeight + 300,
            this.positions.innerWidth - 320, this.positions.innerHeight - 90,
            this.positions.innerWidth - 300, this.positions.innerHeight - 30, -1.8);
        // Scroll Down Menu
        this.createArrow(this.positions.innerWidth - 180, this.positions.halfHeight + 250,
            this.positions.innerWidth - 90, this.positions.halfHeight + 255,
            this.positions.innerWidth - 80, this.positions.halfHeight + 180, 1.8);
        this.app.stage.addChild(this.graphics);
        this.app.stage.addChild(this.arrowContainer);
    }

    createArrow(startX: number, startY: number, curveX: number, curveY: number,
        finalX: number, finalY: number, rotation = 0) {
        this.graphics.moveTo(startX, startY);
        this.graphics.quadraticCurveTo(curveX, curveY, finalX, finalY);
        const arrowHead = new PIXI.Sprite(this.arrowTexture);
        arrowHead.anchor.set(0.2, 0.5);
        arrowHead.position.set(finalX, finalY);
        arrowHead.rotation = rotation;
        this.arrowContainer.addChild(arrowHead);
    }

    resizeCanvas(window: Window) {
        this.positions = {
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            halfWidth: window.innerWidth / 2,
            halfHeight: window.innerHeight / 2
        };
        this.app.renderer.resize(this.positions.innerWidth, this.positions.innerHeight);
        this.tilingSprite.width = this.positions.innerWidth;
        this.tilingSprite.height = this.positions.innerHeight;
        this.setText();
        this.graphics.clear();
        this.addBlocks();
        // this.tilingSprite.tilePosition.set(this.app.screen.width, this.app.screen.height);
    }

    ngOnDestroy(): void {
        if (this.sizeSub)
            this.sizeSub.unsubscribe();
    }

}
interface IText {
    text: string;
    style: Styles;
    anchor: {
        x: number;
        y: number;
    };
    rotation: number;
    element?: PIXI.Text;
}