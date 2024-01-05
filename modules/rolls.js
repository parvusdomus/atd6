export async function DiceRoll(actor_id, rollType, focus, difficulty, nDiceBonus, nDiffBonus, combat, marksman)
{
    let tirada= ""
    let testResult=""
    let nExitos=0
    let nUnos=0
    let nSeises=0
    let rollText=""
    let dados=[];
    let nDice=0;
    let nDiff=5+Number(difficulty)+Number(nDiffBonus);

    switch (rollType){
        case 'ventaja':
        {
          nDice=3;
          break;
        }
        case 'normal':
        {
            nDice=2;
            break;
        }
        case 'desventaja':
        {
            nDice=1;
            break;
        }
        case 'evade':
        {
            nDice=1;
            rollText+="<label>"+game.i18n.localize("ATD6.chat.evadeRoll")+"</label><br>"
            break;
        }

    }
    if (focus==true && combat==true){
        nDiff--;
        if (marksman==true){
            nDiff--;
        }
    }

    let actor = game.actors.get(actor_id)
    nDice+=Number(nDiceBonus);
    tirada=nDice+"d6"
    rollText+="<label>"+tirada+" VS "+nDiff+"</label>"
    let d6Roll = await new Roll(String(tirada)).roll({async: false});
    //let critEnabled = game.settings.get('tinyd6', 'enableCritical');
    let critEnabled=true;
    for (let i = 0; i < nDice; i++) {
        if ((d6Roll.terms[0].results[i].result >= nDiff && d6Roll.terms[0].results[i].result > 1) || d6Roll.terms[0].results[i].result > 6){nExitos++}
        if (d6Roll.terms[0].results[i].result == 1){nUnos++}
        if (d6Roll.terms[0].results[i].result == 6){nSeises++}
        dados.push(d6Roll.terms[0].results[i].result);
    }
    if (nExitos >= 1){
        testResult="<h3 class=\"regular-success\">"+game.i18n.localize("ATD6.chat.regularSuccess")+"</h3>"
        if ((nSeises >= 2) && (critEnabled==true)){
            testResult="<h3 class=\"critical-success\">"+game.i18n.localize("ATD6.chat.criticalSuccess")+"</h3>"
        }
    }
    else{
        testResult="<h3 class=\"regular-failure\">"+game.i18n.localize("ATD6.chat.regularFailure")+"</h3>"
        if ((nUnos >= 2) && (critEnabled==true)){
            testResult="<h3 class=\"critical-failure\">"+game.i18n.localize("ATD6.chat.criticalFailure")+"</h3>"
        }
    }
    

    let renderedRoll = await renderTemplate("systems/atd6/templates/chat/test-result.html", { 
        rollResult: d6Roll, 
        actor_id: actor_id,
        dados:dados,
        nDice: nDice,
        rollText: rollText,
        nDiff: nDiff,
        testResult: testResult
    });

    const chatData = {
        speaker: actor_id,
        content: renderedRoll
    };

    d6Roll.toMessage(chatData);
    return;
}

export function diceToFaces(value, content)
{
    switch (Number(value))
    {
        case 1:
            return "fa-dice-one";
        case 2:
            return "fa-dice-two";
        case 3:
            return "fa-dice-three";
        case 4:
            return "fa-dice-four";
        case 5:
            return "fa-dice-five";
        case 6:
            return "fa-dice-six";
    }

    return "fa-dice-d6";
}

export async function CombatRoll(actor_id, rollType, focus, difficulty, weaponDamage, nDiceBonus, nDiffBonus, nDiceFocusBonus, nDiffFocusBonus, nFocusDamageBonus, nFocusDamageEachBonus, nDamageBonus, nDamageEachBonus)
{
    let tirada= ""
    let testResult=""
    let damageResult=""
    let nExitos=0
    let nUnos=0
    let nSeises=0
    let rollText=""
    let dados=[];
    let nDice=0;
    let nDiff=Number(difficulty)+Number(nDiffBonus);
    let totaldamage=0
    let totalweapondamage=Number(weaponDamage)+Number(nDamageEachBonus)
    let totalbonusdamage=Number(nDamageBonus)
    console.log (rollType)
    switch (rollType){
        case 'ventaja':
        {
          nDice=3;
          break;
        }
        case 'normal':
        {
            nDice=2;
            break;
        }
        case 'desventaja':
        {
            nDice=1;
            break;
        }

    }
    let actor = game.actors.get(actor_id)
    if (focus==true){
        nDiff--;
        nDiff+=nDiffFocusBonus;
        totalweapondamage+=Number(nFocusDamageEachBonus)
        totalbonusdamage+=Number(nFocusDamageBonus)
        nDice+=Number(nDiceFocusBonus)
        actor.update ({ 'system.focus': false });
        console.log ("CON FOCO")
        console.log (actor.system.focus)
    }
    nDice+=Number(nDiceBonus);
    tirada=nDice+"d6"
    rollText+="<label>"+tirada+" VS "+nDiff+"</label>"
    let d6Roll = await new Roll(String(tirada)).roll({async: false});
    //let critEnabled = game.settings.get('tinyd6', 'enableCritical');
    let critEnabled=true;
    for (let i = 0; i < nDice; i++) {
        if ((d6Roll.terms[0].results[i].result >= nDiff && d6Roll.terms[0].results[i].result > 1) || d6Roll.terms[0].results[i].result > 6){nExitos++}
        if (d6Roll.terms[0].results[i].result == 1){nUnos++}
        if (d6Roll.terms[0].results[i].result == 6){nSeises++}
        dados.push(d6Roll.terms[0].results[i].result);
    }
    if (nExitos >= 1){
        testResult="<h3 class=\"regular-success\">"+game.i18n.localize("ATD6.chat.regularSuccess")+"</h3>"
        totaldamage=(Number(nExitos)*Number(totalweapondamage))+totalbonusdamage
        if ((nSeises >= 2) && (critEnabled==true)){
            testResult="<h3 class=\"critical-success\">"+game.i18n.localize("ATD6.chat.criticalSuccess")+"</h3>"
            totaldamage++
        }
        damageResult="<h3 class=\"damage-result applydamage\" data-damage=\""+totaldamage+"\">"+game.i18n.localize("ATD6.ui.damage")+": "+totaldamage+"</h3>"
    }
    else{
        testResult="<h3 class=\"regular-failure\">"+game.i18n.localize("ATD6.chat.regularFailure")+"</h3>"
        if ((nUnos >= 2) && (critEnabled==true)){
            testResult="<h3 class=\"critical-failure\">"+game.i18n.localize("ATD6.chat.criticalFailure")+"</h3>"
        }
    }
    

    let renderedRoll = await renderTemplate("systems/atd6/templates/chat/combat-test-result.html", { 
        rollResult: d6Roll, 
        actor_id: actor_id,
        dados:dados,
        nDice: nDice,
        rollText: rollText,
        nDiff: nDiff,
        testResult: testResult,
        damageResult: damageResult
    });

    const chatData = {
        //speaker: ChatMessage.getSpeaker(),
        speaker: actor_id,
        content: renderedRoll
    };

    d6Roll.toMessage(chatData);
    return;
}