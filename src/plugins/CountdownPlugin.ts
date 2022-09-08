import { ZuluPlayer } from "../index";

export class CountdownPlugin {
    constructor(player: ZuluPlayer) {
        
        if(!player.hasAttribute('countdown')) return;

        const isShadowRootDefined = (shadowRoot: ShadowRoot | null): shadowRoot is ShadowRoot => shadowRoot !== null;
        
        
        player.hook.beforeInitialize.add(async (player: ZuluPlayer) => new Promise<boolean>(resolve => {
            if(!isShadowRootDefined(player.shadowRoot)) return;
            const shadowRoot = player.shadowRoot;
            let countdown = parseInt(player.getAttribute('countdown') || '');
            
            // if(!player.type || player.type === 'youtube') return resolve(true);
            const container = document.createElement('div');
            container.innerHTML = `Countdown: ${(countdown).toString()}`;
            player.shadowRoot.appendChild(container);
            const interval: any = setInterval(() => {
                countdown--;
                container.innerHTML = `<div>Countdown: ${(countdown).toString()}</div>`;
                if(countdown === 0) {
                    clearInterval(interval);
                    console.log('resolve');
                    resolve(true);
                    return;
                }
            }, 1000)
        }))
    }
}