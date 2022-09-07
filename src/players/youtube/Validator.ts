import { ValidatorInterface } from "../../interfaces/player/ValidatorInterface";
import { Helper } from "./Helper";

export class Validator implements ValidatorInterface {

    private helper = new Helper();

    private isValidDomain(url: string): boolean {
        return !!this.helper.getDomain(url).match('(www.)?(youtube\.com|youtu.be)')
    }

    private isPathValid(url: string): boolean {
                const path = this.helper.getPath(url);
        const domain = this.helper.getDomain(url);

        if(domain === 'youtu.be') return !!path.match(/\/[a-zA-Z0-9\-\_]+$/);
        return path === '/watch'
    }

    hasVideoIDInQueryParameter(url: string): boolean {
        return !!this.helper.getVideoId(url);
    }


    validate(url: string): boolean {
        return this.isValidDomain(url)
            && this.isPathValid(url)
            && this.hasVideoIDInQueryParameter(url);
    }
}