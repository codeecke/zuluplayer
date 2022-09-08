import { ZuluPlayer } from '../index';

export class PosterPlugin {

    static autoplay = true;

    constructor(player:  ZuluPlayer) {
        player.hook.beforeUrlAnalysis.add(() => new Promise<boolean>(resolve => {
            if(!player.shadowRoot || !player.hasAttribute('poster')) return resolve(true);
            
            
            player.shadowRoot.innerHTML = `
            <style>img {cursor: pointer}</style>
            <img src="${player.getAttribute('poster')}" width="640" height="360" alt="Poster">
            `
            player.shadowRoot.querySelector('img')?.addEventListener('click', () => {
                player.shadowRoot.innerHTML = '';
                resolve(true)
            });
        }));


        if(!PosterPlugin.autoplay) return;
        player.hook.afterInitialize.add(async () => {
            if(!player.hasAttribute('poster')) return true;

            player.play();
            return true;
        })
    }
}