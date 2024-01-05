export default class atd6Chat {
    static chatListeners (html) {
      html.on('click', '.applydamage', this._applyDamage.bind(this));
    }

    static _applyDamage (event, data){
      const dataset = event.currentTarget.dataset;
      const element = event.currentTarget;
      let target = Array.from(game.user.targets)[0]?.actor;
      if (target){
        let currentdamage=Number(target.system.resources.health.value)
        let maxdamage=Number(target.system.resources.health.max)
        currentdamage+=Number(dataset.damage)
        if(currentdamage > maxdamage){currentdamage=maxdamage}
        target.update ({ 'system.resources.health.value': currentdamage });
        ui.notifications.info(target.name+" "+game.i18n.localize("ATD6.messages.receivedamage")+dataset.damage);
        if (currentdamage >= maxdamage){
          ui.notifications.info(target.name+" "+game.i18n.localize("ATD6.messages.dies"));
          target.createEmbeddedDocuments("ActiveEffect", [{name: "Dead", statuses:["dead"]}])
          let targettoken = Array.from(game.user.targets)[0];
          targettoken.document.update({overlayEffect:"icons/svg/skull.svg"});
        }
      }
      else {
        ui.notifications.warn(game.i18n.localize("ATD6.messages.notarget"));
      }
      
    }
}