import {DurabilityRoll} from "./rolls.js";
export default class ATD6_ITEM_SHEET extends ItemSheet{
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
          classes: ["atd6", "sheet", "item"],
          template: "systems/atd6/templates/actors/character.html",
          width: 400,
          height: 530,
          tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "general" }],
        });
  
    }
    get template(){
        return `systems/atd6/templates/items/${this.item.type}/${this.item.type}.html`;
    }

    getData() {
      const data = super.getData();
      let item = data.item;
      data.owner= this.item.isOwner
      data.editable=this.isEditable
      data.item=item
      data.system=item.system
      data.effects=item.getEmbeddedCollection("ActiveEffect").contents
      data.tipoArmadura = {
        light: game.i18n.localize("ATD6.ui.light"),
        heavy: game.i18n.localize("ATD6.ui.heavy"),
      }
      data.tipoRasgo = {
        open: game.i18n.localize("ATD6.ui.open"),
        heritage: game.i18n.localize("ATD6.ui.heritage"),
        class: game.i18n.localize("ATD6.ui.class")
      }
      data.tipoArma = {
        meleelight: game.i18n.localize("ATD6.ui.meleelight"),
        meleeheavy: game.i18n.localize("ATD6.ui.meleeheavy"),
        rangedlight: game.i18n.localize("ATD6.ui.rangedlight"),
        rangedheavy: game.i18n.localize("ATD6.ui.rangedheavy"),
        unarmed: game.i18n.localize("ATD6.ui.unarmed"),
        improvised: game.i18n.localize("ATD6.ui.improvised")
      }
      return data;
    }


    activateListeners(html) {
      super.activateListeners(html);
      if (this.isEditable) {
          html.find(".effect-control").click(this._onEffectControl.bind(this));
          html.find(".durability-roll").click(this._onDurabilityRoll.bind(this));
      }
    }

    _onEffectControl(event) {
      event.preventDefault();
      const element = event.currentTarget;
      const dataset = event.currentTarget.dataset;
      const owner = this.item;
      let tr = element.closest("tr");
      const effect = tr?.dataset?.effectId ? owner.effects.get(tr?.dataset?.effectId) : null;
      console.log ("EFFECT")
      console.log (effect)
      switch (dataset.action) {
          case "create":
              return owner.createEmbeddedDocuments("ActiveEffect", [{
                  label: "New Effect",
                  icon: "/systems/atd6/style/icons/aura.svg",
                  origin: owner.uuid,
                  disabled: false
              }]);
          case "edit":
              return effect.sheet.render(true);
          case "delete":
              return effect.delete();
      }
    }

    async _onDurabilityRoll(event, data)
	  {
      event.preventDefault();
		  const dataset = event.currentTarget.dataset;
		  const item = this.actor.items.get(dataset.item_id);
		  if (item.system.durability > 0){
        DurabilityRoll (this.actor._id,dataset.item_id)
      }
		  return;
    }
  
  }