import { Injectable } from '@angular/core';
import * as PIXI from 'pixi.js';
import { Menu } from '../classes/menu/menu';
import { ResizeService } from './resize.service';
import { MainMenu } from '../classes/menu/main-menu';
import { FansMenu } from '../classes/menu/fans-menu';
import { ScrollMenu } from '../classes/menu/scroll-menu';
import { UnsureMenu } from '../classes/menu/unsure-menu';
import { PageService } from './page.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

    public static styles: PIXI.TextStyle[] = [];
    public app: PIXI.Application;
    private arrowTexture: PIXI.Texture;
    public arrowContainer: PIXI.Container;
    public textContainer: PIXI.Container;
    public menuContainer: PIXI.Container;
    public homeContainer: PIXI.Container;
    public design: IPageObj;
    public photo: IPageObj;
    // public photoContainer: PIXI.Container;
    // public designContainer: PIXI.Container;
    public menus: IMenuClass[] = [];

    private styles: PIXI.TextStyleOptions[] = [
        {
            fontSize: 97,
            align: 'center'
        },
        {
            fontSize: 48,
            wordWrap: true,
            wordWrapWidth: 300
        },
        {
            fontSize: 42,
            align: 'center'
        },
        {
            fontSize: 32,
            wordWrap: true,
            wordWrapWidth: 200
        },
        {
            fill: '#ffffff',
            fontSize: 48,
            wordWrap: true,
            wordWrapWidth: 200
        },
        {
            fill: '#ffffff',
            fontSize: 42,
            wordWrap: true,
            wordWrapWidth: 200
        },
        {
            fill: '#ffffff',
            fontSize: 32,
            wordWrap: true,
            wordWrapWidth: 200
        },
        {
            fill: '#ffffff',
            fontSize: 48,
            wordWrap: true,
            wordWrapWidth: 300,
            dropShadow: true,
            dropShadowColor: 0xFFFFFF,
            dropShadowDistance: 0,
            dropShadowBlur: 19
        }
    ];

    constructor(private resizeService: ResizeService) {

    }

    static getCurve(originalScale, desiredScale, desiredTime, scalePower) {
        if (originalScale === 0)
            return desiredScale * Math.pow(desiredTime, -scalePower);
        return ((Math.pow(originalScale, -1) * desiredScale - 1) * Math.pow(desiredTime, -scalePower)) / Math.pow(originalScale, -1);
    }

    static createShadow(graphics: PIXI.Graphics, width: number, height: number, alpha = 0.5): PIXI.Sprite {
        const texture = graphics.generateCanvasTexture();
        const spriteShadow = new PIXI.Sprite(texture);
        spriteShadow.tint = 0x000000;
        spriteShadow.alpha = alpha;
        spriteShadow.width = width;
        spriteShadow.height = height;
        const shadowBlur = new PIXI.filters.BlurFilter();
        shadowBlur.blur = 40;
        spriteShadow.filters = [shadowBlur];
        return spriteShadow;
    }

    public init() {
        if (!this.app) {
            console.log('init');
            this.app = new PIXI.Application({
                autoResize: true,
                resolution: devicePixelRatio,
                antialias: true
            });
            document.body.appendChild(this.app.view);

            this.styles.forEach(s => {
                const style = new PIXI.TextStyle(s);
                style.fontFamily = 'Ludicrous';
                CanvasService.styles.push(style);
            });
            this.arrowTexture = PIXI.Texture.fromImage('assets/arrowHead.png');
            this.arrowContainer = new PIXI.Container();
            this.textContainer = new PIXI.Container();
            this.menuContainer = new PIXI.Container();
            this.homeContainer = new PIXI.Container();
            this.homeContainer.addChild(this.textContainer);
            this.homeContainer.addChild(this.arrowContainer);
        }
        return this.app;
    }

    public positionText(text: PIXI.Text, x, y) {
        text.position.set(x, y);
    }
    /*
    public createMenu(type: MenuType.circle, radius: number, b: any): PIXI.Sprite;
    public createMenu(type: MenuType.triangle | MenuType.unsure,
        point: { x: number, y: number }, end: { x: number, y: number }): PIXI.Sprite;*/
    public createMenus() {
        this.menus.push(
            new MainMenu(this.menuContainer, this.resizeService),
            new FansMenu(this.menuContainer, this.resizeService),
            // new ScrollMenu(this.menuContainer, this.resizeService),
            new UnsureMenu(this.menuContainer, this.resizeService),
        );
    }

    public createArrow(graphics: PIXI.Graphics, startX: number, startY: number, curveX: number, curveY: number,
        finalX: number, finalY: number, rotation = 0) {
        graphics.moveTo(startX, startY);
        graphics.quadraticCurveTo(curveX, curveY, finalX, finalY);
        const arrowHead = new PIXI.Sprite(this.arrowTexture);
        arrowHead.anchor.set(0.2, 0.5);
        arrowHead.position.set(finalX, finalY);
        arrowHead.rotation = rotation;
        this.arrowContainer.addChild(arrowHead);
    }

    public destroy() {
        const canvas = document.body.getElementsByTagName('canvas')[0];
        document.body.removeChild(canvas);
        this.app.destroy();
        this.app = null;
    }
}
export enum Styles {
    extraLarge, large, medium, small, largeWhite, mediumWhite, smallWhite, largeWhiteBlur
}
export enum MenuType {
    'fans', 'scroll', 'menu', 'unsure'
}
export interface IMenu {
    type: MenuType;
    pointTo: number | { x: number, y: number };
    end?: number | { x: number, y: number };
    position: () => { x: number, y: number };
    anchor: { x: number, y: number };
    // sprite?: PIXI.Sprite;
}
export interface IText {
    text: string;
    style: Styles;
    position: () => { x: number, y: number };
    anchor: {
        x: number;
        y: number;
    };
    rotation: number;
    element?: PIXI.Text;
}
export interface IMenuClass {
    sprite: PIXI.Sprite;
    position: { x: number, y: number };
    currentIndex: number;
    isOpen: boolean;
    open: () => void;
    close: () => void;
}
interface IPageObj {
    container: PIXI.Container;
    background: PIXI.Container;
    foreground: PIXI.Container;
    open: BehaviorSubject<boolean>;
}