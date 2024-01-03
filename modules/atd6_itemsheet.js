export default class ATD6_ITEM_SHEET extends ItemSheet{
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
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

    async getData() {
      const baseData = super.getData();
      let item = baseData.item;

      return {
          owner: this.item.isOwner,
          editable: this.isEditable,
          item: item,
          system: item.system,
          effects: item.getEmbeddedCollection("ActiveEffect").contents
      };
    }

    activateListeners(html) {
      super.activateListeners(html);
      if (this.isEditable) {
          html.find(".effect-control").click(this._onEffectControl.bind(this));
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


  
  }