import { Field } from "./Field";

export class Player {
    x: number;
    y: number;
    width: number = 150;
    height: number = 10;
    vx: number = 0; 
    private score: number = 0;

    constructor(x: number, y: number, field: Field) {
        this.x = x;
        this.y = y;
    }

    centralizeX(field: Field) {
        this.x = field.width / 2 - this.width / 2;
    }

    update(field: Field) {
        this.checkCollisionWithField(field);
        this.x += this.vx;
    }

    private checkCollisionWithField(field: Field) {
        if (this.x < 0) {
            this.x = 0;
            this.vx = 0;
        }

        if (this.x + this.width > field.width) {
            this.x = field.width - this.width;
            this.vx = 0;
        }
    }

    incrementSpeedX(increment: number) {
        this.vx = increment;
    }

    incrementScore() {
        this.score++;
    }

    getScore() {
        return this.score;
    }
}