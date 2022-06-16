SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema javaRecipes
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema javaRecipes
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `javaRecipes` DEFAULT CHARACTER SET utf8 ;
USE `javaRecipes` ;

-- -----------------------------------------------------
-- Table `javaRecipes`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `javaRecipes`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `userName` VARCHAR(45) NOT NULL,
  `firstName` VARCHAR(45) NOT NULL,
  `lastName` VARCHAR(45) NOT NULL,
  `country` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `imageUser` VARCHAR(45) NULL, 
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `javaRecipes`.`favoriteRecipes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `javaRecipes`.`favoriteRecipes` (
  `user_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `recipe_id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `javaRecipes`.`newRecipes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `javaRecipes`.`newRecipes` (
  `user_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  `imageRecipe` VARCHAR(45) NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `readyInMinutes` INT NOT NULL,
  `aggregateLikes` INT NOT NULL,
  `vegan` BOOLEAN NOT NULL,
  `vegetarian` BOOLEAN NOT NULL,
  `glutenFree` BOOLEAN NOT NULL,
  `isWatched` BOOLEAN NOT NULL,
  `isFavorite` BOOLEAN NOT NULL,
  PRIMARY KEY (`recipe_id`, `user_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `javaRecipes`.`familyRecipes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `javaRecipes`.`familyRecipes` (
  `user_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  `owner` VARCHAR(45) NOT NULL,
  `recipeTime` VARCHAR(128) NOT NULL,

  PRIMARY KEY (`user_id`, `recipe_id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `javaRecipes`.`recipeIngrediants`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `javaRecipes`.`recipeIngrediants` (
  `recipe_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `amount` FLOAT NOT NULL,
  `measure` VARCHAR(45) NOT NULL,

  PRIMARY KEY (`recipe_id`, `name`))
ENGINE = InnoDB;



-- -----------------------------------------------------
-- Table `javaRecipes`.`recipeInstructions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `javaRecipes`.`recipeInstructions` (
  `recipe_id` INT NOT NULL,
  `stage` INT NOT NULL,
  `instruction` VARCHAR(255) NOT NULL,

  PRIMARY KEY (`recipe_id`, `stage`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `javaRecipes`.`seenRecipes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `javaRecipes`.`seenRecipes` (
  `user_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  `time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`recipe_id`, `user_id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;