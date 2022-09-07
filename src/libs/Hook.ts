import {ZuluPlayer} from '../index';

export class Hook {
    private hooks = Promise.resolve(true);

    constructor(private player: ZuluPlayer){}

    add(hook: (previousResult: boolean ) => boolean | Promise<boolean>) {
        this.hooks = this.hooks.then(hook);
    }

    async execute() {
        return await this.hooks;
    }
}