import { PlayerInterface } from "../../interfaces/player/PlayerInterface";
import { Helper } from "./Helper";
import {YoutubeAPIHelper} from './YoutubeAPIHelper'
import {PlayerInterface as YTPlayerInterface} from './APIInterface'
import { Observable } from "../../libs/Observable";

export class Player implements PlayerInterface {

    private player: YTPlayerInterface
    private playerReady = new Observable(false);
    private helper = new Helper();
    private apiHelper = new YoutubeAPIHelper();

    private _loop: boolean;
    private _autoplay: boolean;

    constructor(url: string, private containerElement: ShadowRoot) {
        this.apiHelper.implementScriptTag();
        this.apiHelper.onReady(() => {
            console.log('onReady')  
            const videoId = this.helper.getVideoId(url);
            containerElement.innerHTML = `<div id="youtube"></div>`
            this.player = this.apiHelper.createPlayer(
                this.containerElement.getElementById('youtube'), 
                videoId,
                {
                    playerVars: {controls: false},
                    events: {
                        onReady: () => this.playerReady.update(true)
                    }
                });
        });
    }

    onReady(cb: () => void) {
        if(this.playerReady.getValue()) {
            cb();
        } else {
            this.playerReady.observe(cb);
        }
    }

    play(): void {
        this.onReady(() => {
            this.player.playVideo();
        });
    }

    pause(): void {
        this.onReady(() => {
            this.player.pauseVideo();
        });
    }

    get muted(): boolean {
        return this.player.isMuted();
    }

    set muted(sOnOff: boolean) {
        this.onReady(() => {
            if(sOnOff) this.player.mute();
            else this.player.unMute();
        });
        
    }

    get loop(): boolean {
        return this._loop;
    }

    set loop(sOnOff: boolean) {
        this._loop = sOnOff;
        this.onReady(() => {
            this.player.setLoop(this._loop);
        });
        
    }

    set autoplay(sOnOff: boolean) {
        this._autoplay = sOnOff;

        this.onReady(() => {
            if(!this._autoplay) return;
            this.muted = true;
            this.play();
        });
    }

    get controls() {
        return true;
    }

    set controls(s: boolean) {
        console.warn('Youtube cannot disable controls')
    }

    get preload() {
        return false;
    }

    set preload(s: boolean) {
        console.warn('preloading is not supported for youtube')
    }

}