import { Injectable } from '@angular/core';
import * as PIXI from 'pixi.js';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

    public app: PIXI.Application;
    public styles: PIXI.TextStyle[] = [];

    constructor() {

    }

    public init() {
        if (!this.app) {

            this.app = new PIXI.Application({
                autoResize: true,
                resolution: devicePixelRatio,
                antialias: true
            });
            document.body.appendChild(this.app.view);

            this.styles.push(
                new PIXI.TextStyle({
                    fontFamily: 'Ludicrous',
                    fontSize: 97,
                    align: 'center'
                }),
                new PIXI.TextStyle({
                    fontFamily: 'Ludicrous',
                    fontSize: 48,
                    wordWrap: true,
                    wordWrapWidth: 300,
                }),
                new PIXI.TextStyle({
                    fontFamily: 'Ludicrous',
                    fontSize: 42,
                    align: 'center'
                }),
                new PIXI.TextStyle({
                    fontFamily: 'Ludicrous',
                    fontSize: 32,
                    wordWrap: true,
                    wordWrapWidth: 200
                })
            );
        }
        return this.app;
    }
}
export enum Styles {
    extraLarge, large, medium, small
}