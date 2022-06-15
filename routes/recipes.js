var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const search_utils = require("./utils/search_utils");

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


router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe_details = await recipes_utils.getRecipeDetails(req.params.recipeId);
    const recipe_instructions = await recipes_utils.getRecipeInstructions(req.params.recipeId);
    recipe_instructions.push(recipe_details)
    res.send(recipe_instructions);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
