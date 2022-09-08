import {Registry} from './libs/Registry'
import {HookManager} from './libs/HookManager'
import {FactoryInterface, PlayerInterface} from './interfaces/player'
import {PluginConstructorInterface, PluginInterface} from './interfaces/PluginInterface'
import {Youtube} from './players/youtube';
import {CountdownPlugin} from './plugins/CountdownPlugin'
import {DemoConsentPlugin} from './plugins/DemoConsentPlugin'

type THookList = {
    beforeUrlAnalysis: HookManager,
    beforeInitialize: HookManager
}

export class ZuluPlayer extends HTMLElement implements PlayerInterface {

    private player: PlayerInterface | undefined;
    private static factories = new Registry<FactoryInterface>()
    private static plugins = new Registry<PluginConstructorInterface>();
    public type: string | undefined;

    public readonly hook: THookList = {
        beforeUrlAnalysis: new HookManager(this),
        beforeInitialize: new HookManager(this),
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
ZuluPlayer.registerPlugin(DemoConsentPlugin);

window.customElements.define('zulu-player', ZuluPlayer);
