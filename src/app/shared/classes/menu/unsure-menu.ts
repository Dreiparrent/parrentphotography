import { IMenuClass, CanvasService, Styles } from '../../services/canvas.service';
import { ResizeService } from '../../services/resize.service';
import { Menu } from './menu';
import { Subscription } from 'rxjs';
declare var TweenLite: typeof gsap.TweenLite;
declare var Power2: typeof gsap.Power2;

export class UnsureMenu extends Menu implements IMenuClass {

    public unsureMenu: PIXI.Sprite;
    private unsureMenuShadow: PIXI.Sprite;
    private unsureMenuOverlay: PIXI.Sprite;
    private xText: PIXI.Text;
    public subscription: Subscription;

    get position() {
        return {
            x: 0, y: this.resizeService.positions.innerHeight
        };
    }
    public _anchor = { x: 0, y: 1 };

    constructor(container: PIXI.Container, resizeService: ResizeService) {
        super(container, resizeService);
        const graphics = new PIXI.Graphics;
        graphics.moveTo(0, 0);
        graphics.beginFill(0x00FFFF);
        graphics.quadraticCurveTo(0, 150, 150, 150);
        graphics.lineTo(0, 150);
        graphics.endFill();
        const texture = graphics.generateCanvasTexture();
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.on('pointerdown', this.open);
        this._init();
    }

    public init() {
        const graphics = new PIXI.Graphics;
        graphics.moveTo(0, 0);
        graphics.beginFill(0x146BCC);
        graphics.drawRoundedRect(0, 0, this.resizeService.positions.innerWidth, this.resizeService.positions.innerHeight, 200);
        graphics.moveTo(this.resizeService.positions.innerWidth, 0);
        graphics.lineTo(this.resizeService.positions.innerWidth, 200);
        graphics.lineTo(this.resizeService.positions.innerWidth - 200, 0);
        // graphics.lineTo(this.resizeService.positions.innerWidth, this.resizeService.positions.innerHeight);
        graphics.endFill();
        const texture = graphics.generateCanvasTexture();
        this.unsureMenu = new PIXI.Sprite(texture);
        this.unsureMenu.anchor.set(0.5, 0.5);
        this.unsureMenuShadow =
            CanvasService.createShadow(graphics, this.resizeService.positions.innerWidth,
                this.resizeService.positions.innerHeight, 0.3);
        this.unsureMenuShadow.position.set(-this.resizeService.positions.innerWidth, 2 * this.resizeService.positions.innerHeight);
        this.unsureMenu.position.set(-this.resizeService.positions.halfWidth, 2 * this.resizeService.positions.innerHeight);
        const overlayGraphics = new PIXI.Graphics;
        overlayGraphics.beginFill(0x000000, 0.8);
        overlayGraphics.drawRect(0, 0, this.resizeService.positions.innerWidth, this.resizeService.positions.innerHeight);
        overlayGraphics.endFill();
        const overlayTexture = overlayGraphics.generateCanvasTexture();
        this.unsureMenuOverlay = new PIXI.Sprite(overlayTexture);
        this.unsureMenuOverlay.position.y = -this.resizeService.positions.innerHeight;
        this.container.addChild(this.unsureMenuOverlay);
        this.container.addChild(this.unsureMenuShadow);
        this.container.addChild(this.unsureMenu);
        this.setText();
        this.resize();
        this.subscription = this.resizeService.onResize$.subscribe(this.resize.bind(this));
        this._isInit = true;
    }

    private setText() {
        this.xText = new PIXI.Text('x', CanvasService.styles[Styles.small]);
        this.container.addChild(this.xText);
        this.xText.anchor.x = 2;
        this.xText.interactive = this.xText.buttonMode = true;
        this.xText.on('pointerdown', this.close.bind(this));
        this.xText.visible = false;
    }

    positionText() {
        const unsureMenuBounds = this.unsureMenu.getBounds();
        this.xText.position.set(unsureMenuBounds.x + unsureMenuBounds.width, unsureMenuBounds.y);
        this.xText.visible = true;
    }

    resize() {
        this.unsureMenu.width = this.resizeService.positions.innerWidth * 0.95;
        this.unsureMenu.height = this.resizeService.positions.innerHeight * 0.95;
        this.unsureMenuShadow.width = this.resizeService.positions.innerWidth;
        this.unsureMenuShadow.height = this.resizeService.positions.innerHeight;
        this.unsureMenuOverlay.height = this.resizeService.positions.innerHeight;
        this.unsureMenuOverlay.width = this.resizeService.positions.innerWidth;
        if (this.isOpen) {
            this.unsureMenu.position.set(this.resizeService.positions.halfWidth, this.resizeService.positions.halfHeight);
            this.positionText();
        }
    }

    open = () => {
        console.log('test');
        if (this.isOpen)
            return;
        if (!this._isInit)
            this.init();
        if (!this._animations) {
            this._animations = [];
            this._animations.push(
                TweenLite.to(this.unsureMenu.position, 0.4,
                    { x: this.resizeService.positions.halfWidth, y: this.resizeService.positions.halfHeight, ease: Power2.easeOut}),
                TweenLite.to(this.unsureMenuShadow.position, 0.4, { x: 50, y: 50, ease: Power2.easeOut }),
                TweenLite.to(this.unsureMenuOverlay.position, 0.4, {y: 0, ease: Power2.easeOut})
            );
        }
        this._animations.forEach(t => t.play());
        setTimeout(() => {
            this.positionText();
        }, 500);
        this._isOpen = true;

    }
    close = () => {
        this.xText.visible = false;
        this._animations.forEach(t => t.reverse());
        setTimeout(() => {
            this._isOpen = false;
        }, 500);
    }
}
