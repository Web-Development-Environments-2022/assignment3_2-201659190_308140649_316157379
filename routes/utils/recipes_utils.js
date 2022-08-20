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

// async function getAnalyzedRecipeInstructions(recipe_id) {
//     return await axios.get(`${api_domain}/${recipe_id}/analyzedInstructions`,{
//         params:{
//             apiKey: process.env.spooncular_apiKey
//         }
//     });
// }
// return 3 random recipes from the spoonacular site
async function getRandomRecipes() {
    const res = await axios.get(`${api_domain}/random`, {
        params: {
            number : 3,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return res
}

// return multiple recipes from the spoonacular site
async function getInformationBulk(recipes_array){
    return await axios.get(`${api_domain}/informationBulk?ids=${recipes_array}`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

// insert new recipe into the DB
async function createRecipe(recipe){
    isWatchedInt = 0;
    isFavoriteInt = 0;
    await DButils.execQuery(
        `INSERT INTO newrecipes (title, image, readyInMinutes, aggregateLikes, vegan, vegetarian,
            glutenFree, isWatched,isFavorite, user_id ,recipe_id)
        VALUES ('${recipe.title}', '${recipe.image}', '${recipe.readyInMinutes}',
        '${recipe.aggregateLikes}', '${recipe.vegan}', '${recipe.vegetarian}', '${recipe.glutenFree}',
         '${isWatchedInt}', '${isFavoriteInt}', '${recipe.user_id}', '${recipe.recipe_id}')`);
}

// insert ingrediants to DB
async function addIngredientToRecipe(recipe_id,ingredient) {
    console.log(ingredient);
    await DButils.execQuery(
        `INSERT INTO recipeingrediants (recipe_id, name, amount, measure)
        VALUES ('${recipe_id}', '${ingredient.name}', '${ingredient.amount}', '${ingredient.measure}')`);
    }

// insert instructions to DB
async function addInstructionToRecipe(recipe_id,instruction) {
        await DButils.execQuery(
            `INSERT INTO recipeinstructions (recipe_id, stage, instruction)
            VALUES ('${recipe_id}', '${instruction.stage}', '${instruction.instruction}')`);
    }

// get Recipe Details for one recipe
async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree ,servings, extendedIngredients, instructions} = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        servings: servings,
        extendedIngredients: extendedIngredients,
        instructions: instructions
        
    }
}

// get Recipe Details for one recipe
async function getRecipeIngredients(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let {extendedIngredients, instructions,servings } = recipe_info.data;

    return {
        extendedIngredients: extendedIngredients,
        instructions: instructions,
        servings:  servings,

    }
}
// get Recipe Details for array recipes
async function recipePattern(array_recipes){
    return array_recipes.map((element) => {
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
// get  3 random recipes
async function getThreeRandomRecipes(){
    let random = await getRandomRecipes();
    return recipePattern(random.data.recipes)
    
}
// return all preview recipes of the logged in user
async function getRecipesPreview(recipes_array) {
    if (recipes_array.length == 0){
        return {}
    }
    let recipes = await getInformationBulk(recipes_array);
    return await recipePattern(recipes.data);
    }


exports.createRecipe= createRecipe
exports.getRecipesPreview = getRecipesPreview
exports.addIngredientToRecipe = addIngredientToRecipe
exports.addInstructionToRecipe = addInstructionToRecipe 
exports.getRecipeDetails = getRecipeDetails;
exports.getThreeRandomRecipes = getThreeRandomRecipes;
exports.getRecipeIngredients = getRecipeIngredients

