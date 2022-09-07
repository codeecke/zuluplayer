export interface PlayerInterface {

    muted: boolean;
    loop: boolean;
    autoplay: boolean;
    preload: boolean;
    controls: boolean;

    play(): void;
    pause(): void;
    
}