import { IMenuClass } from '../../services/canvas.service';
import { ResizeService } from '../../services/resize.service';
import { Menu } from './menu';

export class FansMenu extends Menu implements IMenuClass {

    get position() {
        return { x: 0, y: 0 };
    }

    constructor(container: PIXI.Container, resizeService: ResizeService) {
        super(container, resizeService);
        const graphics = new PIXI.Graphics;
        graphics.moveTo(0, 0);
        graphics.beginFill(0x00FFFF);
        graphics.drawCircle(0, 0, 180);
        graphics.endFill();
        const texture = graphics.generateCanvasTexture();
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.on('pointerdown', this.open);
        this._init();
    }



    public open = () => {

    }
    public close = () => {

    }

    resize() {
        this.sprite.position.set(this.position.x, this.position.y);
    }
}
