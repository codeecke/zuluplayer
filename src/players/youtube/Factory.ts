import { FactoryInterface } from "../../interfaces/player/FactoryInterface";
import { PlayerInterface } from "../../interfaces/player/PlayerInterface";
import { ValidatorInterface } from "../../interfaces/player/ValidatorInterface";
import { Player } from "./Player";
import { Validator } from "./Validator";

export class Factory implements FactoryInterface {

    readonly type = 'YouTube'

    createValidator(): ValidatorInterface {
        return new Validator();
    }

    createPlayer(url: string, containerElement: ShadowRoot): PlayerInterface {
        return new Player(url, containerElement)
    }
}