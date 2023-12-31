import ATD6_CHAR_SHEET from "./modules/atd6_charsheet.js";
import ATD6_NPC_SHEET from "./modules/atd6_npc.js";
import ATD6_ITEM_SHEET from "./modules/atd6_itemsheet.js";
import { preloadHandlebarsTemplates } from "./modules/preloadTemplates.js";
import {_getInitiativeFormula} from './modules/combat.js';
import {diceToFaces} from "./modules/rolls.js";
import atd6Chat from "./modules/chat.js";

Hooks.once("init", function(){
  document.getElementById("logo").src = "/systems/atd6/style/images/atd6_Logo.webp";
  console.log("test | INITIALIZING ATD6 CHARACTER SHEETS...");
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("atd6", ATD6_CHAR_SHEET, {
    makeDefault: true,
    types: ['player']
  });
  Actors.registerSheet("atd6", ATD6_NPC_SHEET, {
    makeDefault: true,
    types: ['npc']
  });
  console.log("test | INITIALIZING ATD6 ITEM SHEETS...");
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("atd6", ATD6_ITEM_SHEET,{
    makeDefault: true,
    types: ['heritage','trait','weapon','armor','shield','spell','object']
  });

  console.log("test | LOADING TEMPLATES...");
  preloadHandlebarsTemplates();

  console.log("test | INITIALIZING TINY SETTINGS...");


  game.settings.register("atd6", "enableCritical", {
    name: game.i18n.localize("ATD6.config.enableCriticalName"),
    hint: game.i18n.localize("ATD6.config.enableCriticalHint"),
    scope: "world",
    type: Boolean,
    default: true,
    requiresReload: false,
    config: true
  });

  game.settings.register('atd6', 'titleFont', {
    name: game.i18n.localize("ATD6.config.titleFontName"),
    hint: game.i18n.localize("ATD6.config.titleFontHint"),
    config: true,
    type: String,
    scope: 'world',
    choices: {
      "atd6": "Default Advanced TinyD6 font (Quencrg)",
      "athelas": "Athelas",
      "dccash": "DCC Ash",
      "ghoulish": "Goulish",
      "helsing": "Helsing",
      "imfell": "IM Fell",
      "kirsty": "Kirsty",
      "locust": "Locust Resistance",
      "luckiest": "Luckiest Guy",
      "parentssuck": "Parents Suck",
      "stencil": "Stencil",
      "vanhelsing": "Van Helsing"
    },
    requiresReload: true,
    default: 'atd6',
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

  game.settings.register('atd6', 'logoImage', {
    name: game.i18n.localize("ATD6.config.logoImageName"),
    hint: game.i18n.localize("ATD6.config.logoImageHint"),
    type: String,
    default: 'systems/atd6/style/images/atd6_Logo.webp',
    scope: 'world',
    requiresReload: true,
    config: true,
    filePicker: 'image',
  });

  let logoImagePath="../../../"+game.settings.get ("atd6", "logoImage")
  document.getElementById("logo").src = logoImagePath;

  const root = document.querySelector(':root');
  let bgImagePath="url(../../../"+game.settings.get ("atd6", "bgImage")+")"
  root.style.setProperty('--bg-image',bgImagePath)
  let titleFont=game.settings.get ("atd6", "titleFont")
  root.style.setProperty('--header-font-name',titleFont) 

  console.log("test | SLOWING DOWN PINGS...");
    // Slowing down pings
    CONFIG.Canvas.pings.styles.pulse.duration = 2000
    CONFIG.Canvas.pings.styles.alert.duration = 2000
    CONFIG.Canvas.pings.styles.arrow.duration = 2000

  console.log("test | INITIALIZING ATD6 SETTINGS...");
  console.log("test | NO ATD6 SETTING TO INITIALIZE...");
});

Hooks.on("renderPause", () => {
  $("#pause img").attr("class", "fa-spin pause-image");
  $("#pause figcaption").attr("class", "pause-atd6");
});

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
Hooks.on('renderChatLog', (app, html, data) => atd6Chat.chatListeners(html))


//Hooks.on('refreshToken', () => {

//});