import {Registry} from './libs/Registry'
import {HookManager} from './libs/HookManager'
import {FactoryInterface, PlayerInterface} from './interfaces/player'
import {PluginConstructorInterface, PluginInterface} from './interfaces/PluginInterface'
import {Youtube, Vimeo} from './players/players';
import {PosterPlugin} from './plugins/PosterPlugin'
import {DemoConsentPlugin} from './plugins/DemoConsentPlugin'

type THookList = {
    beforeUrlAnalysis: HookManager,
    beforeInitialize: HookManager,
    afterInitialize: HookManager,
}




export class ZuluPlayer extends HTMLElement implements PlayerInterface {

    private player: PlayerInterface | undefined;
    private _autoplay: boolean = false;
    private _fullscreen: boolean = false;
    private static factories = new Registry<FactoryInterface>()
    private static plugins = new Registry<PluginConstructorInterface>();
    public type: string | undefined;

    public readonly hook: THookList = {
        beforeUrlAnalysis: new HookManager(this),
        beforeInitialize: new HookManager(this),
        afterInitialize: new HookManager(this),
    }

    
    static registerPlayer(playerFactory: FactoryInterface) {
        ZuluPlayer.factories.register(playerFactory);
    }
    static registerPlugin(plugin: PluginConstructorInterface) {
        ZuluPlayer.plugins.register(plugin);
    }

    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        ZuluPlayer.plugins.use(Plugin => new Plugin(this))

        this.hook.beforeUrlAnalysis.execute().then(canExecute => {
            if(canExecute) this.initializePlayer();
        });
        
        
    }

    private async findPlayer(factory: FactoryInterface, foundPlayer: PlayerInterface) {
        if(typeof(foundPlayer) !== 'undefined') return foundPlayer;

        const url = this.getAttribute('src');
        this.type = factory.type;
        console.log(url, factory.type, factory.createValidator().validate(url))
        if(
            factory.createValidator().validate(url)
            && await this.hook.beforeInitialize.execute()
        ) return factory.createPlayer(url, this.shadowRoot)
    }

    private async initializePlayer() {
        this.player = await ZuluPlayer.factories.useAsync(
            this.findPlayer.bind(this)
        );

        if(!this.canPlay) return;
        this.autoplay = ['', 'on'].includes(this.getAttribute('autoplay'));
        await this.hook.afterInitialize.execute();
    }


    get canPlay(): boolean {
        return typeof(this.player) !== 'undefined';
    }

    play(): void {
        if(this.canPlay) this.player.play();
    }

    pause(): void {
        if(this.canPlay) this.player.pause();
    }

    get autoplay() {
        return this.canPlay && this._autoplay;
    }

    set autoplay(sOnOff: boolean) {
        if(!this.canPlay) return;
        this._autoplay = sOnOff;
        if(sOnOff) {
            this.muted = true;
            this.play();
        }
    }

    get controls() {
        return this.canPlay && this.player.controls;
    }

    set controls(sOnOff: boolean) {
        if(this.canPlay) this.player.controls = sOnOff;
    }

    get muted() {
        return this.canPlay && this.player.muted;
    }

    set muted(sOnOff: boolean) {
        if(this.canPlay) this.player.muted = sOnOff;
    }

    get loop() {
        return this.canPlay && this.player.loop;
    }

    set loop(sOnOff: boolean) {
        if(this.canPlay) this.player.loop = sOnOff;
    }

    get preload() {
        return this.canPlay && this.player.preload;
    }

    set preload(sOnOff: boolean) {
        if(this.canPlay) this.player.preload = sOnOff;
    }

    get fullscreen(): boolean {
        if('fullscreen' in this.player) return this.player.fullscreen;
        return this._fullscreen;
    }

    set fullscreen(sOnOff: boolean) {
        if('fullscreen' in this.player) {
            this.player.fullscreen = sOnOff;
            return;
        }
        this._fullscreen = sOnOff;
        if(sOnOff) {
            type WebKitHTMLElement = {webkitRequestFullscreen: () => void};
            type MozillaHTMLElement = {mozRequestFullScreen: () => void};
            type ResistentHTMLElement = WebKitHTMLElement | HTMLElement | MozillaHTMLElement;

            const isModernBrowser = (el: ResistentHTMLElement): el is HTMLElement  => 'requestFullscreen' in el;
            const isOldWebkit = (el: ResistentHTMLElement): el is WebKitHTMLElement  => 'webkitRequestFullscreen' in el;
            const isOldFirefox = (el: ResistentHTMLElement): el is MozillaHTMLElement  => 'webkitRequestFullscreen' in el;

            const playerElement = this.shadowRoot.firstChild as ResistentHTMLElement;

            if(isModernBrowser(playerElement)) playerElement.requestFullscreen();
            else if(isOldFirefox(playerElement)) playerElement.mozRequestFullScreen();
            else if(isOldWebkit(playerElement)) playerElement.webkitRequestFullscreen();
            else throw new Error('Fullscreen is not supported for your browser');
        } else {
            type TOldFirefox = {mozCancelFullScreen: () => void};
            type TOldWebkit = {webkitExitFullscreen: () => void};
            type ResistentDocument = Document | TOldFirefox | TOldWebkit;

            const isOldFirefox = (doc: ResistentDocument): doc is TOldFirefox => 'mozCancelFullScreen' in doc;
            const isOldWebkit = (doc: ResistentDocument): doc is TOldWebkit => 'webkitExitFullscreen' in doc;
            const isModernBrowser = (doc: ResistentDocument): doc is TOldWebkit => 'exitFullscreen' in doc;
            
            if(isModernBrowser(document)) document.exitFullscreen();
            else if(isOldFirefox(document)) document.mozCancelFullScreen();
            else if(isOldWebkit(document)) document.webkitExitFullscreen();
            else throw new Error('Fullscreen is not supported for your browser');
        };
    }

}



// Players
ZuluPlayer.registerPlayer(new Youtube());
ZuluPlayer.registerPlayer(new Vimeo());

// Plugins
ZuluPlayer.registerPlugin(PosterPlugin)

window.customElements.define('zulu-player', ZuluPlayer);
