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
async function getAnalyzedRecipeInstructions(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/analyzedInstructions`,{
        params:{
            apiKey: process.env.spooncular_apiKey
        }
    });
}
async function getRandomRecipes() {
    const res = await axios.get(`${api_domain}/random`, {
        params: {
            number : 3,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return res
}


async function getInformationBulk(recipes_array){
    return await axios.get(`${api_domain}/informationBulk?ids=${recipes_array}`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}


async function createRecipe(recipe){
    isWatchedInt = 0;
    isFavoriteInt = 0;
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
        VALUES ('${recipe_id}', '${ingredient.name}', '${ingredient.amount}', '${ingredient.measure}')`);
    }
async function addInstructionToRecipe(recipe_id,instruction) {
        await DButils.execQuery(
            `INSERT INTO recipeinstructions (recipe_id, stage, instruction)
            VALUES ('${recipe_id}', '${instruction.stage}', '${instruction.instruction}')`);
    }

// get Recipe Details for one recipe
async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree ,servings} = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        servings:  servings,
        
    }
}
// get details Recipe title, ingredients, instructions
async function getRecipeInstructions(recipe_id) {
    let recipe_info = await getAnalyzedRecipeInstructions(recipe_id);
    return  dic_recipe = await Object.assign(recipe_info.data.map((element)  =>  
            element.steps.map((ele) =>{ const {step , ingredients} =  ele;
                return {
                    step: step,
                    ingredients: ingredients,
                    

        } 
    }

        )
    )

)
}
// get Recipe Details for araay recipes
async function recipePattern(array)
{
    return array.map((element) => {
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

async function getThreeRandomRecipes(){
    let random = await getRandomRecipes();
    return recipePattern(random.data.recipes)
    
}

async function getRecipesPreview(recipes_array) {
    if (recipes_array.length == 0){
        return {}
    }
    let recipes = await getInformationBulk(recipes_array);
    return recipePattern(recipes.data);
}

exports.createRecipe= createRecipe
exports.getRecipesPreview = getRecipesPreview
exports.addIngredientToRecipe = addIngredientToRecipe
exports.addInstructionToRecipe = addInstructionToRecipe 
exports.getRecipeDetails = getRecipeDetails;
exports.getThreeRandomRecipes = getThreeRandomRecipes;
exports.getRecipeInstructions = getRecipeInstructions;

