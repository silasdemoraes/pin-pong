import { Socket } from "socket.io";
import { Game } from "./Game";
import { Player } from "./Player";

export class GameEngine {

    private frames = 1000 / 60;
    private game!: Game;
    private interval!: NodeJS.Timeout;
    private running = false;
    private players: { player: Player; socket: Socket }[] = [];

    constructor() {

    }

    public init() {
        this.game = new Game();
        this.game.init();
    }

    public update() {
        let them = this;
        this.interval = setInterval(() => {
            them.updateFrame();
        }, this.frames);
    }

    public updateFrame() {
        if (this.running) {
            this.game.update();
            this.players.forEach(player => {
                player.socket.emit('game-update', this.game);
            });
        }
    }

    public addPlayer(socket: Socket) {
        console.log("Adicionando jogador");

        let player: Player = this.game.addPlayer();

        this.players.push({ player, socket });

        socket.on('keydown', (data) => {
            if (player) {
                if (data.key === 'ArrowLeft') {
                    player.incrementSpeedX(-5);
                } else if (data.key === 'ArrowRight') {
                    player.incrementSpeedX(5); 
                }
            }
        });

        socket.on('keyup', (data) => {
            if (player) {
                player.incrementSpeedX(0);
            }
        });

    }

    public canStart() {
        if (this.game.canStart()) {
            this.game.start();
            return true;
        }
    }

    public start() {
        console.log("Iniciando jogo")
        this.running = true;
        this.update();
    }

    public removePlayer(socket: Socket) {
        const index = this.players.findIndex((p) => p.socket === socket);
        if (index !== -1) {
            this.game.removePlayer(this.players[index].player);
            this.players.splice(index, 1);
        }
    }

    public reset() {
        this.running = false;
    }


}