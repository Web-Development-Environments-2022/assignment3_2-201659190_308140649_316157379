
const DButils = require("./DButils");


async function getRecipeFromDB(id){
    let recipe = await DButils.execQuery(`select * from newrecipes where user_id='${id}'`);
    return recipe;
}

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const fav_recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return fav_recipes_id;
}



async function get_new_recipe_id(user_id) {
    let num_user_recipe =  await DButils.execQuery(`select count(recipe_id) as counter from newrecipes where user_id = ${user_id}`)
    return num_user_recipe[0].counter + 1
}
async function getLastRecipesWatched(user_id){
    return last_recipes = await DButils.execQuery(`select * from seenrecipes where user_id = ${user_id} ORDER BY time DESC LIMIT 3`)

}

async function update_seen_recipe(user_id, recipe_id){
    let seen_recipe = await DButils.execQuery(`SELECT * FROM seenrecipes WHERE user_id = '${user_id}' AND recipe_id = '${recipe_id}'` );
    if (!seen_recipe)
        await DButils.execQuery(`insert into seenrecipes values ('${user_id}',${recipe_id})`);
    else{
        await DButils.execQuery(`UPDATE seenrecipes SET time = CURRENT_TIMESTAMP WHERE user_id = '${user_id}' AND recipe_id = '${recipe_id}'`);
    }
}

async function getUserRecipeIngInstFromDB(recipe_id)
{
    let result = await DButils.execQuery(`select t1.*, concat(group_concat(concat(ing.amount,' ',ing.measure,' ',ing.name))) as ingrediants
    from
    (select n.*,
    concat(group_concat(concat('step ',inst.stage,' ',inst.instruction))) as instructions
    from newrecipes n
    join recipeinstructions inst on inst.recipe_id = n.recipe_id
    group by n.recipe_id) t1
    join recipeingrediants ing on ing.recipe_id = t1.recipe_id
    group by ing.recipe_id`);
    return result;
}


async function getUserFamilyRecipeIngInstFromDB(recipe_id)
{
    let result = await DButils.execQuery(`select t2.*, fr.owner, fr.recipeTime from
            (select t1.*, concat(group_concat(concat(ing.amount,' ',ing.measure,' ',ing.name))) as ingrediants
            from
            (select n.*,
            concat(group_concat(concat('step ',inst.stage,' ',inst.instruction))) as instructions
            from newrecipes n
            join recipeinstructions inst on inst.recipe_id = n.recipe_id
            group by n.recipe_id) t1
            join recipeingrediants ing on ing.recipe_id = t1.recipe_id
            group by ing.recipe_id) t2
            join familyrecipes fr on fr.recipe_id = t2.recipe_id
            group by fr.recipe_id`);
    return result;
}

async function setFamilyTable(user_id, recipe_id, owner, timeRecipe)
{
    await DButils.execQuery(`insert into familyrecipes values (${user_id},${recipe_id}, '${owner}','${timeRecipe}')`);
}

exports.setFamilyTable = setFamilyTable;
exports.getUserFamilyRecipeIngInstFromDB = getUserFamilyRecipeIngInstFromDB;
exports.getUserRecipeIngInstFromDB = getUserRecipeIngInstFromDB;
exports.getRecipeFromDB = getRecipeFromDB;
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.get_new_recipe_id = get_new_recipe_id;
exports.update_seen_recipe = update_seen_recipe;
exports.getLastRecipesWatched = getLastRecipesWatched;