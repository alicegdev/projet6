  /**
   * Représente la carte de jeu et ses attributs.
   * @constructor
   * @param {number} lignes - le nombre de lignes du tableau généré.
   * @param {number} colonnes - le nombre de colonnes généré.
   * @param {number} nbCasesInaccessibles - le nombre de cases inaccessibles.
   * @param {array} cellules - contient instances de la classe "Cellule".
   * @param {array} tabJoueurs - contient instances de la classe "Joueurs" - générées dans le main.js
   * @param {array} tabArmes - contient instances de la classe "Armes"  - générées dans le main.js 
   */

  class Carte {
      constructor(lignes, colonnes, nbCasesInaccessibles, tabJoueurs, tabArmes) {
          this.lignes = lignes;
          this.colonnes = colonnes;
          this.nbCasesInaccessibles = nbCasesInaccessibles;
          this.cellules = [];
          this.tabJoueurs = tabJoueurs;
          this.tabArmes = tabArmes;
      }

      /**
       * génère la carte avec le tableau HTML et le tableau des instances Cellules, affiche les encadrés joueurs
       */
      generer() {
          let banner = document.getElementById("banner");
          banner.style.display = "none";
          let game = document.getElementById("game");
          let tbl = document.createElement("table");
          let espaceJoueurs = document.createElement("aside");
          let coteJoueurUn = document.createElement("article");
          this.tabJoueurs[0].coteJoueur = coteJoueurUn;
          let coteJoueurDeux = document.createElement("article");
          joueurDeux.coteJoueur = coteJoueurDeux;
          tbl.append(espaceJoueurs);
          espaceJoueurs.append(coteJoueurUn, coteJoueurDeux);
          espaceJoueurs.setAttribute('id', 'espaceJoueurs');
          let tblBody = document.createElement("tbody");

          for (let i = 0; i < this.lignes; i++) {
              let colonne = document.createElement("tr");
              for (let j = 0; j < this.colonnes; j++) {
                  let cellule = document.createElement("td");
                  cellule.id += "cellule" + j + i;

                  this.cellules.push(new Cellule(('cellule' + j + i), j, i, true));
                  colonne.appendChild(cellule);
              }
              tblBody.appendChild(colonne);
          }
          tbl.appendChild(tblBody);
          game.appendChild(tbl);
          tbl.setAttribute("border", "2");
          joueurUn.actif = true;
          joueurDeux.actif = false;
          this.tabJoueurs.forEach(joueur => {
              joueur.afficheInfos();
          });
          this.genererCasesInaccessibles();
          this.genererCasesArmes();
          this.genererCasesJoueurs();

      }
      /**
       * génère des cases sur lesquelles rien ne peut être placé
       */
      genererCasesInaccessibles() {
          let k = 0;
          let cellulesInaccessibles = [];
          let randomCellule;

          while (k < this.nbCasesInaccessibles) {
              do {
                  randomCellule = this.rechercheCasesDisponibles();
              } while (randomCellule === undefined);
              randomCellule.accessible = false;
              randomCellule.disponible = false;
              let $randomCell = document.getElementById(randomCellule.id);
              $randomCell.innerHTML = "<div class = 'croix'><i class='fas fa-times'></i></div>";
              if (cellulesInaccessibles.includes(randomCellule.id) === false) {
                  k++;
                  cellulesInaccessibles.push(randomCellule.id);
              }
          }

      }
      /**
       * recherche les cases qui ne sont pas déjà prises par des armes, des joueurs, des obstacles
       */
      rechercheCasesDisponibles() {
          let celluleRandom;
          do {
              let randomX = Math.floor(Math.random() * this.colonnes);
              let randomY = Math.floor(Math.random() * this.lignes);

              celluleRandom = this.cellules.find((cellule) => {
                  return (cellule.x === randomX) && (cellule.y === randomY) && (cellule.disponible === true) && (cellule.accessible === true);
              });
          } while (celluleRandom === undefined);

          return celluleRandom;

      }
      /**
       * place les instances de la classe Arme sur la carte
       */
      genererCasesArmes() {
          let randomCellule;

          for (const arme of tabArmes) {
              randomCellule = this.rechercheCasesDisponibles();
              randomCellule.disponible = false;
              let $randomCell = document.getElementById(randomCellule.id);
              $randomCell.style.backgroundImage = "url(" + arme.visuel + ")";
              this.cellules.forEach(cellule => {
                  if (cellule.id === randomCellule.id) {
                      cellule.contientArme = arme;
                  }
              });
          }
      }
      /**
       * place les instances de la classe Joueur sur la carte
       */
      genererCasesJoueurs() {
          let k = 0;
          let randomCellule;

          do {
              randomCellule = this.rechercheCasesDisponibles();
              this.tabJoueurs[k].posX = randomCellule.x;
              this.tabJoueurs[k].posY = randomCellule.y;

              if ((randomCellule.id === "cellule" + (this.tabJoueurs[0].posX - 1) + this.tabJoueurs[0].posY) ||
                  (randomCellule.id === "cellule" + (this.tabJoueurs[0].posX + 1) + this.tabJoueurs[0].posY) ||
                  (randomCellule.id === "cellule" + this.tabJoueurs[0].posX + (this.tabJoueurs[0].posY - 1)) ||
                  (randomCellule.id === "cellule" + this.tabJoueurs[0].posX + (this.tabJoueurs[0].posY + 1))) {
                  randomCellule = this.rechercheCasesDisponibles();
              }
              let $randomCell = document.getElementById(randomCellule.id);
              $randomCell.style.backgroundImage = "url(" + this.tabJoueurs[k].visuel + ")";
              randomCellule.disponible = false;
              k++;
          } while (k < this.tabJoueurs.length);
      }
      
      
      
      
      
    /*
      nouvellePosJoueur(casesPossibles, celluleFinTour, joueur) {
          
          if (joueur.actif === true) {
              casesPossibles.forEach(cellule => {
                  document.getElementById(cellule.id).style.backgroundColor = "#4C2E4D";
              });
              let idCelluleFinTour = celluleFinTour.id;
              document.getElementById(idCelluleFinTour).style.backgroundImage = "url(" + joueur.visuel + ")";
              if(joueur.stopped === false){
              document.getElementById("cellule" + joueur.posX + joueur.posY).style.backgroundImage = "none";
              }
              joueur.posX = celluleFinTour.x;
              joueur.posY = celluleFinTour.y;
              console.log("joueur position = cellule " + joueur.posX + joueur.posY);
              joueur.stopped = false;
              joueur.moving = false;
              if (joueur.tmp !== null) {
                  document.getElementById(joueur.tmp.idCase).style.backgroundImage = "url(" + joueur.tmp.arme.visuel + ")";
                  joueur.tmp = null;
              }
              this.detectionChangementDArme(celluleFinTour, joueur);
              this.detectionCombat(joueur);
              if(joueur === joueurUn){
                  joueurUn.tourSuivant(joueurDeux);
              }else{
                  joueurDeux.tourSuivant(joueurUn);
              }
          }
          
        
      } */

      
  }