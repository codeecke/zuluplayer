import { PlayerInterface } from "./PlayerInterface";
import { ValidatorInterface } from "./ValidatorInterface";

export interface FactoryInterface {
    readonly type: string,
    createValidator(): ValidatorInterface;
    createPlayer(url: string, containerElement: ShadowRoot): PlayerInterface;
}