const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function get_new_recipe_id(user_id) {
    let num_user_recipe =  await DButils.execQuery(`select count(recipe_id) as counter from newrecipes where user_id = ${user_id}`)
    return num_user_recipe[0].counter + 1
}



exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.get_new_recipe_id = get_new_recipe_id;
