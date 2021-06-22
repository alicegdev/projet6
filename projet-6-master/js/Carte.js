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

          for (let i = 0; i < this.colonnes; i++) {
              let colonne = document.createElement("tr");
              for (let j = 0; j < this.lignes; j++) {
                  let cellule = document.createElement("td");
                  cellule.id += "cellule" + i + j;

                  this.cellules.push(new Cellule(('cellule' + i + j), i, j, true));
                  colonne.appendChild(cellule);
              }
              tblBody.appendChild(colonne);
          }
          tbl.appendChild(tblBody);
          game.appendChild(tbl);
          tbl.setAttribute("border", "2");
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
      /**
       * trouve les cases sur lesquelles le joueur peut se déplacer
       * @param{string} axis - l'axe horizontal ou vertical
       * @param{object} joueur - le joueur qui doit trouver sa prochaine case
       * @param{direction} direction - possibilité d'aller en arrière ou en avant
       */
      findCaseToMove(axis, joueur, direction = 1) {

          let xPlayer = joueur.posX;
          let yPlayer = joueur.posY;

          let tabIndex = (direction === 1) ? [1, 2, 3] : [-1, -2, -3];
          let tabCaseOk = [];

          for (let i of tabIndex) {
              let x = (axis === "x") ? xPlayer - i : xPlayer;
              let y = (axis === "y") ? yPlayer - i : yPlayer;

              if ((x < this.colonnes) && (x >= 0) && (y < this.lignes) && (y >= 0)) {
                  let caseOk = this.cellules.find((cellule) => {
                      return (cellule.x == x) && (cellule.y == y) && (cellule.accessible === true);
                  });

                  if (caseOk !== undefined) {
                      tabCaseOk.push(caseOk);
                  } else {
                      break;
                  }
              }
          }


          return tabCaseOk;
      }
      /**
       * déplace le joueur, prend arme/lâche arme si le cas se présente, détecte conditions combat
       * @param{object} joueur - le joueur qui se déplace
       */
      mouvementJoueur(joueur) {
          joueur.actif = true;
          let allCaseOk = [].concat(
              this.findCaseToMove("x", joueur),
              this.findCaseToMove("x", joueur, -1),
              this.findCaseToMove("y", joueur),
              this.findCaseToMove("y", joueur, -1)
          );
          alert("Cliquez sur l'une des cases en surbrillance pour continuer");

          allCaseOk.forEach(cellule => {

              let celluleCliquable = document.getElementById(cellule.id);
              celluleCliquable.style.backgroundColor = "#CC5285";
              celluleCliquable.addEventListener('click', () => {
                  let idCelluleCliquee = cellule.id;
                  allCaseOk.forEach(cellule => {
                      document.getElementById(cellule.id).style.backgroundColor = "#4C2E4D";
                  });
                  document.getElementById(idCelluleCliquee).style.backgroundImage = "url(" + joueur.visuel + ")";

                  if (joueur.actif === true) {
                      document.getElementById("cellule" + joueur.posX + joueur.posY).style.backgroundImage = "none";

                      if (joueur.tmp !== null) {
                          document.getElementById(joueur.tmp.idCase).style.backgroundImage = "url(" + joueur.tmp.arme.visuel + ")";
                          joueur.tmp = null;
                      }
                      joueur.posX = cellule.x;
                      joueur.posY = cellule.y;



                      if (joueur === joueurUn) {
                          if (((joueur.posX === joueurDeux.posX) && (joueur.posY === (joueurDeux.posY - 1))) ||
                              ((joueur.posX === joueurDeux.posX) && (joueur.posY === (joueurDeux.posY + 1))) ||
                              ((joueur.posX === joueurDeux.posX - 1) && (joueur.posY === (joueurDeux.posY))) ||
                              ((joueur.posX === joueurDeux.posX + 1) && (joueur.posY === (joueurDeux.posY)))) {
                              alert("Combat lancé");

                              joueurUn.boutonsCombat(joueurDeux);
                          }
                      } else if (joueur === joueurDeux) {
                          if (((joueur.posX === joueurUn.posX) && (joueur.posY === (joueurUn.posY - 1))) ||
                              ((joueur.posX === joueurUn.posX) && (joueur.posY === (joueurUn.posY + 1))) ||
                              ((joueur.posX === joueurUn.posX - 1) && (joueur.posY === (joueurUn.posY))) ||
                              ((joueur.posX === joueurUn.posX + 1) && (joueur.posY === (joueurUn.posY)))) {
                              alert("Combat lancé");
                              joueurDeux.boutonsCombat(joueurUn);


                          }
                      }



                      this.cellules.forEach(cellule => {
                          if (cellule.id === idCelluleCliquee) {
                              if (cellule.contientArme !== null) {
                                  let tampon = {
                                      arme: joueur.arme,
                                      idCase: idCelluleCliquee
                                  }
                                  joueur.tmp = tampon;
                                  joueur.arme = cellule.contientArme;
                                  joueur.coteInfos.innerHTML = joueur.informations;
                                  cellule.contientArme = tampon.arme;

                              }
                          }

                      });
                  }
                  joueur.actif = false;
              });

          });

      }
  }