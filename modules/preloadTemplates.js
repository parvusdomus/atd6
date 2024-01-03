export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
      "/systems/atd6/templates/actors/player/parts/general.html",
      "/systems/atd6/templates/actors/player/parts/traits.html",
      "/systems/atd6/templates/actors/player/parts/inventory.html",
      "/systems/atd6/templates/actors/player/parts/magic.html",
      "/systems/atd6/templates/actors/player/parts/description.html",
      "/systems/atd6/templates/actors/player/parts/effects.html",
      "/systems/atd6/templates/actors/npc/parts/general.html",
      "/systems/atd6/templates/actors/npc/parts/traits.html",
      "/systems/atd6/templates/actors/npc/parts/inventory.html",
      "/systems/atd6/templates/actors/npc/parts/magic.html",
      "/systems/atd6/templates/actors/npc/parts/description.html",
      "/systems/atd6/templates/items/trait/parts/general.html",
      "/systems/atd6/templates/items/trait/parts/effects.html",
      "/systems/atd6/templates/items/armor/parts/general.html",
      "/systems/atd6/templates/items/armor/parts/effects.html",
      "/systems/atd6/templates/items/heritage/parts/general.html",
      "/systems/atd6/templates/items/heritage/parts/effects.html",
      "/systems/atd6/templates/items/object/parts/general.html",
      "/systems/atd6/templates/items/object/parts/effects.html",
      "/systems/atd6/templates/items/shield/parts/general.html",
      "/systems/atd6/templates/items/shield/parts/effects.html",
      "/systems/atd6/templates/items/spell/parts/general.html",
      "/systems/atd6/templates/items/spell/parts/effects.html",
      "/systems/atd6/templates/items/weapon/parts/general.html",
      "/systems/atd6/templates/items/weapon/parts/effects.html"
    ];
    return loadTemplates(templatePaths);
};