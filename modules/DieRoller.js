import {DiceRollV2} from "../modules/rolls.js";

export default class DieRoller extends FormApplication {
    constructor(options) {
	    super(options);

    }
        
    static get defaultOptions() {
        let template=""
        if (game.user.isGM==true){
            template="systems/atd6/templates/dialogs/dice-rollerGM.html"
        }
        else{
            template="systems/atd6/templates/dialogs/dice-roller.html"
        }
        return mergeObject(super.defaultOptions, {
            id: "die-roller",
            title: game.i18n.localize("atd6.system.dieRoller"),
            template: template,
            classes: [ "atd6", "die-roller"],
            popout: false,
            buttons: [],
        });
    }

    getPos() {
        this.pos = game.user.getFlag("atd6", "dieRollerPosition");

        if (!this.pos || (this.pos.length === 0)) {
            let hbpos = $('#hotbar').position();
            let width = $('#hotbar').width();
            this.pos = { left: hbpos.left + width + 4, right: '', top: '', bottom: 110 };

            game.user.setFlag("atd6", "dieRollerPosition", this.pos);
        }

        let result = '';
        if (this.pos != undefined) {
            result = Object.entries(this.pos).filter(k => {
                return (''+ k[1]) !== '';
            }).map(k => {
                return k[0] + ":" + k[1] + ((''+ k[1]).indexOf('px') > 1 ? '' : 'px');
            }).join('; ') + ';';
        }

        return result;
    }

    setPos() {


        let cssPosition = this.getPos();
        let position = this.pos;

        $(this.element).css(cssPosition);
        
        this.position.left = position.left || null;
        if (this.position.left) { Math.round(this.position.left); }

        if (position.bottom) {
            this.position.top = Math.round(window.innerHeight - position.bottom);
        } else if (position.top) {
            this.position.top = Math.round(position.top);
        }

        return this;
    }

    activateListeners(html)
    {

        //html.find(".roll-dice").on('click', this._onDieRoll.bind(this));
        html.find(".roll-dice").on('click', this._onDieRoll.bind(this));

        html.find(".intrusion").on('click', this._onIntrussion.bind(this));
        html.find(".resolve-remove").on('click', this._onResolveRemove.bind(this));
        html.find(".resolve-add").on('click', this._onResolveAdd.bind(this));
        html.find(".karma-remove").on('click', this._onKarmaRemove.bind(this));
        html.find(".karma-add").on('click', this._onKarmaAdd.bind(this));
        html.find(".defeat-toggle").on('click', this._onDefeatToggle.bind(this));
        html.find(".death-toggle").on('click', this._onDeathToggle.bind(this));


        let elmnt = html.find("#die-roller-move-handle");
        let dieRoller = elmnt.closest('.window-app');
        let newPosX = 0, newPosY = 0, startPosX = 0, startPosY = 0;

        elmnt.on("mousedown", e => {
            e = e || window.event;
            e.preventDefault();
    
            // get the starting position of the cursor
            startPosX = e.clientX;
            startPosY = e.clientY;

            // Set settings if they don't exist
        
            dieRoller[0].style = dieRoller[0].style ?? { top: (''+ math.round(startPosY) + 'px'), left: (''+ Math.round(startPosX) + 'px') };

            document.onmousemove = mouseMove;
            document.onmouseup = () => {
                this.pos = { top: newPosY, left: newPosX };
                game.user.setFlag("atd6", 'dieRollerPosition', this.pos);

                document.onmousemove = null;
                document.onmouseup = null;
            };

        });

        let mouseMove = e => {
            e = e || window.event;

            // calculate the new position
            newPosX = startPosX - e.movementX;
            newPosY = startPosY - e.movementY;

            // with each move we also want to update the start X and Y
            startPosX = e.clientX;
            startPosY = e.clientY;
        
            // set the element's new position:
            dieRoller[0].style.top = ''+ newPosY + "px";
            dieRoller[0].style.left = ''+ newPosX + "px";
        };

        super.activateListeners(html);
    }
    
    async _onDieRoll(event)
    {
        event.preventDefault();
        DiceRollV2(event);
        return;
    }

    async _onIntrussion(event)
    {
        event.preventDefault();
        let actor
        let msg_content
        let chatData
        if (canvas.tokens.controlled[0])
        {
            actor=canvas.tokens.controlled[0].document.actor;
        }
        else
        {
            ui.notifications.warn(game.i18n.localize("TRI.ui.noSelectedToken"));
            return 1;
        }
        if (actor.type=="Player")
        {
            msg_content="<div class=\"atd6 test-result\"><h3 class=\"enabled\">"+game.i18n.localize("TRI.ui.proposeIntrusion")+"</h3></div>"
            if (event.shiftKey) {
                msg_content+="<div class=\"atd6 test-result\"><a class=\"gainResolve\" data-actor_id="+actor._id+" data-current_resolve="+actor.system.resources.resolve.value+"><h3 class=\"resolve-button\">"+game.i18n.localize("TRI.ui.resolveIntrusion")+"</h3></a></div>"
                if (actor.system.resources.resolve.value==actor.system.resources.resolve.max){
                    ui.notifications.warn(game.i18n.localize("TRI.ui.cantIntrusion"));
                    return 1
                }
            }
            else
            {
                msg_content+="<div class=\"atd6 test-result\"><a class=\"gainKarma\" data-actor_id="+actor._id+" data-current_karma="+actor.system.resources.karma.value+"><h3 class=\"karma-button\">"+game.i18n.localize("TRI.ui.karmaIntrusion")+"</h3></a></div>"
                if (actor.system.resources.karma.value==actor.system.resources.karma.max){
                    ui.notifications.warn(game.i18n.localize("TRI.ui.cantIntrusion"));
                    return 1 
                }
            }
            chatData = {
                content: msg_content,
                speaker: ChatMessage.getSpeaker()
            };
            ChatMessage.create(chatData);
        }
        return;
    }
    
    async _onResolveRemove(event)
    {
        event.preventDefault();
        const dataset = event.currentTarget.dataset;
        let actor
        let message=""
        let resolve=0
        let max_resolve=0
        let effort=0
        let max_effort=0
        if (canvas.tokens.controlled[0])
        {
            actor=canvas.tokens.controlled[0].document.actor;
        }
        else
        {
            ui.notifications.warn(game.i18n.localize("TRI.ui.noSelectedToken"));
            return 1;
        }
        if (actor.type=="Player")
        {
            resolve=actor.system.resources.resolve.value
            max_resolve=actor.system.resources.resolve.max
            let chatData = {}
            let msg_content =""
            if (event.shiftKey) {
                if (game.user.isGM == true)
                {
                    max_resolve--
                    if (max_resolve < 1){max_resolve=1}
                    else{
                        message=game.i18n.localize("TRI.ui.removeMaxResolve")+actor.name
                        ui.notifications.info(message);
                    }
                    await actor.update ({ 'system.resources.resolve.max': max_resolve });
                    if (resolve > max_resolve){
                        resolve=max_resolve
                        await actor.update ({ 'system.resources.resolve.value': resolve });
                    }
                }
            }
            else{
                resolve--
                if (resolve < 0){resolve=0}
                else{
                    msg_content="<div class=\"atd6 test-result\"><h3 class=\"resolve-button\">"+game.i18n.localize("TRI.ui.loseResolve")+"</h3></div>"
                    chatData = {
                        content: msg_content,
                        speaker: ChatMessage.getSpeaker()
                    };
                    ChatMessage.create(chatData);
                }
                await actor.update ({ 'system.resources.resolve.value': resolve });
            }
        }
        else{
            effort=actor.system.resources.effort.value
            max_effort=actor.system.resources.effort.max
            if (event.shiftKey) {
                if (game.user.isGM == true)
                {
                    max_effort--
                    if (max_effort < 1){max_effort=1}
                    else{
                        message=game.i18n.localize("TRI.ui.removeMaxEffort")+actor.name
                        ui.notifications.info(message);
                    }
                    await actor.update ({ 'system.resources.effort.max': max_effort });
                    if (effort > max_effort){
                        effort=max_effort
                        await actor.update ({ 'system.resources.effort.value': effort });
                    }
                }
            }
            else{
                effort--
                if (effort < 0){effort=0}
                else{
                    message=game.i18n.localize("TRI.ui.removeEffort")+actor.name
                    ui.notifications.info(message);
                }
                await actor.update ({ 'system.resources.effort.value': effort });
            }
        }
        return;
    }

    async _onResolveAdd(event)
    {
        event.preventDefault();
        const dataset = event.currentTarget.dataset;
        let actor
        let message=""
        let resolve=0
        let max_resolve=0
        let effort=0
        let max_effort=0
        if (canvas.tokens.controlled[0])
        {
            actor=canvas.tokens.controlled[0].document.actor;
        }
        else
        {
            ui.notifications.warn(game.i18n.localize("TRI.ui.noSelectedToken"));
            return 1;
        }
        if (actor.type=="Player")
        {
            resolve=actor.system.resources.resolve.value
            max_resolve=actor.system.resources.resolve.max
            if (event.shiftKey) {
                if (game.user.isGM == true)
                {
                    max_resolve++
                    if (max_resolve > 6){max_resolve=6}
                    else{
                        message=game.i18n.localize("TRI.ui.addMaxResolve")+actor.name
                        ui.notifications.info(message);
                    }
                    await actor.update ({ 'system.resources.resolve.max': max_resolve });
                }
            }
            else
            {
                resolve++
                if (resolve > max_resolve){resolve=max_resolve}
                else {
                    message=game.i18n.localize("TRI.ui.addResolve")+actor.name
                    ui.notifications.info(message);
                }
                await actor.update ({ 'system.resources.resolve.value': resolve });
            }
        }
        else{
            effort=actor.system.resources.effort.value
            max_effort=actor.system.resources.effort.max
            if (event.shiftKey) {
                if (game.user.isGM == true)
                {
                    max_effort++
                    if (max_effort > 36){max_effort=36}
                    else{
                        message=game.i18n.localize("TRI.ui.addMaxEffort")+actor.name
                        ui.notifications.info(message);
                    }
                    await actor.update ({ 'system.resources.effort.max': max_effort });
                }
            }
            else
            {
                effort++
                if (effort > max_effort){effort=max_effort}
                else{
                    message=game.i18n.localize("TRI.ui.addEffort")+actor.name
                    ui.notifications.info(message);
                }
                await actor.update ({ 'system.resources.effort.value': effort });
            }
        } 
        
        return;
    }

    async _onKarmaRemove(event)
    {
        event.preventDefault();
        const dataset = event.currentTarget.dataset;
        let actor
        let message=""
        if (canvas.tokens.controlled[0])
        {
            actor=canvas.tokens.controlled[0].document.actor;
        }
        else
        {
            ui.notifications.warn(game.i18n.localize("TRI.ui.noSelectedToken"));
            return 1;
        }
        if (actor.type=="Player")
        {
            let karma=actor.system.resources.karma.value
            let max_karma=actor.system.resources.karma.max
            let chatData = {}
            let msg_content =""
            if (event.shiftKey) {
                if (game.user.isGM == true)
                {
                    max_karma--
                    if (max_karma < 1){max_karma=1}
                    else{
                        message=game.i18n.localize("TRI.ui.removeMaxKarma")+actor.name
                        ui.notifications.info(message);
                    }
                    await actor.update ({ 'system.resources.karma.max': max_karma });
                    if (karma > max_karma){
                        karma=max_karma
                        await actor.update ({ 'system.resources.karma.value': karma });
                    }
                }
            }
            else{
                karma--
                if (karma < 0){karma=0}
                else{
                    msg_content="<div class=\"atd6 test-result\"><h3 class=\"karma-button\">"+game.i18n.localize("TRI.ui.loseKarma2")+"</h3></div>"
                    chatData = {
                        content: msg_content,
                        speaker: ChatMessage.getSpeaker()
                    };
                    ChatMessage.create(chatData);
                }
                await actor.update ({ 'system.resources.karma.value': karma });
            }
        }
        return;
    }

    async _onKarmaAdd(event)
    {
        event.preventDefault();
        const dataset = event.currentTarget.dataset;
        let actor
        let message=""
        if (canvas.tokens.controlled[0])
        {
            actor=canvas.tokens.controlled[0].document.actor;
        }
        else
        {
            ui.notifications.warn(game.i18n.localize("TRI.ui.noSelectedToken"));
            return 1;
        }
        if (actor.type=="Player")
        {
            let karma=actor.system.resources.karma.value
            let max_karma=actor.system.resources.karma.max
            if (event.shiftKey) {
                if (game.user.isGM == true)
                {
                max_karma++
                if (max_karma > 6){max_karma=6}
                else {
                    message=game.i18n.localize("TRI.ui.addMaxKarma")+actor.name
                    ui.notifications.info(message);
                }
                await actor.update ({ 'system.resources.karma.max': max_karma });
                }
            }
            else
            {
                karma++
                if (karma > max_karma){karma=max_karma}
                else{
                    message=game.i18n.localize("TRI.ui.addKarma")+actor.name
                    ui.notifications.info(message);
                }
                await actor.update ({ 'system.resources.karma.value': karma });
            }
        } 
        return;
    }

    async _onDefeatToggle(event)
    {
        console.log ("DEFEAT TOGGLE")
        event.preventDefault();
        const dataset = event.currentTarget.dataset;
        let actor
        let token
        let message=""
        if (canvas.tokens.controlled[0])
        {
            actor=canvas.tokens.controlled[0].document.actor;
            token=canvas.tokens.controlled[0]
            await token.toggleEffect('icons/svg/falling.svg', { overlay: true});
        }
        else
        {
            ui.notifications.warn(game.i18n.localize("TRI.ui.noSelectedToken"));
            return 1;
        }
        
        return;
    }

    async _onDeathToggle(event)
    {
        console.log ("DEATH TOGGLE")
        event.preventDefault();
        const dataset = event.currentTarget.dataset;
        let actor
        let token
        let message=""
        if (canvas.tokens.controlled[0])
        {
            actor=canvas.tokens.controlled[0].document.actor;
            token=canvas.tokens.controlled[0]
            await token.toggleEffect('icons/svg/skull.svg', { overlay: true});
        }
        else
        {
            ui.notifications.warn(game.i18n.localize("TRI.ui.noSelectedToken"));
            return 1;
        }

        return;
    }

}
