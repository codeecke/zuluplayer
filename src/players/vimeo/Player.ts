import {PlayerInterface} from '../../interfaces/player';
import VimeoPlayer from '@vimeo/player';

export class Player implements PlayerInterface {

    private _muted: boolean
    loop: boolean;
    preload: boolean;
    controls: boolean;

    private readonly player: VimeoPlayer;

    constructor(private videoId: number, private el: ShadowRoot) {
        const container = document.createElement('div');

        el.appendChild(container);
        this.player = new VimeoPlayer(container, {id: videoId, width: 640});
        this.player.getMuted().then(sOnOff => this._muted = sOnOff);
    }

    play(): void {
        this.player.play();
    }

    pause(): void {
        this.player.pause();
    }

    get muted() {
        return this._muted;
    }

    set muted(sOnOff: boolean) {
        this.player.setMuted(sOnOff).then(() => this._muted = sOnOff);
    }

}