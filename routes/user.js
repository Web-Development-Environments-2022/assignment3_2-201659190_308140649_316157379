var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

router.post('/my_recipes',async(req,res,next) =>{
  try {
    if( req.body.title == undefined||
      req.body.imageRecipe == undefined || req.body.readyInMinutes == undefined||
       req.body.aggregateLikes==undefined || req.body.vegan == undefined|| 
       req.body.vegetarian == undefined || req.body.glutenFree == undefined || 
       req.body.ingredients == undefined || req.body.instructions == undefined){
        throw {status: 400, message: "one of the argument is not specified."}
       }
    const user_id = req.session.user_id;
    let new_recipe_id =await user_utils.get_new_recipe_id(user_id); 
    let recipe_details= 
      {user_id : user_id,
      recipe_id : new_recipe_id,
      title : req.body.title,
      imageRecipe : req.body.imageRecipe,
      readyInMinutes : req.body.readyInMinutes ,
      aggregateLikes : req.body.aggregateLikes,
      vegan : await booliantoBinary(req.body.vegan),
      vegetarian : await booliantoBinary(req.body.vegetarian),
      glutenFree : await booliantoBinary(req.body.glutenFree)
    }
    let ingredients = req.body.ingredients;
    let instructions = req.body.instructions;
    await create_new_recipe(recipe_details, ingredients,  instructions) ;
    res.status(201).send({message: "recipe created", success: true });
  } catch (error) {
    next(error); 
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});


router.get('/family_recipe', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getFamilyRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});



async function create_new_recipe(recipe, ingredients,  instructions){
  if (recipe.recipe_id == undefined){
    throw{status: 400, message: "cant create recipe"};
  }
  try {
    await recipe_utils.createRecipe(recipe);
    await addIngredients(recipe.recipe_id,ingredients) ;
    await addInstructions(recipe.recipe_id,instructions);
  } catch (error) {
    throw{status: 400, message: error}
  }
}
async function addIngredients(id, ingredients) {
  await ingredients.map((ingredient) =>  recipe_utils.addIngredientToRecipe(id, ingredient));
}

async function addInstructions(id, instructions) {
  await instructions.map((instruction) =>  recipe_utils.addInstructionToRecipe(id, instruction));
}
function booliantoBinary(boolean) {
  if (boolean == "true") {
    return 1;
  } else if (boolean == "false") {
    return 0;
  } else {
    new Error("not valid boolean argument (not 0 or 1)");
  }
}





module.exports = router;
