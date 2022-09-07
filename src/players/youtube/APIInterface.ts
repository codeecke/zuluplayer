export interface YoutubeAPIInterface {
    Player: PlayerConstructorInterface
}

export interface PlayerConstructorInterface {
    new(id: HTMLElement | string, options: any): PlayerInterface;
}

export interface PlayerInterface {
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    isMuted(): boolean;
    mute(): void;
    unMute(): void;
    setSize(width: number, height: number): object;
    getIframe(): HTMLIFrameElement;
    getCurrentTime(): number;
    seekTo(seconds: number, allowSeekAhead: boolean) : void;
    addEventListener(eventName: string, listener: Function): void;
    setLoop(sOnOff: boolean): void;
}