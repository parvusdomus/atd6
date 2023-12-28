export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
      "/systems/atd6/templates/actors/player/parts/general.html",
      "/systems/atd6/templates/actors/player/parts/traits.html",
      "/systems/atd6/templates/actors/player/parts/inventory.html",
      "/systems/atd6/templates/actors/player/parts/magic.html",
      "/systems/atd6/templates/actors/player/parts/description.html",
      "/systems/atd6/templates/actors/npc/parts/general.html",
      "/systems/atd6/templates/actors/npc/parts/traits.html",
      "/systems/atd6/templates/actors/npc/parts/inventory.html",
      "/systems/atd6/templates/actors/npc/parts/magic.html",
      "/systems/atd6/templates/actors/npc/parts/description.html"
    ];
    return loadTemplates(templatePaths);
};