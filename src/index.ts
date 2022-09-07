import {Registry} from './libs/Registry'
import {Hook} from './libs/Hook'
import {FactoryInterface, PlayerInterface} from './interfaces/player'
import {PluginConstructorInterface, PluginInterface} from './interfaces/PluginInterface'
import {Youtube} from './players/youtube';
import {CountdownPlugin} from './plugins/CountdownPlugin'

type THookList = {
    initialize: Hook
}

export class ZuluPlayer extends HTMLElement implements PlayerInterface {

    private player: PlayerInterface | undefined;
    private static factories = new Registry<FactoryInterface>()
    private static plugins = new Registry<PluginConstructorInterface>();

    public readonly hook: THookList = {
        initialize: new Hook(this),
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

        this.initializePlayer();
        
    }

    private async initializePlayer() {
        if(!await this.hook.initialize.execute()) return;

        this.player = ZuluPlayer.factories.use((factory: FactoryInterface, foundPlayer: PlayerInterface) => {
            if(typeof(foundPlayer) !== 'undefined') return foundPlayer;
            const url = this.getAttribute('src');
            
            if(
                factory
                .createValidator()
                .validate(url)
            ) {
                return factory.createPlayer(url, this.shadowRoot)
            }
        });

        if(!this.canPlay) return;
        this.autoplay = ['', 'on'].includes(this.getAttribute('autoplay')) ;
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
        return this.canPlay && this.player.autoplay;
    }

    set autoplay(sOnOff: boolean) {
        if(this.canPlay) this.player.autoplay = sOnOff;
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

}




ZuluPlayer.registerPlayer(new Youtube());
ZuluPlayer.registerPlugin(CountdownPlugin);

window.customElements.define('zulu-player', ZuluPlayer);
