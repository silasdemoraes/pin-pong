import { Ball } from "./Ball";
import { Field } from "./Field";
import { Player } from "./Player";

export class Game {


    private field!: Field;
    private ball!: Ball;
    private player1?: Player;
    private player2?: Player;

    constructor() {
    }

    public init() {
        this.field = new Field();
        this.ball = new Ball();
        this.ball.centralizeY(this.field);
        this.ball.centralizeX(this.field);
    }

    public addPlayer(): Player {
        if (!this.player1) {
            this.player1 = new Player(0, 10, this.field);
            this.player1.centralizeX(this.field);
            return this.player1;
        }

        if (!this.player2) {
            this.player2 = new Player(0, this.field.height - 20, this.field);
            this.player2.centralizeX(this.field);
        }

        return this.player2;
    }

    public canStart() {
        if (this.player1 && this.player2) {
            return true;
        }
    }

    public start() {
        this.ball.setRandomSpeeds();
    }

    public update() {
        this.handleCollision();

        this.ball.update(this.field);
        this.player1?.update(this.field);
        this.player2?.update(this.field);
    }

    private handleCollision() {
        this.ball.checkCollisionWithPlayers(this.player1, this.player2);
        this.ball.checkCollisionWithBorders(this.field, this.player1, this.player2);
    }

    public getPlayers() {
        return [this.player1, this.player2];
    }

    private updateScores() {
        this.resetGame();
    }

    private resetGame() {
        this.ball.x = this.field.width / 2;
        this.ball.y = this.field.height / 2;
        this.ball.setRandomSpeeds();
    }

    public getScores() {
        return {
            player1: this.player1?.getScore(),
            player2: this.player2?.getScore()
        };
    }

    public removePlayer(player: Player) {
        if (player === this.player1) {
            this.player1 = undefined;
        } else if (player === this.player2) {
            this.player2 = undefined;
        }
    }
}