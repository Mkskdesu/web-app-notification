interface inAppNotificationButton {
    text: string;
    onclick: Function;
    clickToHide?: boolean;
}
interface inAppNotificationInput {
    placeholder: string | null;
    onsubmit: Function;
    submitToHide?: boolean;
}
interface inAppNotificationImage {
    src: string;
    alt: string | null;
}
interface inAppNotificationMenuOption {
    text: string;
    onclick: Function;
}
interface inAppNotificationOptions {
    [key: string]: any;
    time?: number;
    type?: "top" | "bottom-right" | "top-right";
    title?: string;
    description?: string;
    attachment?: inAppNotificationImage | null;
    interactions?: {
        buttons: Array<inAppNotificationButton> | null;
        form: inAppNotificationInput | null;
    } | null;
    thumbnail?: inAppNotificationImage | null;
    header?: string;
    footer?: string;
    controls?: "visible" | "x" | "menu" | "hidden" | null;
    onclick?: Function | null;
    appendTo?: HTMLElement | null;
    sound?: HTMLAudioElement | string | null;
    menus?: Array<inAppNotificationMenuOption> | null;
}
declare class inAppNotification {
    notificationOptions: inAppNotificationOptions;
    active: boolean;
    notificationBody: HTMLDivElement;
    notificationContents: {
        header: HTMLDivElement;
        title: HTMLDivElement;
        description: HTMLDivElement;
        attachment: HTMLImageElement;
        interactions: HTMLDivElement;
        controls: HTMLDivElement;
        controlsBtn: {
            menu: SVGSVGElement;
            x: SVGSVGElement;
        };
        footer: HTMLDivElement;
        menuList: HTMLDivElement;
    };
    constructor(options: inAppNotificationOptions);
    create(): void;
    private setTextContents;
    private setControls;
    private setThumbnail;
    private setAttachment;
    private setMenuOptions;
    private createInteractionsButton;
    private createInterationsInput;
    private focus;
    private blur;
    private addClass;
    showNotificatonMenu(): void;
    animate(type: 'show' | 'hide'): void;
    private playSound;
    private remove;
    private getMillisecondsFromCssDuration;
}
//# sourceMappingURL=index.d.ts.map