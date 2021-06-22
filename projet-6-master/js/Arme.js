  /**
   * Représente la classe Arme.
   * @constructor
   * @param {string} lignes - le nombre de lignes du tableau généré.
   * @param {string} visuel - l'url de l'image de l'arme.
   * @param {number} degats - les dégâts infligés par l'arme.
   */

  class Arme {
      constructor(nom, visuel, degats) {
          this.nom = nom;
          this.visuel = visuel;
          this.degats = degats;
      }
  }