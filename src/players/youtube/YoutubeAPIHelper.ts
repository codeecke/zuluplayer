import { Observable } from "../../libs/Observable";
import {YoutubeAPIInterface, PlayerInterface} from "./APIInterface"


declare var YT: YoutubeAPIInterface;

export class YoutubeAPIHelper {
    static apiScriptImplemented = new Observable(false);
    static apiLoaded = new Observable(false);

    implementScriptTag() {
        if (YoutubeAPIHelper.apiScriptImplemented.getValue()) return;
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";

        (window as any).onYouTubeIframeAPIReady = () => YoutubeAPIHelper.apiLoaded.update(true);

        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        YoutubeAPIHelper.apiScriptImplemented.update(true);
    }

    onReady(cb: () => void) {
        if(YoutubeAPIHelper.apiLoaded.getValue()) {
            cb();
        } else {
            YoutubeAPIHelper.apiLoaded.observe(() => cb());
        }
    }

    createPlayer(containerElement: string | HTMLElement, videoId: string, options: {[key: string]: any} = {}): PlayerInterface {
        return new YT.Player(containerElement, {
            videoId: videoId,
            ...options
          });
        }
}

