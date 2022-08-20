var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const search_utils = require("./utils/search_utils");
const user_utils = require("./utils/user_utils")
router.get("/", (req, res) => res.send("im here"));

/**
 * This path returns a full details of a recipe by its id
 */
 router.get("/search", async (req, res, next) => {
  try{
    search_params = req.query;
    search_params.instructionsRequired = true;
    search_params.apiKey = process.env.spooncular_apiKey;
  
    let search_results = await search_utils.search_recipes(search_params)
    res.send(search_results);
  } catch (error) {
    next(error);
  }  
});
  /**
 * This path returns the 3 random  recipes 
 */
router.get('/random', async (req,res,next) => {
    try{

      let recipes_random = await recipes_utils.getThreeRandomRecipes();
      res.status(200).send(recipes_random);
    } catch(error){
      next(error); 
    }
  });

 /**
 * This path returns preview receipe by id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe_details = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe_details);
  } 
  catch (error) {
    next(error);
  }
});

/**
 * This path returns detail extand receipe by id
 */
router.get("/:recipeId/details", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_details = await recipes_utils.getRecipeDetails(req.params.recipeId);
    // const recipe_integr = await recipes_utils.getRecipeIngredients(req.params.recipeId);
    const recipe_integr = {extendedIngredients: recipe_details.extendedIngredients, instructions: recipe_details.instructions, servings: recipe_details.servings};
    const dict_info = await view_info(recipe_integr);
    dict_info["recipePreview"] = recipe_details;
    await  user_utils.update_seen_recipe(user_id, recipe_details.id);
    res.status(200).send(dict_info);
  } catch (error) {
    next(error);
  }
});

/**
 * This helper func returns extendedIngredients, ingredients 
 */
async function view_info(dicts_array) {
  //Empty dict for output
  var info = {}
  var ingredients_dict = {}
  // Loop over array of input dicts
  for(var dict in dicts_array){

      // Loop over keys in dict
      if(dict =="extendedIngredients"){
          for(var d in dicts_array[dict]){
          
              var val1 = dicts_array[dict][d]["amount"]
              var val2 = dicts_array[dict][d]["unit"]
              var key = dicts_array[dict][d]["nameClean"]
              ingredients_dict[key] = val1 +" "+ val2
          }
      }
      else{
          info[dict] = dicts_array[dict]
      }
  }
  info["ingredients"] = ingredients_dict
  return info
}

module.exports = router;
