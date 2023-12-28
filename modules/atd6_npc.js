export default class ATD6_CHALLENGE_SHEET extends ActorSheet{
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
          classes: ["atd6", "sheet", "actor"],
          template: "systems/atd6/templates/actors/npc.html",
          width: 600,
          height: 505,
          tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "general" }]
        });
  
    }
    getData() {
      const data = super.getData();
      return data;
    }

    activateListeners(html)
	  {
		  super.activateListeners(html);
      html.find('a.rank-change').click(this._onRankIncrease.bind(this));
      html.find('a.rank-change').contextmenu(this._onRankDecrease.bind(this));
      html.find('a.effort-change').contextmenu(this._onEffortIncrease.bind(this));
      html.find('a.effort-change').click(this._onEffortDecrease.bind(this));
    }
  
    async _onRankIncrease(event, data)
    {
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      let rank=this.actor.system.rank
      rank++
      if (rank > 6){rank=6}
      await this.actor.update ({ 'system.rank': rank });
      return;
    }

    async _onRankDecrease(event, data)
    {
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      let rank=this.actor.system.rank
      rank--
      if (rank < 1){rank=1}
      await this.actor.update ({ 'system.rank': rank });
      return;
    }

    async _onEffortIncrease(event, data)
    {
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      let effort=this.actor.system.resources.effort.value
      let max_effort=this.actor.system.resources.effort.max
      console.log ("EFFORT: "+effort+" MAX: "+max_effort)
      if (event.shiftKey) {
        max_effort++
        if (max_effort > 36){max_effort=36}
        await this.actor.update ({ 'system.resources.effort.max': max_effort });
      }
      else
      {
        effort++
        if (effort > max_effort){effort=max_effort}
        await this.actor.update ({ 'system.resources.effort.value': effort });
      } 
      return;
    }

    async _onEffortDecrease(event, data)
    {
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      let effort=this.actor.system.resources.effort.value
      let max_effort=this.actor.system.resources.effort.max
      console.log ("EFFORT: "+effort+" MAX: "+max_effort)
      if (event.shiftKey) {
        max_effort--
        if (max_effort < 1){max_effort=1}
        await this.actor.update ({ 'system.resources.effort.max': max_effort });
        if (effort > max_effort){
          effort=max_effort
          await this.actor.update ({ 'system.resources.effort.value': effort });
        }
      }
      else{
        effort--
        if (effort < 0){effort=0}
        await this.actor.update ({ 'system.resources.effort.value': effort });
      }
      
      return;
    }
  
  }