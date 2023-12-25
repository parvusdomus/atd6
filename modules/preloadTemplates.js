export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
      "/systems/atd6/templates/actors/parts/general.html"
    ];
        return loadTemplates(templatePaths);
};