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

/**
 * This path gets body with family recipe details and save it in the family list of the logged-in user
 */
router.post('/family_recipe',async(req,res,next) =>{
  try {
    if( req.body.title == undefined||
      req.body.imageRecipe == undefined || req.body.readyInMinutes == undefined||
       req.body.aggregateLikes==undefined || req.body.vegan == undefined|| 
       req.body.vegetarian == undefined || req.body.glutenFree == undefined || 
       req.body.ingredients == undefined || req.body.instructions == undefined ||
       req.body.owner == undefined || req.body.time == undefined){
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
    let owner = req.body.owner;
    let timeRecipe = req.body.time;
    await create_new_recipe(recipe_details, ingredients,  instructions);
    await user_utils.setFamilyTable(recipe_details.user_id, recipe_details.recipe_id, owner, timeRecipe);
    res.status(201).send({message: "family recipe created", success: true });
  } catch (error) {
    next(error); 
  }
})


/**
 * This path gets body with new recipe details and save it in the my recipt list of the logged-in user
 */
router.post('/my_recipes',async(req,res,next) =>{
  try {
    if( req.body.recipe == undefined){
      throw {status: 400, message: "one of the argument is not specified."}
    }
    const user_id = req.session.user_id;
    let new_recipe_id =await user_utils.get_new_recipe_id(user_id); 
    let recipe_details= 
      {user_id : user_id,
      recipe_id : new_recipe_id,
      title : req.body.recipe.title,
      image : req.body.recipe.image,
      readyInMinutes : req.body.recipe.timePreperation ,
      aggregateLikes : req.body.recipe.aggregateLikes,
      serving : req.body.recipe.serving,
      vegan : await booliantoBinary(req.body.recipe.vegan),
      vegetarian : await booliantoBinary(req.body.recipe.vegetarian),
      glutenFree : await booliantoBinary(req.body.recipe.glutenFree)
    }
    let ingredients = req.body.recipe.ingredients;
    let instructions = req.body.recipe.instructions;
    await create_new_recipe(recipe_details, ingredients,  instructions) ;
    res.status(201).send({message: "recipe created", success: true });
  } catch (error) {
    next(error); 
  }
})

/**
 * This path returns the recipes that were created by the logged-in user
 */
 router.get('/my_recipes', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const results = await user_utils.getUserRecipeIngInstFromDB(user_id);
    results.map((element) => element.instructions = element.instructions.split(","));
    results.map((element) => element.ingrediants = element.ingrediants.split(","));
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});




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

/**
 * This path returns the favorites recipes's ids that were saved by the logged-in user
 */
router.get('/favorites/ids', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    res.status(200).send(recipes_id_array);
  } catch(error){
    next(error); 
  }
});


/**
 * This path returns the family recipes that were created by the logged-in user
 */
router.get('/family_recipe', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const results = await user_utils.getUserFamilyRecipeIngInstFromDB(user_id);
    results.map((element) => element.instructions = element.instructions.split(","));
    results.map((element) => element.ingrediants = element.ingrediants.split(","));
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});



// create new recipe in DB
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

// create ingrediants in DB
async function addIngredients(id, ingredients) {
  await ingredients.map((ingredient) =>  recipe_utils.addIngredientToRecipe(id, ingredient));
}

// create instructions in DB
async function addInstructions(id, instructions) {
  await instructions.map((instruction) =>  recipe_utils.addInstructionToRecipe(id, instruction));
}

// convert boolean variable to 0 and 1 (mysql dont have false/true)
function booliantoBinary(boolean) {
  if (boolean == true) {
    return 1;
  } else if (boolean == false) {
    return 0;
  } else {
    new Error("not valid boolean argument (not 0 or 1)");
  }
}
/**
 * This path returns the 3 recipes last watched by the user
 */
 router.get('/recipes', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let last_watched_array = []
    const recipes_watchd = await user_utils.getLastRecipesWatched(user_id);
    recipes_watchd.map((element) => last_watched_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(last_watched_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * This path returns the all recipes last watched by the user
 */
 router.get('/recipes/ids', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let recipe_watched_array = []
    const recipes_watchd = await user_utils.getAllRecipesWatched(user_id);
    recipes_watchd.map((element) => recipe_watched_array.push(element.recipe_id)); //extracting the recipe ids into array
    res.status(200).send(recipe_watched_array);
  } catch(error){
    next(error); 
  }
});




module.exports = router;
