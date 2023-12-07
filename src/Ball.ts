import { Field } from "./Field";
import { Player } from "./Player";

export class Ball {
    x!: number;
    y!: number;
    width: number = 10;
    height: number = 10;
    vx = 0;
    vy = 0;

    constructor() {
    }

    centralizeX(field: Field) {
        this.x = field.width / 2 - this.width / 2;
    }

    centralizeY(field: Field) {
        this.y = field.height / 2 - this.height / 2;
    }

    setRandomSpeeds() {
        this.vx = Math.random() * 5 - 5;
        this.vy = Math.random() * 5 - 5;
    }

    update(field: Field) {
        this.x += this.vx;
        this.y += this.vy;
        this.checkCollisionWithField(field);
    }

    private checkCollisionWithField(field: Field) {
        if (this.x < 0 || this.x + this.width > field.width) {
            this.vx = -this.vx;
        }

        if (this.y < 0 || this.y + this.height > field.height) {
            this.vy = -this.vy;
        }
    }


    checkCollisionWithPlayers(player1?: Player, player2?: Player) {
        if (player1 && this.checkPointCollision(player1)) {
            this.handlePlayerCollision(player1);
        }

        if (player2 && this.checkPointCollision(player2)) {
            this.handlePlayerCollision(player2);
        }
    }
    handlePlayerCollision(player: Player) {
        this.vy = -this.vy;

        this.increaseSpeed();

        const ballCenterX = this.x + this.width;
        const ballCenterY = this.y + this.width;

        const deltaX = ballCenterX - (player.x + player.width / 2);
        const deltaY = ballCenterY - (player.y + player.height / 2);

        this.vy += deltaY / 5;
    }

    checkPointCollision(player: Player): boolean {

        const ballCenterX = this.x + this.width;
        const ballCenterY = this.y + this.width;

        return (
            ballCenterX > player.x &&
            ballCenterX < player.x + player.width &&
            ballCenterY > player.y &&
            ballCenterY < player.y + player.height
        );
    }

    checkCollisionWithBorders(field: Field, player1?: Player, player2?: Player) {
        if (this.y < 0 || this.y + this.height > field.height) {

            if (this.y < 0) {
                player2?.incrementScore();
            }

            if (this.y + this.height > field.height) {
                player1?.incrementScore();
            }
        }
    }

    increaseSpeed() {
        const maxSpeed = 10;

        this.vx = this.clampSpeed(this.vx + 1, maxSpeed);
        this.vy = this.clampSpeed(this.vy + 1, maxSpeed);
    }
    
    clampSpeed(speed: number, maxSpeed: number): number {
        // Garante que a velocidade não ultrapasse o valor máximo
        return Math.min(Math.abs(speed), maxSpeed) * Math.sign(speed);
    }
}
