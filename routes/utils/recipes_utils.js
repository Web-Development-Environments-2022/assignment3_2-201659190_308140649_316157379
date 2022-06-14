const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRandomRecipes() {
    const res = await axios.get(`${api_domain}/random`, {
        params: {
            number : 2,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return res
}
async function getThreeRandomRecipes(){
    let random = await getRandomRecipes()
    let a = { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree }
    a = random.data.recipes[0];
    return a
        // id: id,
        // title: title,
        // readyInMinutes: readyInMinutes,
        // image: image,
        // popularity: aggregateLikes,
        // vegan: vegan,
        // vegetarian: vegetarian,
        // glutenFree: glutenFree,
        
    


    // let filter_random_pool = random_pool.data.recipes.filter((random) => (random.instructions != ""))
    // if (filter_random_pool.length < 3) {
    //     return getThreeRandomRecipes();
    // }
    // return extract

      

}


async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}



exports.getRecipeDetails = getRecipeDetails;
exports.getThreeRandomRecipes = getThreeRandomRecipes;



