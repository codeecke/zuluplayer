import {FactoryInterface, PlayerInterface, ValidatorInterface} from '../../interfaces/player';

export class Validator implements ValidatorInterface {
    validate(url: string): boolean {
        return !!url.match(/vimeo.com\/[0-9]+$/)
    }

}