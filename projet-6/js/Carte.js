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
       * @param{string} axe - l'axe horizontal ou vertical
       * @param{object} joueur - le joueur qui doit trouver sa prochaine case
       * @param{direction} direction - possibilité d'aller en arrière ou en avant
       */
      caseSuivante(axe, joueur, direction = 1) {

          let xPlayer = joueur.posX;
          let yPlayer = joueur.posY;

          let tabIndex = (direction === 1) ? [1, 2, 3] : [-1, -2, -3];
          let tabCaseOk = [];

          for (let i of tabIndex) {
              let x = (axe === "x") ? xPlayer - i : xPlayer;
              let y = (axe === "y") ? yPlayer - i : yPlayer;

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
        if(joueur === joueurUn){
            joueurUn.actif = true;
        }else{
            joueurDeux.actif = true;
        }

          let casesPossibles = [].concat(
              this.caseSuivante("x", joueur),
              this.caseSuivante("x", joueur, -1),
              this.caseSuivante("y", joueur),
              this.caseSuivante("y", joueur, -1)
          );

          casesPossibles.forEach(cellule => {
              document.getElementById(cellule.id).style.backgroundColor = "#CC5285";
          });
          alert("Déplacez-vous au clavier sur l'une des cases en surbrillance pour continuer");

          document.addEventListener("keydown", (e) => {
            carteUne.gestionEvenementsClavier(casesPossibles, joueur, e);
          });
      }

      gestionEvenementsClavier(casesPossibles, joueur, e) {

          joueur.moving = true;
          let celluleDebutTour = this.cellules.find((cellule) => {
              return (cellule.x === joueur.posX) && (cellule.y === joueur.posY);
          });

          let celluleFinTour;

          if (e.key == "Right" || e.key == "ArrowRight") {
              celluleFinTour = this.cellules.find((cellule) => {
                  return (cellule.x === (celluleDebutTour.x) + 1) && (cellule.y === joueur.posY);
              });
              this.checkIfPlayerIsStopped(casesPossibles, celluleFinTour, joueur);

          } else if (e.key == "Left" || e.key == "ArrowLeft") {
              celluleFinTour = this.cellules.find((cellule) => {
                  return (cellule.x === (celluleDebutTour.x) - 1) && (cellule.y === joueur.posY);
              });
              this.checkIfPlayerIsStopped(casesPossibles, celluleFinTour, joueur);

          } else if (e.key == "Down" || e.key == "ArrowDown") {
              celluleFinTour = this.cellules.find((cellule) => {
                  return (cellule.x === joueur.posX) && (cellule.y === (celluleDebutTour.y) + 1);
              });
              this.checkIfPlayerIsStopped(casesPossibles, celluleFinTour, joueur);

          } else if (e.key == "Up" || e.key == "ArrowUp") {
              celluleFinTour = this.cellules.find((cellule) => {
                  return (cellule.x === joueur.posX) && (cellule.y === (celluleDebutTour.y) - 1);
              });
              this.checkIfPlayerIsStopped(casesPossibles, celluleFinTour, joueur);
          }    
      } 
      
      checkIfPlayerIsStopped(casesPossibles, celluleFinTour, joueur){
      if (casesPossibles.includes(celluleFinTour) === false || joueur.stopped === true) {
        celluleFinTour = this.cellules.find((cellule) => {
            return (cellule.x === joueur.posX) && (cellule.y === joueur.posY);
        });
        joueur.stopped = true;
        alert("Impossible d'aller plus loin");
        document.removeEventListener("keydown", (e) => {
          carteUne.gestionEvenementsClavier(casesPossibles, joueur, e);
        });
        }
        joueur.afficheInfos();
        this.nouvellePosJoueur(casesPossibles, celluleFinTour, joueur);
    }
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
        
      }

      detectionChangementDArme(celluleFinTour, joueur) {
          this.cellules.forEach(cellule => {
              if (cellule.id === celluleFinTour.id) {
                  if (cellule.contientArme !== null) {
                      let tampon = {
                          arme: joueur.arme,
                          idCase: celluleFinTour.id
                      }
                      joueur.tmp = tampon;
                      joueur.arme = cellule.contientArme;
                      joueur.coteInfos.innerHTML = joueur.informations;
                      cellule.contientArme = tampon.arme;

                  }
              }

          });
      }

      detectionCombat(joueur) {
          
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
      }
  }