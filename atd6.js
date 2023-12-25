import ATD6_CHAR_SHEET from "./modules/atd6_charsheet.js";
import ATD6_NPC_SHEET from "./modules/atd6_npc.js";
import ATD6_ITEM_SHEET from "./modules/atd6_itemsheet.js";
import { preloadHandlebarsTemplates } from "./modules/preloadTemplates.js";
import DieRoller from "./modules/DieRoller.js";
import {_getInitiativeFormula} from './modules/combat.js';
import {diceToFaces} from "./modules/rolls.js";
import atd6Chat from "./modules/chat.js";



Hooks.once("init", function(){
  document.getElementById("logo").src = "/systems/atd6/style/images/atd6_Logo2.webp";
  console.log("test | INITIALIZING ATD6 CHARACTER SHEETS...");
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("atd6", ATD6_CHAR_SHEET, {
    makeDefault: true,
    types: ['Player']
  });
  Actors.registerSheet("atd6", ATD6_NPC_SHEET, {
    makeDefault: true,
    types: ['NPC']
  });
  console.log("test | INITIALIZING ATD6 ITEM SHEETS...");
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("atd6", ATD6_ITEM_SHEET,{
    makeDefault: true,
    types: ['perk','quirk','affliction','knack']
  });
  preloadHandlebarsTemplates();

    // Slowing down pings
    CONFIG.Canvas.pings.styles.pulse.duration = 2000
    CONFIG.Canvas.pings.styles.alert.duration = 2000
    CONFIG.Canvas.pings.styles.arrow.duration = 2000

  console.log("test | INITIALIZING ATD6 SETTINGS...");

  game.settings.register("atd6", "dieRollerPosition", {
    scope: "client",
    config: false,
    default: null,
    type: Object
  });

  game.settings.register("atd6", "enableRank", {
    name: game.i18n.localize("ATD6.config.enableRankName"),
    hint: game.i18n.localize("ATD6.config.enableRankHint"),
    scope: "world",
    type: Boolean,
    default: false,
    requiresReload: true,
    config: true
  });

  game.settings.register("atd6", "enableStyles", {
    name: game.i18n.localize("ATD6.config.enableStylesName"),
    hint: game.i18n.localize("ATD6.config.enableStylesHint"),
    scope: "world",
    type: Boolean,
    default: false,
    requiresReload: true,
    config: true
  });

  game.settings.register("atd6", "enableKnacks", {
    name: game.i18n.localize("ATD6.config.enableKnacksName"),
    hint: game.i18n.localize("ATD6.config.enableKnacksHint"),
    scope: "world",
    type: Boolean,
    default: false,
    requiresReload: true,
    config: true
  });

  game.settings.register("atd6", "enableSubTraits", {
    name: game.i18n.localize("ATD6.config.enableSubTraitsName"),
    hint: game.i18n.localize("ATD6.config.enableSubTraitsHint"),
    scope: "world",
    type: Boolean,
    default: false,
    requiresReload: true,
    config: true
  });

  game.settings.register("atd6", "enableSubStyles", {
    name: game.i18n.localize("ATD6.config.enableSubStylesName"),
    hint: game.i18n.localize("ATD6.config.enableSubStylesHint"),
    scope: "world",
    type: Boolean,
    default: false,
    requiresReload: true,
    config: true
  });

  game.settings.register('atd6', 'bgImage', {
    name: game.i18n.localize("ATD6.config.bgImageName"),
    hint: game.i18n.localize("ATD6.config.bgImageHint"),
    type: String,
    default: 'systems/atd6/style/images/white.webp',
    scope: 'world',
    requiresReload: true,
    config: true,
    filePicker: 'image',
  });

  game.settings.register('atd6', 'chatBgImage', {
    name: game.i18n.localize("ATD6.config.chatBgImageName"),
    hint: game.i18n.localize("ATD6.config.chatBgImageHint"),
    type: String,
    default: 'systems/atd6/style/images/white.webp',
    scope: 'world',
    requiresReload: true,
    config: true,
    filePicker: 'image',
  });

  game.settings.register('atd6', 'titleFont', {
    name: game.i18n.localize("ATD6.config.titleFontName"),
    hint: game.i18n.localize("ATD6.config.titleFontHint"),
    config: true,
    type: String,
    scope: 'world',
    choices: {
      "Dominican": "Default Tricube Tales Font",
      "Werewolf_Moon": "A Welsh Werewolf",
      "East_Anglia": "Accursed: Dark Tales of Morden",
      "WHITC": "Christmas Capers",
      "RexliaRg": "Chrome Shells and Neon Streets",
      "Nautilus": "Down in the Depths",
      "Yagathan": "Eldritch Detectives",
      "Amble": "Firefighters",
      "MountainsofChristmas": "Goblin Gangsters",
      "BLACC": "Heroes of Sherwood Forest",
      "Creepster": "Horrible Henchmen",
      "Duvall": "Hunters of Victorian London",
      "mandalore": "Interstellar Bounty Hunters",
      "Starjedi": "Interstellar Laser Knights",
      "xirod": "Interstellar Mech Wars",
      "Mandalore_Halftone": "Interstellar Rebels",
      "pirulen": "Interstellar Smugglers",
      "Arkhip": "Interstellar Troopers",
      "MysteryQuest": "Maidenstead Mysteries",
      "Bangers": "Metahuman Uprising",
      "OhioKraft": "Minerunners",
      "WIZARDRY": "Paths Between the Stars",
      "TradeWinds": "Pirates of the Bone Blade",
      "Foul": "Rotten Odds",
      "BLOODY": "Samhain Slaughter",
      "Cinzel": "Sharp Knives and Dark Streets",
      "IMPOS5": "Spellrunners",
      "Almendrasc": "Stranger Tales",
      "StoneAge": "Stone Age Hunters",
      "IMMORTAL": "Summer Camp Slayers",
      "MetalMacabre": "Sundered Chains",
      "Bagnard": "Tales of the City Guard",
      "MountainsofChristmas": "Tales of the Goblin Horde",
      "RifficFree": "Tales of the Little Adventurers",
      "Orbitron": "Titan Effect: Covert Tales",
      "MetalMacabre": "Twisted Wishes",
      "Headhunter": "Voyage to the Isle of Skulls",
      "Saddlebag": "Wardens of the Weird West",
      "Berry": "Welcome to Drakonheim",
      "Skia": "Winter Eternal: Darkness & Ice",
      "Corleone": "Wiseguys: Gangster Tales"
    },
    requiresReload: true,
    default: 'Dominican',
  });

  game.settings.register('atd6', 'listHeaderBgColor', {
      name: game.i18n.localize("ATD6.config.listHeaderBgColorName"),
      hint: game.i18n.localize("ATD6.config.listHeaderBgColorHint"),
      scope: 'world',
      requiresReload: true,
      config: true,
      type: String,
      default: '#000000',
  });

  game.settings.register('atd6', 'listHeaderFontColor', {
    name: game.i18n.localize("ATD6.config.listHeaderFontColorName"),
    hint: game.i18n.localize("ATD6.config.listHeaderFontColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#ffffff',
  }); 

  game.settings.register('atd6', 'headerFontColor', {
    name: game.i18n.localize("ATD6.config.headerFontColorName"),
    hint: game.i18n.localize("ATD6.config.headerFontColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#000000',
  });

  game.settings.register('atd6', 'regularFontColor', {
    name: game.i18n.localize("ATD6.config.itemFontColorName"),
    hint: game.i18n.localize("ATD6.config.itemFontColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#000000',
  });

  game.settings.register('atd6', 'inputBgColor', {
    name: game.i18n.localize("ATD6.config.inputBgColorName"),
    hint: game.i18n.localize("ATD6.config.inputBgColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#ffffdc',
  });

  game.settings.register('atd6', 'inputFontColor', {
    name: game.i18n.localize("ATD6.config.inputFontColorName"),
    hint: game.i18n.localize("ATD6.config.inputFontColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#000000',
  });

  game.settings.register('atd6', 'windowHeaderBgColor', {
    name: game.i18n.localize("ATD6.config.windowHeaderBgColorName"),
    hint: game.i18n.localize("ATD6.config.windowHeaderBgColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#000000',
  });

  game.settings.register('atd6', 'windowHeaderFontColor', {
    name: game.i18n.localize("ATD6.config.windowHeaderFontColorName"),
    hint: game.i18n.localize("ATD6.config.windowHeaderFontColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#ffffff',
  });

  game.settings.register('atd6', 'dieRollerFontColor', {
    name: game.i18n.localize("ATD6.config.dieRollerFontColorName"),
    hint: game.i18n.localize("ATD6.config.dieRollerFontColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#000000',
  });

  game.settings.register('atd6', 'dieRollerButtonBgColor', {
    name: game.i18n.localize("ATD6.config.dieRollerButtonBgColorName"),
    hint: game.i18n.localize("ATD6.config.dieRollerButtonBgColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#ffffff',
  });

  game.settings.register('atd6', 'dieRollerButtonFontColor', {
    name: game.i18n.localize("ATD6.config.dieRollerButtonFontColorName"),
    hint: game.i18n.localize("ATD6.config.dieRollerButtonFontColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#000000',
  });

  game.settings.register('atd6', 'tabActiveBgColor', {
    name: game.i18n.localize("ATD6.config.tabActiveBgColorName"),
    hint: game.i18n.localize("ATD6.config.tabActiveBgColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#000000',
  });

  game.settings.register('atd6', 'tabActiveFontColor', {
    name: game.i18n.localize("ATD6.config.tabActiveFontColorName"),
    hint: game.i18n.localize("ATD6.config.tabActiveFontColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#ffffff',
  });

  game.settings.register('atd6', 'tabHoverBgColor', {
    name: game.i18n.localize("ATD6.config.tabHoverBgColorName"),
    hint: game.i18n.localize("ATD6.config.tabHoverBgColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#555353',
  });

  game.settings.register('atd6', 'tabHoverFontColor', {
    name: game.i18n.localize("ATD6.config.tabHoverFontColorName"),
    hint: game.i18n.localize("ATD6.config.tabHoverFontColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#d8d1d1',
  });
  

  const root = document.querySelector(':root');
  let bgImagePath="url(../../../"+game.settings.get ("atd6", "bgImage")+")"
  root.style.setProperty('--bg-image',bgImagePath)
  let chatbgImagePath="url(../../../"+game.settings.get ("atd6", "chatBgImage")+")"
  root.style.setProperty('--chat-bg-image',chatbgImagePath)
  let listHeaderBgColor=game.settings.get ("atd6", "listHeaderBgColor")
  root.style.setProperty('--list-header-color',listHeaderBgColor)
  let listHeaderFontColor=game.settings.get ("atd6", "listHeaderFontColor")
  root.style.setProperty('--list-header-font-color',listHeaderFontColor)
  let headerFontColor=game.settings.get ("atd6", "headerFontColor")
  root.style.setProperty('--header-font-color',headerFontColor)
  let regularFontColor=game.settings.get ("atd6", "regularFontColor")
  root.style.setProperty('--list-text-color',regularFontColor)
  let inputBgColor=game.settings.get ("atd6", "inputBgColor")
  root.style.setProperty('--input-bg-color',inputBgColor)
  let inputFontColor=game.settings.get ("atd6", "inputFontColor")
  root.style.setProperty('--input-text-color',inputFontColor)
  let titleFont=game.settings.get ("atd6", "titleFont")
  root.style.setProperty('--font-name',titleFont) 
  let windowHeaderBgColor=game.settings.get ("atd6", "windowHeaderBgColor")
  root.style.setProperty('--window-header-bg-color',windowHeaderBgColor) 
  let windowHeaderFontColor=game.settings.get ("atd6", "windowHeaderFontColor")
  root.style.setProperty('--window-header-font-color',windowHeaderFontColor) 
  let dieRollerFontColor=game.settings.get ("atd6", "dieRollerFontColor")
  root.style.setProperty('--die-roller-font-color',dieRollerFontColor) 
  let dieRollerButtonFontColor=game.settings.get ("atd6", "dieRollerButtonFontColor")
  root.style.setProperty('--die-roller-button-font-color',dieRollerButtonFontColor) 
  let dieRollerButtonBgColor=game.settings.get ("atd6", "dieRollerButtonBgColor")
  root.style.setProperty('--die-roller-button-bg-color',dieRollerButtonBgColor) 
  let tabActiveBgColor=game.settings.get ("atd6", "tabActiveBgColor")
  root.style.setProperty('--tab-bg-color-active',tabActiveBgColor)
  let tabActiveFontColor=game.settings.get ("atd6", "tabActiveFontColor")
  root.style.setProperty('--tab-text-color-active',tabActiveFontColor)
  let tabHoverBgColor=game.settings.get ("atd6", "tabHoverBgColor")
  root.style.setProperty('--tab-bg-color-hover',tabHoverBgColor)
  let tabHoverFontColor=game.settings.get ("atd6", "tabHoverFontColor")
  root.style.setProperty('--tab-text-color-hover',tabHoverFontColor)

  //ACTIVATE FLOATING DICE ROLLER


  


  //DICE FACE HELPER
  Handlebars.registerHelper("times", function(n, content)
    {
      let result = "";
      for (let i = 0; i < n; ++i)
      {
          result += content.fn(i);
      }
    
      return result;
    });
    
  Handlebars.registerHelper("face", diceToFaces);

});


Hooks.on("renderPause", () => {
  $("#pause img").attr("class", "fa-spin pause-image");
  $("#pause figcaption").attr("class", "pause-atd6");
});

Hooks.on('ready', () => {
  new DieRoller(DieRoller.defaultOptions, { excludeTextLabels: true }).render(true);
  
})


Hooks.on('renderSettingsConfig', (app, el, data) => {
  // Insert color picker input
  el.find('[name="atd6.listHeaderBgColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('atd6','listHeaderBgColor')}" data-edit="atd6.listHeaderBgColor">`)
  el.find('[name="atd6.listHeaderFontColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('atd6','listHeaderFontColor')}" data-edit="atd6.listHeaderFontColor">`) 
  el.find('[name="atd6.headerFontColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('atd6','headerFontColor')}" data-edit="atd6.headerFontColor">`)
  el.find('[name="atd6.regularFontColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('atd6','regularFontColor')}" data-edit="atd6.regularFontColor">`)
  el.find('[name="atd6.inputBgColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('atd6','inputBgColor')}" data-edit="atd6.inputBgColor">`)
  el.find('[name="atd6.inputFontColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('atd6','inputFontColor')}" data-edit="atd6.inputFontColor">`)
  el.find('[name="atd6.windowHeaderBgColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('atd6','windowHeaderBgColor')}" data-edit="atd6.windowHeaderBgColor">`)
  el.find('[name="atd6.windowHeaderFontColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('atd6','windowHeaderFontColor')}" data-edit="atd6.windowHeaderFontColor">`)
  el.find('[name="atd6.dieRollerFontColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('atd6','dieRollerFontColor')}" data-edit="atd6.dieRollerFontColor">`)
  el.find('[name="atd6.dieRollerButtonBgColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('atd6','dieRollerButtonBgColor')}" data-edit="atd6.dieRollerButtonBgColor">`)
  el.find('[name="atd6.dieRollerButtonFontColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('atd6','dieRollerButtonFontColor')}" data-edit="atd6.dieRollerButtonFontColor">`)
  el.find('[name="atd6.tabActiveBgColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('atd6','tabActiveBgColor')}" data-edit="atd6.tabActiveBgColor">`)
  el.find('[name="atd6.tabActiveFontColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('atd6','tabActiveFontColor')}" data-edit="atd6.tabActiveFontColor">`)
  el.find('[name="atd6.tabHoverBgColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('atd6','tabHoverBgColor')}" data-edit="atd6.tabHoverBgColor">`)
  el.find('[name="atd6.tabHoverFontColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('atd6','tabHoverFontColor')}" data-edit="atd6.tabHoverFontColor">`)
});

Hooks.on('renderChatLog', (app, html, data) => atd6Chat.chatListeners(html))

Hooks.on('refreshToken', () => {

})