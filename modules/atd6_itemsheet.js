export default class ATD6_ITEM_SHEET extends ItemSheet{
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
          classes: ["atd6", "sheet", "item"],
          template: "systems/atd6/templates/actors/character.html",
          width: 400,
          height: 530
        });
  
    }
    get template(){
        return `systems/atd6/templates/items/${this.item.type}.html`;
    }


  
  }