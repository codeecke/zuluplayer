import {ZuluPlayer} from '../index';

export class HookManager {
    private hooks: ((player: ZuluPlayer) => Promise<boolean> | boolean)[] = [];

    constructor(private player: ZuluPlayer){}

    async add(hook: (player: ZuluPlayer) => Promise<boolean>) {
        this.hooks.push(hook);
    }

    async execute(): Promise<boolean>{
        if(this.hooks.length === 0) return Promise.resolve(true);
        const promises = this.hooks.map(hook => hook(this.player));
        const results = await Promise.all(promises);
        
        return results.some(result => result);
    }
}