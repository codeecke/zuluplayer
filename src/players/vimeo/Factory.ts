import { ZuluPlayer } from '../..';
import {FactoryInterface, PlayerInterface, ValidatorInterface} from '../../interfaces/player';
import { Player } from './Player';
import { Validator } from './Validator';

export class Factory implements FactoryInterface {
    public readonly type = 'Vimeo';

    createValidator(): ValidatorInterface {
        return new Validator();
    }

    createPlayer(url: string, player: ZuluPlayer): PlayerInterface {
        const parts = url.match(/vimeo.com\/([0-9]+)/);
        
        return new Player(parseInt(parts[1]), player.shadowRoot, player.getAttributes());
    }

}