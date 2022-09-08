export interface PlayerInterface {

    muted: boolean;
    loop: boolean;
    preload: boolean;
    controls: boolean;
    fullscreen?: boolean;
    
    play(): void;
    pause(): void;
    
}