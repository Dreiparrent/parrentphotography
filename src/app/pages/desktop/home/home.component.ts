import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResizeService } from 'src/app/shared/services/resize.service';
import { CanvasService, IText, Styles, MenuType, IMenu } from 'src/app/shared/services/canvas.service';
import { Subscription } from 'rxjs';
import { Menu } from 'src/app/shared/classes/menu/menu';
import { environment } from 'src/environments/environment.prod';
import * as gsap from 'gsap';
import { MainMenu } from 'src/app/shared/classes/menu/main-menu';
import { PageService } from 'src/app/shared/services/page.service';
import { ScrollMenu } from 'src/app/shared/classes/menu/scroll-menu';
declare var TweenLite: typeof gsap.TweenLite;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {

    private sizeSub: Subscription;
    private text: IText[] = [
        {
            text: 'Andrei Parrent',
            style: Styles.extraLarge,
            position: () => {
                return { // Name
                    x: this.resizeService.positions.halfWidth, y: this.resizeService.positions.halfHeight
                };
            },
            anchor: { x: 0.5, y: 0.5 },
            rotation: 0
        },
        {
            text: 'My Name',
            style: Styles.medium,
            anchor: { x: -0.2, y: 4 },
            position: () => {
                return { // Name
                    x: this.resizeService.positions.halfWidth, y: this.resizeService.positions.halfHeight
                };
            },
            rotation: 0
        },
        {
            text: 'Scroll up to see photography',
            style: Styles.large,
            anchor: { x: 2, y: 1 },
            position: () => {
                return { // Name
                    x: this.resizeService.positions.innerWidth + (window.innerWidth / 30),
                    y: this.resizeService.positions.halfHeight
                };
            },
            rotation: 0.5
        },
        {
            text: 'Scroll down to see design',
            style: Styles.large,
            anchor: { x: 2, y: 0 },
            position: () => {
                return { // Name
                    x: this.resizeService.positions.innerWidth + (window.innerWidth / 30),
                    y: this.resizeService.positions.halfHeight
                };
            },
            rotation: -0.5
        },
        {
            text: 'This is a menu',
            style: Styles.medium,
            anchor: { x: -0.2, y: 5 },
            position: () => {
                return { // Name
                    x: 0, y: this.resizeService.positions.halfHeight
                };
            },
            rotation: 0.5
        },
        {
            text: 'For my fans',
            style: Styles.medium,
            anchor: { x: 0, y: -0.1 },
            position: () => {
                return { // Name
                    x: 300, y: 0
                };
            },
            rotation: 0
        },
        {
            text: 'Click here if you\'re unsure',
            style: Styles.small,
            anchor: { x: 0, y: 2.5 },
            position: () => {
                return { // Name
                    x: 0, y: this.resizeService.positions.innerHeight
                };
            },
            rotation: 0.55
        },
    ];
    private menuText = {
        design: [
            'Open Garage',
            'Working Men\'s',
            'Savvy Savings',
            'Sourcerer'
        ],
        photo: [
            'All Photos',
            'Client Photos',
            'Portfolio'
        ],
        contact: [
            'Email',
            'LinkedIn',
            'GitHub'
        ]
    };
    private app: PIXI.Application;
    private tilingSprite: PIXI.Sprite;
    private graphics: PIXI.Graphics;

    get arrows() {
        return [
            { // Fans
                sX: 280,
                sY: 30,
                cX: 250,
                cY: 38,
                eX: 210,
                eY: 25,
                r: 0.1
            },
            { // Menu
                sX: 180,
                sY: this.resizeService.positions.halfHeight - 100,
                cX: 160,
                cY: this.resizeService.positions.halfHeight - 55,
                eX: 80,
                eY: this.resizeService.positions.halfHeight - 35,
                r: -0.2
            },
            { // Unsure
                sX: 130,
                sY: this.resizeService.positions.innerHeight - 50,
                cX: 105,
                cY: this.resizeService.positions.innerHeight - 55,
                eX: 70,
                eY: this.resizeService.positions.innerHeight - 30,
                r: -0.5
            },
            { // My Name
                sX: this.resizeService.positions.halfWidth + 50,
                sY: this.resizeService.positions.halfHeight - 150,
                cX: this.resizeService.positions.halfWidth - 15,
                cY: this.resizeService.positions.halfHeight - 110,
                eX: this.resizeService.positions.halfWidth - 20,
                eY: this.resizeService.positions.halfHeight - 50,
                r: -1.4
            },
            { // Scroll Up
                sX: this.resizeService.positions.innerWidth - 250,
                sY: this.resizeService.positions.halfHeight - 300,
                cX: this.resizeService.positions.innerWidth - 150,
                cY: this.resizeService.positions.halfHeight / 2,
                eX: this.resizeService.positions.innerWidth - 150,
                eY: 30,
                r: 1.6
            },
            { // Scroll Up Menu
                sX: this.resizeService.positions.innerWidth - 200,
                sY: this.resizeService.positions.halfHeight - 170,
                cX: this.resizeService.positions.innerWidth - 200,
                cY: this.resizeService.positions.halfHeight - 120,
                eX: this.resizeService.positions.innerWidth - 150,
                eY: this.resizeService.positions.halfHeight - 100,
                r: -2.7
            },
            { // Scroll Down
                sX: this.resizeService.positions.innerWidth - 270,
                sY: this.resizeService.positions.halfHeight + 300,
                cX: this.resizeService.positions.innerWidth - 320,
                cY: this.resizeService.positions.innerHeight - 90,
                eX: this.resizeService.positions.innerWidth - 300,
                eY: this.resizeService.positions.innerHeight - 30,
                r: -1.8
            },
            { // Scroll Down Menu
                sX: this.resizeService.positions.innerWidth - 180,
                sY: this.resizeService.positions.halfHeight + 250,
                cX: this.resizeService.positions.innerWidth - 90,
                cY: this.resizeService.positions.halfHeight + 255,
                eX: this.resizeService.positions.innerWidth - 80,
                eY: this.resizeService.positions.halfHeight + 180,
                r: 1.8
            }
        ];
    }

    constructor(private resizeService: ResizeService, private canvasService: CanvasService, private pageService: PageService) {
        const scripts = [
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.2/TweenLite.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.2/plugins/PixiPlugin.min.js'
        ];
        scripts.forEach(s => {
            const sc = document.createElement('script');
            sc.src = s;
            document.head.appendChild(sc);
        });
        this.app = this.canvasService.init();

        const texture = PIXI.Texture.fromImage('assets/grid.png');
        this.tilingSprite = new PIXI.extras.TilingSprite(texture, this.app.screen.width, this.app.screen.height);
        this.app.stage.addChild(this.tilingSprite);
    }

    ngOnInit() {
        this.graphics = new PIXI.Graphics();
        this.text.forEach(t => {
            const txt = new PIXI.Text(t.text, CanvasService.styles[t.style]);
            txt.anchor.set(t.anchor.x, t.anchor.y);
            txt.rotation = t.rotation;
            // this.app.stage.addChild(txt);
            this.canvasService.textContainer.addChild(txt);
            t.element = txt;
        });
        this.canvasService.homeContainer.addChild(this.canvasService.textContainer);
        this.canvasService.createMenus();
        this.canvasService.menus.push(
            new ScrollMenu(this.canvasService.menuContainer, this.resizeService, this.pageService)
        );
        this.pageService.init();
        this.app.stage.addChild(this.canvasService.homeContainer);
        this.canvasService.homeContainer.addChild(this.canvasService.arrowContainer);
        // this.menus[MenuType.menu].menu = new MainMenu(0, 0, 0, 0);
        this.addBlocks();
        this.sizeSub = this.resizeService.onResize$.subscribe(this.resizeCanvas.bind(this));
        this.resizeCanvas();
        // this.canvasService.MainMenu = new Menu(this.canvasService, this.menus[MenuType.menu].sprite);
    }

    addBlocks() {
        this.canvasService.arrowContainer.removeChildren();
        this.app.stage.removeChild(this.canvasService.menuContainer);
        // this.app.stage.removeChild(this.canvasService.menuContainer);
        // this.canvasService.menuContainer.removeChildren();
        this.graphics.lineStyle(5, 0x000000, 1);
        this.arrows.forEach(a => {
            this.canvasService.createArrow(this.graphics, a.sX, a.sY, a.cX, a.cY, a.eX, a.eY, a.r);
        });
        // this.canvasService
        this.canvasService.arrowContainer.addChild(this.graphics);
        // this.app.stage.addChild(this.graphics);
        this.graphics.lineStyle(0);
        this.app.stage.addChild(this.canvasService.menuContainer);

        // this.app.stage.addChild(this.canvasService.menuContainer);
        // this.app.stage.addChild(this.canvasService.menuContainer);
    }

    setText() {
        this.text.forEach((t, i) => {
            this.canvasService.positionText(t.element, t.position().x, t.position().y);
        });
    }

    resizeCanvas() {
        this.app.renderer.resize(this.resizeService.positions.innerWidth, this.resizeService.positions.innerHeight);
        this.tilingSprite.width = this.resizeService.positions.innerWidth;
        this.tilingSprite.height = this.resizeService.positions.innerHeight;
        this.setText();
        this.graphics.clear();
        this.addBlocks();
    }

    ngOnDestroy(): void {
        if (this.sizeSub)
            this.sizeSub.unsubscribe();
        this.canvasService.destroy();
    }
}