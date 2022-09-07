import { ZuluPlayer } from "../index";

export class CountdownPlugin {
    constructor(player: ZuluPlayer) {
        if(!player.hasAttribute('countdown')) return;
        const el = player.shadowRoot;
        let countdown = parseInt(player.getAttribute('countdown') || '');
        player.hook.initialize.add((result) => new Promise<boolean>(resolve => {
            if(!el) return;
            el.innerHTML = `<div>Countdown: ${(countdown).toString()}</div>`;
            const interval: any = setInterval(() => {
                if(!el) return;
                countdown--;
                el.innerHTML = `<div>Countdown: ${(countdown).toString()}</div>`;
                if(countdown === 0) {
                    clearInterval(interval);
                    resolve(true);
                    return;
                }
            }, 1000)
        }))
    }
}