import { PlayerInterface } from "./PlayerInterface";
import { ValidatorInterface } from "./ValidatorInterface";

export interface FactoryInterface {
    createValidator(): ValidatorInterface;
    createPlayer(url: string, containerElement: ShadowRoot): PlayerInterface;
}