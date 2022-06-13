const axios = require("axios");


async function search_recipes(search_params) {
    let search_response = await axios.get(
      `${process.env.api_domain}/recipes/complexSearch?`,
      {
        params: search_params
      }
    );
    let recipes_list = await extractSearchResults(search_response);
    return recipes_list;
}
async function extractSearchResults(search_response) {
  let recipes = search_response.data.results;
  recipes_id_list = [];
  recipes.map((element) => {recipes_id_list.push(element.id);});

  let promises = [];
  recipes_id_list.map((id) =>
    promises.push(
      axios.get(`${process.env.api_domain}recipes/${id}/information`, {
        params: {
          apiKey: process.env.spooncular_apiKey,
        },
      })
    )
  );
  let info_response1 = await Promise.all(promises);
  relevantRecipesData = extractRelvantRecipeData(info_response1);
  return relevantRecipesData;

}

function extractRelvantRecipeData(recipes_info) {
  return recipes_info.map((recipes_info) => {
    const { id, title, readyInMinutes, aggregateLikes, vegetarian, vegan, glutenFree, image } = recipes_info.data;
    return {
      id: id,
      title: title,
      readyInMinutes: readyInMinutes,
      aggregateLikes: aggregateLikes,
      vegetarian: vegetarian,
      vegan: vegan,
      glutenFree: glutenFree,
      image: image,
    };
  });
}

module.exports = {
    search_recipes: search_recipes
}