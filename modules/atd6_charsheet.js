import {DiceRoll} from "./rolls.js";
import {CombatRoll} from "./rolls.js";
export default class ATD6_CHAR_SHEET extends ActorSheet{
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
          classes: ["atd6", "sheet", "actor"],
          template: "systems/atd6/templates/actors/player/player.html",
          width: 600,
          height: 620,
          tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "general" }],
          scrollY: ['section.sheet-body']
        });
  
    }
    getData() {
      const data = super.getData();
      if (this.actor.type == 'player') {
        this._prepareCharacterItems(data);
        this._prepareValues(data);
        this._updateInitiative(data);
      }
      return data;
    }

    _prepareCharacterItems(sheetData){
      const actorData = sheetData;
      const Heritage = [];
      const HeritageTraits = [];
      const ClassTraits = [];
      const OpenTraits = [];
		  const Weapons = [];
      const EquippedWeapons = [];
		  const Armors = [];
      const Shields = [];
      const InnateSpells = [];
      const ScrollSpells = [];
      const FavouriteInnateSpells = [];
      const FavouriteScrollSpells = [];
      const Objects = [];
      for (let i of sheetData.items){
        switch (i.type){
          case 'heritage':
          {
            if (Heritage.length <= 0){
              Heritage.push(i);
              this.actor.update ({ 'system.heritage': i.name });
              this.actor.update ({ 'system.ac.base': i.system.ac });
              this.actor.update ({ 'system.resources.health.base': i.system.health });
              this.actor.update ({ 'system.speed.base': i.system.speed });
              this.actor.update ({ 'system.languages': i.system.languages });
            } 
            else{
              ui.notifications.warn(game.i18n.localize("ATD6.messages.cantAddMore"));
              this.actor.deleteEmbeddedDocuments("Item", [i._id])
            }
            break;			  
          }
				  case 'trait':
				  {
            switch (i.system.traittype){
              case 'open':
              {
                OpenTraits.push(i);
					      break;
              }
              case 'heritage':
              {
                HeritageTraits.push(i);
					      break;
              }
              case 'class':
              {
                ClassTraits.push(i);
					      break;
              }
            }
					  break;
				  }
          case 'weapon':
          {
            let item = this.actor.items.get(i._id); 
            if (this.actor.system.competence[i.system.weapontype] == true){
              item.update ({ 'system.competent': true });
            }
            else{
              item.update ({ 'system.competent': false });
            }
            Weapons.push(i);
            if (i.system.equipped == true){EquippedWeapons.push(i);}
            break;
          }
          case 'armor':
          {
            Armors.push(i);
            break;
          }
          case 'shield':
          {
            Shields.push(i);
            break;
          }
          case 'spell':
          {
            switch (i.system.spelltype){
              case 'scroll':
              {
                ScrollSpells.push(i);
                if (i.system.favourite == true){
                  FavouriteScrollSpells.push(i);
                }
					      break;
              }
              case 'innate':
              {
                if (i.system.favourite == true){
                  FavouriteInnateSpells.push(i);
                }
                InnateSpells.push(i);
					      break;
              }
            }
					  break;
          }
          case 'object':
          {
            Objects.push(i);
            break;
          }
        }
      }
      actorData.Heritage = Heritage;
      actorData.HeritageTraits = HeritageTraits;
      actorData.ClassTraits = ClassTraits;
      actorData.OpenTraits = OpenTraits;
      actorData.Weapons = Weapons;
      actorData.EquippedWeapons = EquippedWeapons;
      actorData.Armors = Armors;
      actorData.Shields = Shields;
      actorData.InnateSpells = InnateSpells;
      actorData.ScrollSpells = ScrollSpells;
      actorData.FavouriteInnateSpells = FavouriteInnateSpells;
      actorData.FavouriteScrollSpells = FavouriteScrollSpells;
      actorData.Objects = Objects;
      actorData.isGM = game.user.isGM;
      let actor=this.actor;
      actorData.effects = actor.getEmbeddedCollection("ActiveEffect").contents

    }

    _prepareValues(sheetData){
      let totalac=Number(this.actor.system.ac.base)+Number(this.actor.system.ac.bonus)+Number(this.actor.system.ac.armor)
      let totalspeed=Number(this.actor.system.speed.base)+Number(this.actor.system.speed.bonus)
      let totalhealth=Number(this.actor.system.resources.health.base)+Number(this.actor.system.resources.health.bonus)
      this.actor.update ({ 'system.ac.total': totalac });
      this.actor.update ({ 'system.speed.total': totalspeed });
      this.actor.update ({ 'system.resources.health.max': totalhealth });
    }

    _updateInitiative(sheetData){
      let nDice=2+Number(this.actor.system.initiative.dicebonus)
      let nDiff=5+Number(this.actor.system.initiative.difbonus)
      let initiative=nDice+"d6cs>="+nDiff
      this.actor.update ({ 'system.initiative.total': initiative });
    }


    activateListeners(html)
	  {
		  super.activateListeners(html);
      html.find('a.resource-change').click(this._onResourceChange.bind(this));
      html.find('a.competence-toggle').click(this._onCompetenceToggle.bind(this));
      html.find('a.focus-toggle').click(this._onFocusToggle.bind(this));
      html.find('a.item-delete').click(this._onDeleteClick.bind(this));
      html.find('a.item-equip').click(this._onItemEquip.bind(this));
      html.find('a.item-favourite').click(this._onItemFavourite.bind(this));
      html.find('a.item-edit').click(this._onEditClick.bind(this));
      html.find('a.dice-roll').click(this._onDiceRoll.bind(this));
      html.find('a.evade-roll').click(this._onEvadeRoll.bind(this));
      html.find('a.weapon-roll').click(this._onWeaponRoll.bind(this));
      html.find(".effect-control").click(this._onEffectControl.bind(this));
    }

    async _onResourceChange(event, data)
    {
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      let value=0;
      if (Number(dataset.number)==0){
        if (Number(this.actor.system.resources[dataset.resource].value)==0){
          value=1;
        }
        else{
          value=0;
        }
      }
      else{
        value=Number(dataset.number)+1
      }
      switch (dataset.resource){
        case 'health':
        {
          this.actor.update ({'system.resources.health.value': value});
          break;
        }
      }
      return;
    }

    async _onCompetenceToggle (event, data){
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      switch (dataset.competence){
        case 'meleelight':
        {
          if (this.actor.system.competence.meleelight==true){
            await this.actor.update ({'system.competence.meleelight': false});
          }
          else{
            await this.actor.update ({'system.competence.meleelight': true});
          }
          
          break;
        }
        case 'meleeheavy':
        {
          if (this.actor.system.competence.meleeheavy==true){
            await this.actor.update ({'system.competence.meleeheavy': false});
          }
          else{
            await this.actor.update ({'system.competence.meleeheavy': true});
          }
          
          break;
        }
        case 'rangedlight':
        {
          if (this.actor.system.competence.rangedlight==true){
            await this.actor.update ({'system.competence.rangedlight': false});
          }
          else{
            await this.actor.update ({'system.competence.rangedlight': true});
          }
          break;
        }
        case 'rangedheavy':
        {
          if (this.actor.system.competence.rangedheavy==true){
            await this.actor.update ({'system.competence.rangedheavy': false});
          }
          else{
            await this.actor.update ({'system.competence.rangedheavy': true});
          }
          
          break;
        }
        case 'unarmed':
        {
          if (this.actor.system.competence.unarmed==true){
            await this.actor.update ({'system.competence.unarmed': false});
          }
          else{
            await this.actor.update ({'system.competence.unarmed': true});
          }
          
          break;
        }
        case 'improvised':
        {
          if (this.actor.system.competence.improvised==true){
            await this.actor.update ({'system.competence.improvised': false});
          }
          else{
            await this.actor.update ({'system.competence.improvised': true});
          }
          
          break;
        }
      }
      return;
    }

    async _onFocusToggle (event, data){
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      if (this.actor.system.focus==true){
        await this.actor.update ({'system.focus': false});
      }
      else {
        await this.actor.update ({'system.focus': true});
      }
      return;
    }

    async _onDeleteClick(event, data)
    {
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      const item = this.actor.items.get(dataset.id);
      Dialog.confirm({
        title: game.i18n.localize("ATD6.messages.deleteTitle"),
			  content: game.i18n.localize("ATD6.messages.deleteText"),
        yes: () => {
          if (item.type == 'heritage')
          {
            this.actor.update ({ 'system.heritage': '' });
            this.actor.update ({ 'system.ac.base': 0 });
            this.actor.update ({ 'system.resources.health.base': 0 });
            this.actor.update ({ 'system.speed.base': 0 });
            this.actor.update ({ 'system.languages': '' });
          }
          this.actor.deleteEmbeddedDocuments("Item", [dataset.id])
        },
        no: () => {},
        defaultYes: false
         });
      return;
    }

    async _onEditClick(event, data)
	  {
      event.preventDefault();
		  const dataset = event.currentTarget.dataset;
		  const item = this.actor.items.get(dataset.id);
		  item.sheet.render(true);
		  return;
    }

    async _onItemEquip(event, data)
	  {
      event.preventDefault();
		  const dataset = event.currentTarget.dataset;
		  const item = this.actor.items.get(dataset.id);
      let actor = this.actor;
		  if (item.system.equipped==true){
        item.update ({'system.equipped': false})
        if (item.type=="armor"){
          let ac=0
          actor.update ({'system.ac.armor': ac})
        }
      }
      else{
        if (item.type=="armor"){
          if (item.system.armortype=="light" || (item.system.armortype=="heavy" && actor.system.competence.heavyarmor==true)){
            for (let i of this.actor.items){
              if ((i.type=="armor")&&(i.system.equipped==true)){
                i.update ({'system.equipped': false})
              }
            }
            item.update ({'system.equipped': true})
            let ac=item.system.ac
            actor.update ({'system.ac.armor': ac})
          }
          else{
            ui.notifications.warn(game.i18n.localize("ATD6.messages.cantEquipHeavyArmor"));
          }
          
        }
        if (item.type=="shield"){
          if(actor.system.competence.shield==true){
            for (let i of this.actor.items){
              if ((i.type=="shield")&&(i.system.equipped==true)){
                i.update ({'system.equipped': false})
              }
            }
            item.update ({'system.equipped': true})
          }
          else{
            ui.notifications.warn(game.i18n.localize("ATD6.messages.cantEquipShield"));
          }
        }
        if (item.type=="weapon"){
          item.update ({'system.equipped': true})
        } 
      }
		  return;
    }

    async _onItemFavourite(event, data)
	  {
      event.preventDefault();
		  const dataset = event.currentTarget.dataset;
		  const item = this.actor.items.get(dataset.id);
		  if (item.system.favourite==true){
        item.update ({'system.favourite': false})
      }
      else{
        item.update ({'system.favourite': true})
      }
		  return;
    }

    async _onDiceRoll(event)
    {
      let html_content='<table style="background: none; border:none; text-align: center;"><tr>'
      html_content+='<td><label>'+game.i18n.localize("ATD6.dialog.difficulty")+'</label></td><td><select name="difficulty" id="difficulty" data-dtype="Number"><option value=-1>'+game.i18n.localize("ATD6.dialog.easydiff")+'</option><option value=0 selected>'+game.i18n.localize("ATD6.dialog.normaldiff")+'</option><option value=+1>'+game.i18n.localize("ATD6.dialog.difficultdiff")+'</option></select></td>'
      html_content+='</tr></table>'
      let  nDiceBonus=this.actor.system.bonus.regular.dice;
      let  nDiffBonus=this.actor.system.bonus.regular.difficulty;
      let actor_id = this.actor._id;
      let d = new Dialog({
        title: game.i18n.localize("ATD6.dialog.diceRoll"),
        content: html_content,
        buttons: {
         desventaja: {
          icon: '<i class="fa-solid fa-cube"></i>',
          label: game.i18n.localize("ATD6.dialog.disadvantage"),
          callback: () => {
            let focus=document.getElementById("focus").checked;
            let difficulty=document.getElementById("difficulty").value;
            DiceRoll(actor_id,'desventaja',focus,difficulty, nDiceBonus, nDiffBonus)
          }
         },
         normal: {
          icon: '<i class="fa-solid fa-dice"></i>',
          label: game.i18n.localize("ATD6.dialog.normal"),
          callback: () => {
            let focus=document.getElementById("focus").checked;
            let difficulty=document.getElementById("difficulty").value;
            DiceRoll(actor_id,'normal',focus,difficulty, nDiceBonus, nDiffBonus)
          }
         },
         ventaja: {
          icon: '<i class="fa-solid fa-cubes"></i>',
          label: game.i18n.localize("ATD6.dialog.advantage"),
          callback: () => {
            let focus=document.getElementById("focus").checked;
            let difficulty=document.getElementById("difficulty").value;
            DiceRoll(actor_id,'ventaja',focus,difficulty, nDiceBonus, nDiffBonus)
          }
         }
        },
        default: "normal",
        render: html => console.log("Register interactivity in the rendered dialog"),
        close: html => console.log("This always is logged no matter which option is chosen")
       });
       d.render(true);
      return;
    }

    async _onEvadeRoll(event)
    {
      let actor_id = this.actor._id;
      let  nDiceBonus=this.actor.system.bonus.evade.dice;
      let  nDiffBonus=this.actor.system.bonus.evade.difficulty;
      let focus=false;
      let difficulty=0;let actor=this.actor
      let equippedshield=actor.items.find((k) => k.type === "shield" && k.system.equipped == true);
      if (equippedshield){
        nDiceBonus++
      }
      DiceRoll(actor_id,'evade',focus,difficulty, nDiceBonus, nDiffBonus)
      return;
    }

    async _onWeaponRoll(event)
    {
      const dataset = event.currentTarget.dataset;
      let actor = this.actor
      let actor_id = this.actor._id
      let item=this.actor.items.get(dataset.item_id) 
      let target= Array.from(game.user.targets)[0]?.actor;
      let rollType = ""
      if (item.system.competent == true){
        if (item.system.mastered == true){
          rollType = 'ventaja'
        }
        else {
          rollType = 'normal'
        }
      }
      else {
        rollType = 'desventaja'
      }
      let difficulty=5
      
      if (target){
        difficulty=target.system.ac.total
      }
      let focus=actor.system.focus
      let weaponDamage = item.system.damage
      let nDiceBonus = actor.system.bonus.combat.dice
      let nDiffBonus = actor.system.bonus.combat.difficulty
      let nDiceFocusBonus = actor.system.bonus.focusroll.dice
      let nDiffFocusBonus = actor.system.bonus.focusroll.difficulty
      let nFocusDamageBonus = actor.system.bonus.focusdamage.total
      let nFocusDamageEachBonus = actor.system.bonus.focusdamage.each
      let nDamageBonus = actor.system.bonus.damage.total
      let nDamageEachBonus = actor.system.bonus.damage.each
      CombatRoll(actor_id,rollType, focus, difficulty, weaponDamage, nDiceBonus, nDiffBonus, nDiceFocusBonus, nDiffFocusBonus, nFocusDamageBonus, nFocusDamageEachBonus, nDamageBonus, nDamageEachBonus)
      return;
    }

    _onEffectControl(event) {
      event.preventDefault();
      const element = event.currentTarget;
      const dataset = event.currentTarget.dataset;
      const owner = this.actor;
      let tr = element.closest("tr");
      const effect = tr?.dataset?.effectId ? owner.effects.get(tr?.dataset?.effectId) : null;
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
            {
              console.log (effect);
                if (effect.name=="Dead")
                  {
                    owner.parent.update({overlayEffect:""});
                  }
                return effect.delete();
            }
              
      }
    }

  
  }