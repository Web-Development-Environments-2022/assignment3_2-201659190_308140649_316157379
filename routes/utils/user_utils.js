const DButils = require("./DButils");


async function getRecipeFromDB(column_name, id){
    let recipe = await DButils.execQuery(`select '${column_name}' from FavoriteRecipes where user_id='${id}'`);
    return recipe;
}

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const fav_recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return fav_recipes_id;
}

async function getFamilyRecipes(user_id){
    const family_recipes_id = await DButils.execQuery(`select recipe_id from familyrecipes where user_id='${user_id}'`);
    return family_recipes_id;
}

async function get_new_recipe_id(user_id) {
    let num_user_recipe =  await DButils.execQuery(`select count(recipe_id) as counter from newrecipes where user_id = ${user_id}`)
    return num_user_recipe[0].counter + 1
}


exports.getRecipeFromDB = getRecipeFromDB;
exports.getFamilyRecipes = getFamilyRecipes;
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.get_new_recipe_id = get_new_recipe_id;
