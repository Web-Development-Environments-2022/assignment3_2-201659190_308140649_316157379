const axios = require("axios");
const DButils = require("./DButils");
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

<<<<<<< HEAD
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
=======
async function createRecipe(recipe){
    // readyInMinuteInt = await parseInt(recipe.readyInMinutes);
    // aggregateLikesInt = await parseInt(recipe.aggregateLikes);
    isWatchedInt = 0;
    isFavoriteInt = 0;
    // user_idInt = await parseInt(recipe.user_id);
    // recipe_idInt = await parseInt(recipe.recipe_id);


    await DButils.execQuery(
        `INSERT INTO newrecipes (title, imageRecipe, readyInMinutes, aggregateLikes, vegan, vegetarian,
            glutenFree, isWatched,isFavorite, user_id ,recipe_id)
        VALUES ('${recipe.title}', '${recipe.imageRecipe}', '${recipe.readyInMinutes}',
        '${recipe.aggregateLikes}', '${recipe.vegan}', '${recipe.vegetarian}', '${recipe.glutenFree}',
         '${isWatchedInt}', '${isFavoriteInt}', '${recipe.user_id}', '${recipe.recipe_id}')`);
}


async function addIngredientToRecipe(recipe_id,ingredient) {
    await DButils.execQuery(
        `INSERT INTO recipeingrediants (recipe_id, name, amount, measure)
        VALUES ('${recipe_id}', '${ingredient.name}',${ingredient.amount}, '${ingredient.measure}')`);
    }
async function addInstructionToRecipe(recipe_id,instruction) {
        await DButils.execQuery(
            `INSERT INTO recipeinstructions (recipe_id, stage, instruction)
            VALUES ('${recipe_id}', '${instruction.stage}',${instruction.instruction})`);
    }



>>>>>>> a3d90e0405ff7a26ae6c87de666c9b885ebbcc52


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


async function getRecipesPreview(recipes_array) {
    if (recipes_array.length == 0){
        return {}
    }
    let recipes = await axios.get(`${api_domain}/informationBulk?ids=${recipes_array}`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return recipes.data.map((element) => {
        const { id, title, readyInMinutes, aggregateLikes, vegetarian, vegan, glutenFree, image } = element;
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

exports.getRecipesPreview = getRecipesPreview
exports.addIngredientToRecipe = addIngredientToRecipe
exports.addInstructionToRecipe = addInstructionToRecipe 
exports.getRecipeDetails = getRecipeDetails;
<<<<<<< HEAD
exports.getThreeRandomRecipes = getThreeRandomRecipes;
=======
exports.createRecipe= createRecipe
>>>>>>> a3d90e0405ff7a26ae6c87de666c9b885ebbcc52



