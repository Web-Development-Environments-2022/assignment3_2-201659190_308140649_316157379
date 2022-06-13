SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
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
  PRIMARY KEY (`user_id`, `userName`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `javaRecipes`.`favoriteRecipes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `javaRecipes`.`favoriteRecipes` (
  `user_id` VARCHAR(45) NOT NULL,
  `recipe_id` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `javaRecipes`.`newRecipes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `javaRecipes`.`newRecipes` (
  `userName` VARCHAR(45) NOT NULL,
  `recipe_id` VARCHAR(45) NOT NULL,
  `imageRecipe` VARCHAR(45) NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `readyInMinutes` VARCHAR(45) NOT NULL,
  `aggregateLikes` VARCHAR(45) NOT NULL,
  `vegan` VARCHAR(45) NOT NULL,
  `vegetarian` VARCHAR(45) NOT NULL,
  `glutenFree` VARCHAR(45) NOT NULL,
  `isWatched` VARCHAR(45) NOT NULL,
  `isFavorite` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`userName`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `javaRecipes`.`familyRecipes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `javaRecipes`.`familyRecipes` (
  `userName` VARCHAR(45) NOT NULL,
  `recipe_id` VARCHAR(45) NOT NULL,
  `imageRecipe` VARCHAR(45) NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `readyInMinutes` VARCHAR(45) NOT NULL,

  PRIMARY KEY (`userName`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;