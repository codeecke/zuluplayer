import { ZuluPlayer } from "../index";

export interface PluginInterface {

}

export interface PluginConstructorInterface {
    new(player: ZuluPlayer): PluginInterface
}