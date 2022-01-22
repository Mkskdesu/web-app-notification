interface inAppNotificationButton {
    text: string,
    onclick: Function,
    clickToHide?:boolean
}
interface inAppNotificationInput {
    placeholder?: string,
    onsubmit: Function,
    submitToHide?:boolean,
}
interface inAppNotificationImage {
    src: string,
    alt?: string
}
interface inAppNotificationMenuOption {
    text: string,
    onclick: Function
}

interface inAppNotificationOptions {
    [key: string]: any;
    time?: number,
    type?: "top" | "bottom-right" | "top-right",
    title?: string,
    description?: string,
    attachment?: inAppNotificationImage | null,
    interactions?: {
        buttons:Array<inAppNotificationButton>|null,
        form:inAppNotificationInput|null
    }|null,
    thumbnail?: inAppNotificationImage | null,
    header?: string,
    footer?: string,
    controls?: "visible" | "x" | "menu" | "hidden" | null,
    onclick?: Function | null,
    appendTo?: HTMLElement | null,
    sound?: HTMLAudioElement | string | null;
    menus?: Array<inAppNotificationMenuOption> | null
}


class inAppNotification {
    //default property
    notificationOptions: inAppNotificationOptions = {
        time: 5000,
        type: "bottom-right",
        title: "",
        description: "",
        interactions: null,
        attachment: null,
        thumbnail: null,
        header: "",
        footer: "",
        controls: "visible",
        onclick: null,
        contextmenu: null,
        appendTo: document.body,
        sound: null,
        menus: null,
    }

    //when interactions form get focus or open menu value changes to true. else it changes to false.
    active: boolean = false;

    notificationBody: HTMLDivElement = document.createElement("div");;

    //contents
    notificationContents = {
        header: document.createElement("div"),
        title: document.createElement("div"),
        description: document.createElement('div'),
        attachment: document.createElement('img'),
        interactions:document.createElement('div'),
        controls: document.createElement("div"),
        controlsBtn: {
            menu: document.createElementNS("http://www.w3.org/2000/svg", 'svg'),
            x: document.createElementNS("http://www.w3.org/2000/svg", 'svg')
        },
        footer: document.createElement('div'),
        menuList:document.createElement('div')
    }

    constructor(options: inAppNotificationOptions) {
        try {
            //override default property
            for (const i in options) {
                if (options[i]) this.notificationOptions[i] = options[i];
            }
            this.create();
        } catch (error) {
            console.error(error);
        }
    }
    create() {
        try {
            //textContent
            this.setTextContents();

            //controls
            this.setControls();

            //thumbnail image in header
            if (this.notificationOptions.thumbnail) {
                this.setThumbnail();
            }

            //attachment image
            if (this.notificationOptions.attachment) {
                this.setAttachment();
            }

            //interactions
            if(this.notificationOptions.interactions){
                //buttons
                if(this.notificationOptions.interactions.buttons){
                    for (const i in this.notificationOptions.interactions.buttons) {
                        this.createInteractionsButton(this.notificationOptions.interactions.buttons[i])
                    }
                }
                //input form
                if(this.notificationOptions.interactions.form){
                    this.createInterationsInput(this.notificationOptions.interactions.form)
                }
            }

            //set menu options
            this.setMenuOptions();

            //add class to contents
            this.addClass();

            this.notificationBody.addEventListener('click',e=>{
                e.stopPropagation();
                if (typeof this.notificationOptions.onclick == "function") this.notificationOptions.onclick();
            })

            //controls events
            this.notificationContents.controlsBtn.x.addEventListener('click', () => this.animate("hide"));
            this.notificationContents.controlsBtn.menu.addEventListener('click', () => this.showNotificatonMenu());

            //append elements
            this.notificationContents.controls.append(this.notificationContents.controlsBtn.menu, this.notificationContents.controlsBtn.x)
            this.notificationBody.append(this.notificationContents.controls, this.notificationContents.header, this.notificationContents.title, this.notificationContents.description);
            if(this.notificationOptions.attachment) this.notificationBody.append(this.notificationContents.attachment);
            this.notificationBody.append(this.notificationContents.interactions,this.notificationContents.footer,this.notificationContents.menuList);
            
            this.notificationOptions.appendTo!.append(this.notificationBody);

            //show notification
            this.animate('show');
        } catch (error) {
            console.error(error);
        }
    }
    private setTextContents(){
        this.notificationContents.header.textContent = this.notificationOptions.header!;
        this.notificationContents.title.textContent = this.notificationOptions.title!;
        this.notificationContents.description.textContent = this.notificationOptions.description!;
        this.notificationContents.footer.textContent = this.notificationOptions.footer!;
    }
    private setControls(){
        this.notificationContents.controlsBtn.menu.innerHTML = '<path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />';
        this.notificationContents.controlsBtn.x.innerHTML = '<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />';
        this.notificationContents.controlsBtn.x.setAttribute("width", "16");
        this.notificationContents.controlsBtn.x.setAttribute("height", "16");
        this.notificationContents.controlsBtn.x.setAttribute("fill", "currentColor");
        this.notificationContents.controlsBtn.x.setAttribute("viewBox", "0 0 16 16");
        this.notificationContents.controlsBtn.menu.setAttribute("width", "16");
        this.notificationContents.controlsBtn.menu.setAttribute("height", "16");
        this.notificationContents.controlsBtn.menu.setAttribute("fill", "currentColor");
        this.notificationContents.controlsBtn.menu.setAttribute("viewBox", "0 0 16 16");

        switch(this.notificationOptions.controls){
            case "hidden":
                this.notificationContents.controls.style.display = "none";
            break;
            case "menu":
                this.notificationContents.controlsBtn.x.style.display = "none";
            break;
            case "x":
                this.notificationContents.controlsBtn.menu.style.display = "none";
            break;
        }
    }
    private setThumbnail(){
        let headerThumbnail = document.createElement('img');
        headerThumbnail.src = this.notificationOptions.thumbnail!.src;
        headerThumbnail.alt = this.notificationOptions.thumbnail!.alt ?? "";
        headerThumbnail.draggable = false;
        headerThumbnail.classList.add('in-app-notification-header-thumbnail');
        this.notificationContents.header.insertAdjacentElement('afterbegin', headerThumbnail);
    }
    private setAttachment() {
        this.notificationContents.attachment.src = this.notificationOptions.attachment!.src;
        this.notificationContents.attachment.alt = this.notificationOptions.attachment!.alt ?? "";
        this.notificationContents.attachment.draggable = false;
    }

    private setMenuOptions() {
        const titlebar = document.createElement('div');
        titlebar.classList.add('in-app-notification-menu-title');

        //back button left arrow
        const backbtn = document.createElementNS('http://www.w3.org/2000/svg','svg');
        backbtn.setAttribute('width','24');
        backbtn.setAttribute('height','24');
        backbtn.setAttribute('fill','currentColor');
        backbtn.setAttribute('viewBox','0 0 16 16');
        backbtn.classList.add('in-app-notification-menu-content');
        backbtn.innerHTML = '<path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />'
        backbtn.addEventListener('click',e=>{
            this.blur();
            e.stopPropagation();
            this.notificationContents.menuList.classList.remove('show')
        })

        const titleText = document.createElement('b');
        titleText.textContent = "Notification Options";
        titlebar.append(backbtn,titleText)
        this.notificationContents.menuList.append(titlebar);

        //add options
        if(this.notificationOptions.menus){
            for (const i of this.notificationOptions.menus) {
                const menuContent = document.createElement('div');
                menuContent.classList.add('in-app-notification-menu-content');
                menuContent.textContent = i.text;
                menuContent.addEventListener('click',e=>{
                    e.stopPropagation();
                    i.onclick();
                })
                this.notificationContents.menuList.append(menuContent);
            }
        }

    }

    private createInteractionsButton(data:inAppNotificationButton){
        const btn = document.createElement('button');
        btn.textContent = data.text;
        btn.addEventListener('click', e => {
            e.stopPropagation();
            data.onclick();
            if (data.clickToHide) this.animate('hide')
        })
        this.notificationContents.interactions.append(btn);
    }
    private createInterationsInput(data:inAppNotificationInput) {
        const form = document.createElement('form');
        const input = document.createElement('input');
        input.type = "text";
        input.placeholder = data.placeholder ?? "";
        input.addEventListener('focus', () => this.focus());
        input.addEventListener('blur', () => this.blur());
        form.onsubmit = () => {
            const value = input.value;
            data.onsubmit(value);
            if (data.submitToHide) this.animate('hide');
            return false;
        }
        const submitbtn = document.createElement('button');
        submitbtn.type = "submit";

        const buttonSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        buttonSvg.setAttribute("width", "16");
        buttonSvg.setAttribute("height", "16");
        buttonSvg.setAttribute("fill", "currentColor");
        buttonSvg.setAttribute("viewBox", "0 0 16 16");
        buttonSvg.innerHTML = '<path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />';

        submitbtn.append(buttonSvg);
        form.append(input, submitbtn);
        this.notificationContents.interactions.append(form);
    }

    private focus(){
        this.active = true;
    }
    private blur(){
        this.active = false;
        setTimeout(() => {
           this.animate('hide');
        }, this.notificationOptions.time!);
    }

    private addClass() {
        this.notificationBody.classList.add('in-app-notification', `in-app-notification-${this.notificationOptions.type}`);
        this.notificationContents.title.classList.add('in-app-notification-title');
        this.notificationContents.header.classList.add('in-app-notification-header');
        this.notificationContents.description.classList.add('in-app-notification-description');
        this.notificationContents.attachment.classList.add('in-app-notification-attachment')
        this.notificationContents.footer.classList.add('in-app-notification-footer');
        this.notificationContents.controls.classList.add('in-app-notification-controls');
        this.notificationContents.interactions.classList.add('in-app-notification-interactions');
        this.notificationContents.menuList.classList.add('in-app-notification-menu');
    }

    showNotificatonMenu() {
        this.focus();
        this.notificationContents.menuList.classList.add('show');
    }

    animate(type: 'show' | 'hide') {
        if (this.active) return;
        if (type == 'show') {
            if (this.notificationOptions.sound) this.playSound();
            setTimeout(() => this.notificationBody.classList.add('showed'), 0);
            setTimeout(() => {
                this.animate('hide');
            }, this.notificationOptions.time!);

        } else if (type == "hide") {
            this.notificationBody.classList.remove('showed');
            setTimeout(() => {
                this.remove();
            }, this.getMillisecondsFromCssDuration(this.notificationBody.style.transitionDuration));
        }

    }

    private playSound() {
        if(typeof this.notificationOptions.sound == "string"){
            const audio = new Audio(this.notificationOptions.sound);
            audio.play();
        }else if(typeof this.notificationOptions.sound == "object"){
            this.notificationOptions.sound?.play()
        }
    }

    private remove() {
        //delete notification
        this.notificationBody.remove();
    }
    private getMillisecondsFromCssDuration(data: string) {
        //css transition duration string to number(ms)
        if (/.*ms/.test(data)) return Number(data.slice(0, -2));
        else if (/.*s/.test(data)) return Number(data.slice(0, -1)) * 1000;
        else return 2000;
    }
}
