import { ZuluPlayer } from "../index";
import { Observable } from "../libs/Observable";

export class DemoConsentPlugin {
    static allowedPlayer: {[key: string]: Observable<boolean>} = {};

    constructor(player: ZuluPlayer) {
        const isPlayerTypeDefined = (playerType: string | undefined): playerType is string => typeof(playerType) !== 'undefined';

        player.hook.beforeInitialize.add(async (player: ZuluPlayer) => new Promise(resolve => {
            if(!isPlayerTypeDefined(player.type)) return resolve(false);
            DemoConsentPlugin.allowedPlayer[player.type] = DemoConsentPlugin.allowedPlayer[player.type] || new Observable(false)
            const playerPermission = DemoConsentPlugin.allowedPlayer[player.type];

            if(playerPermission.getValue()) return resolve(true);

            const template = document.createElement('template');
            template.innerHTML = `
            <div>
                <button>I want to play videos from ${player.type}. I accept that my personal informations are shared with ${player.type}.</button>
            </div>`;

            player.shadowRoot.appendChild(template.content.cloneNode(true))
            player.shadowRoot.querySelector('button').addEventListener('click', () => playerPermission.update(true));

            playerPermission.observe(newValue => {
                player.shadowRoot.querySelector('button').parentElement.innerHTML = `You allowed videos from ${player.type}. Player is loading ...`
                if(newValue) resolve(true);
            });
        }))
    }

    
}