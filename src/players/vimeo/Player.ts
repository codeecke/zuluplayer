import {PlayerInterface} from '../../interfaces/player';
import VimeoPlayer from '@vimeo/player';
import { TAttributes } from '../../types/TAttributes';

export class Player implements PlayerInterface {

    private _muted: boolean
    loop: boolean;
    preload: boolean;
    controls: boolean;

    private readonly player: VimeoPlayer;
    private iframe: HTMLIFrameElement;
    private readonly container: HTMLDivElement = document.createElement('div');;

    constructor(
        videoId: number, 
        el: ShadowRoot,
        private attributes: TAttributes
    ) {
        el.innerHTML = `
            <style>
                div {
                    display: block;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    padding: 0;
                }
            </style>
            <div></div>
        `;

        this.container = el.querySelector('div');

        this.player = new VimeoPlayer(this.container, {
            id: videoId,
        });
        this.player.on('loaded', () => {
            this.iframe = el.querySelector('iframe')
            this.setInitialSize()
        });
        this.player.getMuted().then(sOnOff => this._muted = sOnOff);
        new ResizeObserver(() => this.setInitialSize()).observe(this.container);
    }

    private async setInitialSize() {
        const width = await this.player.getVideoWidth();
        const height = await this.player.getVideoHeight();

        this.iframe.style.display = 'none';

        const containerWidth = this.calculatesSize('width')
        const containerHeight = this.calculatesSize('height')

        this.iframe.width = containerWidth.toString();
        this.iframe.height = containerHeight > 0 ? containerHeight.toString() : (containerWidth / width * height).toString();

        this.iframe.style.display = 'block';
    }

    private calculatesSize(attributeName: 'width' | 'height'): number {
        return this.container.getBoundingClientRect()[attributeName] - (attributeName === 'height' ? 4 : 0);
    }


    private onResize() {
        if(!this.iframe) console.log('iframe not found');
        if(!this.iframe) return;
        this.iframe.width = this.calculatesSize('width').toString();
        console.log('resize', this.iframe.width)
        this.iframe.height = (this.calculatesSize('height')).toString();
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