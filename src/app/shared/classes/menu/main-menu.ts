import { IMenuClass, CanvasService, Styles } from '../../services/canvas.service';
import { Menu } from './menu';
import { ResizeService } from '../../services/resize.service';
import { PageService } from '../../services/page.service';
declare var TweenLite: typeof gsap.TweenLite;
declare var Power1: typeof gsap.Power1;

export class MainMenu extends Menu implements IMenuClass {

    public mainMenu: PIXI.Sprite;
    public spriteShadow: PIXI.Sprite;
    public mainMenuShadow: PIXI.Sprite;

    private xText: PIXI.Text;
    get position() {
        if (!this._isOpen)
            return {
                x: 0, y: this.resizeService.positions.halfHeight
            };
        else return {
            x: 750, y: this.resizeService.positions.halfHeight
        };
    }
    _anchor = { x: 0, y: 0.5 };

    private menuContent: IMenuContent[] = [
        {
            text: 'Design',
            subText: ['Open Garage', 'Working Men\'s', 'Savvy Savings', 'Sourcerer']
        },
        {
            text: 'Photography',
            subText: ['All Photos', 'Client Photos', 'Portfolio']
        },
        {
            text: 'Contact',
            subText: ['Email', 'LinkedIn', 'GitHub']
        }
    ];

    constructor(container: PIXI.Container, resizeService: ResizeService) {
        super(container, resizeService);
        const graphics = new PIXI.Graphics;
        graphics.moveTo(0, 0);
        graphics.beginFill(0x00FFFF);
        graphics.lineTo(400, 200);
        graphics.lineTo(0, 400);
        graphics.endFill();
        const texture = graphics.generateCanvasTexture();
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.width = 100;
        this.sprite.height = 100;
        this.spriteShadow = CanvasService.createShadow(graphics, 150, 150);
        this.spriteShadow.anchor.set(0, 0.5);
        this.spriteShadow.alpha = 0;
        this.container.addChild(this.spriteShadow);
        this.sprite.on('pointerdown', this.open);
        this._init();
    }

    public init() {
        const graphics = new PIXI.Graphics;
        graphics.moveTo(0, 0);
        graphics.beginFill(0x808080, 0.85);
        graphics.lineTo(400, 200);
        graphics.lineTo(0, 400);
        graphics.endFill();
        const texture = graphics.generateCanvasTexture();
        this.mainMenu = new PIXI.Sprite(texture);
        this.mainMenu.anchor.set(1, 0.5);
        this.mainMenuShadow = CanvasService.createShadow(graphics, 400, 400);
        this.mainMenuShadow.anchor.set(1, 0.5);
        this.container.addChild(this.mainMenuShadow);
        this.container.addChild(this.mainMenu);
        this._resize();
        this._isInit = true;
        this.setText();
    }

    public open = () => {
        if (this.isOpen)
            return;
        if (!this._isInit)
            this.init();
        this.mainMenu.position.set(this.sprite.position.x, this.sprite.position.y);
        this.spriteShadow.position.set(this.sprite.position.x, this.sprite.position.y);
        this.mainMenuShadow.position.set(this.sprite.position.x, this.sprite.position.y);
        // TODO: combine the shadows with objects to create smoother animations
        if (!this._animations) {
            this._animations = [];
            this._animations.push(
                TweenLite.to(this.mainMenu.position, 0.5, { x: 500, y: this.mainMenu.position.y, ease: Power1.easeOut }),
                TweenLite.to(this.mainMenuShadow.position, 0.5, { x: 520, y: this.mainMenu.position.y + 20, ease: Power1.easeOut }),
                TweenLite.to(this.mainMenuShadow, 0.5, { alpha: 0.5, ease: Power1.easeOut }),
                TweenLite.to(this.sprite.position, 0.5, { x: 750, y: this.sprite.position.y, ease: Power1.easeOut }),
                TweenLite.to(this.sprite.scale, 0.5, { x: -1.25, y: 1.25, ease: Power1.easeOut }),
                TweenLite.to(this.spriteShadow.position, 0.5, { x: 800, y: this.sprite.position.y + 50, ease: Power1.easeOut }),
                TweenLite.to(this.spriteShadow.scale, 0.5, { x: -1.30, y: 1.30, ease: Power1.easeOut }),
                TweenLite.to(this.spriteShadow, 0.5, { alpha: 0.5, ease: Power1.easeOut })
            );
        }
        this._animations.forEach(t => t.play());
        setTimeout(() => {
            this.positionText();
            this.menuContent[this.currentIndex].subContainer.visible = true;
        }, 500);
        this.sprite.interactive = this.sprite.buttonMode = false;
        this._isOpen = true;
    }
    public close = () => {
        this.xText.visible = false;
        this.menuContent.forEach(m => {
            m.elem.visible = m.subContainer.visible = false;
        });
        this.sprite.interactive = this.sprite.buttonMode = true;
        this._animations.forEach(t => t.reverse());
        this._isOpen = false;
    }


    private setText() {
        this.xText = new PIXI.Text('x', CanvasService.styles[Styles.small]);
        this.container.addChild(this.xText);
        this.xText.anchor.x = 1.5;
        this.xText.interactive = this.xText.buttonMode = true;
        this.xText.on('pointerdown', this.close.bind(this));
        this.xText.visible = false;
        this.menuContent.forEach((m, i) => {
            const text = new PIXI.Text(m.text, CanvasService.styles[Styles.largeWhite]);
            text.rotation = 0.5;
            text.interactive = text.buttonMode = true;
            text.on('pointerover', () => {
                this.hoverMain(i);
            });
            text.on('pointerout', () => {
                this.unHoverMain(i);
            });
            text.on('click', () => {
                this.clickMain(i);
            });
            m.elem = text;
            this.container.addChild(text);
            const subContainer = new PIXI.Container();
            m.elem.visible = subContainer.visible = false;
            this.container.addChild(subContainer);
            m.subText.forEach(st => {
                const subText = new PIXI.Text(st, CanvasService.styles[Styles.medium]);
                subText.anchor.x = 1.1;
                subText.buttonMode = subText.interactive = true;
                subContainer.addChild(subText);
            });
            m.subContainer = subContainer;
        });
        this.menuContent[this.currentIndex].elem.style = CanvasService.styles[Styles.largeWhiteBlur];
    }

    private positionText() {
        const menuBounds = this.sprite.getBounds();
        const mainMenuBounds = this.mainMenu.getBounds();
        const mainMiddle = mainMenuBounds.y + mainMenuBounds.height / 2;

        this.xText.position.set(menuBounds.x + menuBounds.width, menuBounds.y);
        this.xText.visible = true;

        this.menuContent.forEach((m, i) => {
            m.elem.position.set(mainMenuBounds.x + 50, 50 + mainMenuBounds.y + 70 * i);
            m.elem.visible = true;
            const children = m.subContainer.children;
            const middleCount = children.length / 2;
            children.forEach((c, ii) => {
                c.position.set(menuBounds.x + menuBounds.width, mainMiddle + (ii - middleCount) * 70);
            });
        });
    }

    private hoverMain(i: number) {
        this.menuContent.forEach(m => {
            m.subContainer.visible = false;
        });
        this.menuContent[i].subContainer.visible = true;
    }

    private unHoverMain(i: number) {
        this.menuContent[i].subContainer.visible = false;
        this.menuContent[this.currentIndex].subContainer.visible = true;
    }

    private clickMain(i: number) {
        this.menuContent[i].elem.style = CanvasService.styles[Styles.largeWhiteBlur];
        this.menuContent[this.currentIndex].elem.style = CanvasService.styles[Styles.largeWhite];
        this._currentIndex = i;
    }
}
interface IMenuContent {
    text: string;
    subText: string[];
    elem?: PIXI.Text;
    subContainer?: PIXI.Container;
}