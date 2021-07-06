/**
 * représente le joueur et ses attributs
 * @constructor
 * @param {string} nom - nom donné au joueur
 * @param {object} arme - l'arme par défaut ou prise par le joueur
 * @param {number} sante - les points de vie du joueur
 * @param {img} visuel - l'image utilisée comme avatar du joueur
 * @param {element} coteJoueur - tout l'encadré qui montre les infos du joueur et contient les boutons
 * @param {element} coteInfos - uniquement les infos du joueur
 * @param {number} posX - la position en x de la case sur laquelle est le joueur
 * @param {number} posY- la position en y de la case sur laquelle est le joueur
 * @param {object} tmp - contient l'arme détenue par le joueur avant d'en changer
 * @param {boolean} actif - "true" si c'est au tour du joueur en question
 * @param {boolean} stopped -
 * @param {boolean} choixDefense - "true" si le joueur a fait le choix de se défendre
 */

class Joueur {
    constructor(nom, visuel, arme = mitraillette, sante = 100) {
        this.nom = nom;
        this.arme = arme;
        this.sante = sante;
        this.visuel = visuel;
        this.coteJoueur = 0;
        this.coteInfos = 0;
        this.btnDeplacement = 0;
        this.btnTourSuivant = 0;
        this.posX = 0;
        this.posY = 0;
        this.celluleDebutTour = 0;
        this.celluleFinTour = 0;
        this.tmp = null;
        this.actif = false;
        this.stopped = false;
        this.moving = false;
        this.choixDefense = false;
    }
    /**
     * Affiche les informations du joueur
     * @return{string} une concaténation variables/chaîne de caractères : nom, nom de l'arme, santé
     */
    get informations() {
        return `<br />Nom : ${this.nom} <br /><br />Arme : ${this.arme.nom} <br /><br />Sante : ${this.sante} <br />`;
    }

    /**
     * Affiche les dégâts de l'arme du joueur
     * @return{number} les dégâts de l'arme portée par le joueur
     */

    get power() {
        return this.arme.degats;
    }

    /**
     * Affiche les détails du joueur et le bouton déplacement dans son encadré
     */
    afficheInfos() {
        this.coteJoueur.innerHTML = "";
        let coteInfos = document.createElement("div");
        this.coteInfos = coteInfos;
        this.coteInfos.innerHTML = this.informations;
        this.coteJoueur.appendChild(this.coteInfos);
        if (this.actif === true && this.stopped === false && this.moving === false) {
            let btnDeplacement = document.createElement("button");
            btnDeplacement.className += "game_btn";
            btnDeplacement.innerHTML = "Déplacement";
            this.coteJoueur.appendChild(btnDeplacement);
            this.btnDeplacement = btnDeplacement;
            this.btnDeplacement.addEventListener("click", () => {
                this.mouvementJoueur();
            });
            
        }
    }

    /**
       * trouve les cases sur lesquelles le joueur peut se déplacer
       * @param{string} axe - l'axe horizontal ou vertical
       * @param{object} joueur - le joueur qui doit trouver sa prochaine case
       * @param{direction} direction - possibilité d'aller en arrière ou en avant
       */
     caseSuivante(axe, direction = 1) {

        let xPlayer = this.posX;
        let yPlayer = this.posY;

        let tabIndex = (direction === 1) ? [1, 2, 3] : [-1, -2, -3];
        let tabCaseOk = [];

        for (let i of tabIndex) {
            let x = (axe === "x") ? xPlayer - i : xPlayer;
            let y = (axe === "y") ? yPlayer - i : yPlayer;

            if ((x < carteUne.colonnes) && (x >= 0) && (y < carteUne.lignes) && (y >= 0)) {
                let caseOk = carteUne.cellules.find((cellule) => {
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
     mouvementJoueur() {
        this.actif = true;
        if(this.actif === true){
        
          let casesPossibles = [].concat(
              this.caseSuivante("x"),
              this.caseSuivante("x", -1),
              this.caseSuivante("y"),
              this.caseSuivante("y", -1)
          );

          casesPossibles.forEach(cellule => {
              document.getElementById(cellule.id).style.backgroundColor = "#CC5285";
          });
          alert("Déplacez-vous au clavier sur l'une des cases en surbrillance pour continuer");

          document.addEventListener("keydown", (e) => {
              // j'ai deux joueurs au lieu d'un au 2e tour!
              console.log("keydown " + this.nom);
            this.gestionEvenementsClavier(casesPossibles, e);
          });
        }
    }

    gestionEvenementsClavier(casesPossibles, e) {
        if(this.actif === true){
        

          this.moving = true;
          let celluleDebutTour = carteUne.cellules.find((cellule) => {
              return (cellule.x === this.posX) && (cellule.y === this.posY);
          });

          let celluleFinTour;
          console.log(this.nom +"this before checkIfPlayerIsStopped");

          if (e.key == "Right" || e.key == "ArrowRight") {
              celluleFinTour = carteUne.cellules.find((cellule) => {
                  return (cellule.x === (celluleDebutTour.x) + 1) && (cellule.y === this.posY);
              });
              this.checkIfPlayerIsStopped(casesPossibles, celluleFinTour);


          } else if (e.key == "Left" || e.key == "ArrowLeft") {
              celluleFinTour = carteUne.cellules.find((cellule) => {
                  return (cellule.x === (celluleDebutTour.x) - 1) && (cellule.y === this.posY);
              });
              this.checkIfPlayerIsStopped(casesPossibles, celluleFinTour);


          } else if (e.key == "Down" || e.key == "ArrowDown") {
              celluleFinTour = carteUne.cellules.find((cellule) => {
                  return (cellule.x === this.posX) && (cellule.y === (celluleDebutTour.y) + 1);
              });
              this.checkIfPlayerIsStopped(casesPossibles, celluleFinTour);


          } else if (e.key == "Up" || e.key == "ArrowUp") {
              celluleFinTour = carteUne.cellules.find((cellule) => {
                  return (cellule.x === this.posX) && (cellule.y === (celluleDebutTour.y) - 1);
              });
              this.checkIfPlayerIsStopped(casesPossibles, celluleFinTour);

          }    

          
            document.removeEventListener("keydown", (e) => {
                this.gestionEvenementsClavier(casesPossibles, e);
              });
            
          

        
       
      
        
          
        }
      } 

      checkIfPlayerIsStopped(casesPossibles, celluleFinTour){
        if (this.actif === true && (casesPossibles.includes(celluleFinTour) === false || this.stopped === true)) {
          celluleFinTour = carteUne.cellules.find((cellule) => {
              return (cellule.x === this.posX) && (cellule.y === this.posY);
          });
          this.stopped = true;
          //alert("Impossible d'aller plus loin");
          console.log("joueur actif" + this.nom + "actif :" + this.actif + "moving :" + this.moving +"stopped :" + this.stopped);
          document.removeEventListener("keydown", (e) => {
            this.gestionEvenementsClavier(casesPossibles, this, e);
          });
        }
        
          this.afficheInfos();
          this.nouvellePosJoueur(casesPossibles, celluleFinTour);
        
        
      }

      nouvellePosJoueur(casesPossibles, celluleFinTour) {
          
        if (this.actif === true) {
            casesPossibles.forEach(cellule => {
                document.getElementById(cellule.id).style.backgroundColor = "#4C2E4D";
            });
            let idCelluleFinTour = celluleFinTour.id;
            document.getElementById(idCelluleFinTour).style.backgroundImage = "url(" + this.visuel + ")";
            if(this.stopped === false){
            document.getElementById("cellule" + this.posX + this.posY).style.backgroundImage = "none";
            }
            this.posX = celluleFinTour.x;
            this.posY = celluleFinTour.y;
            if (this.tmp !== null) {
                document.getElementById(this.tmp.idCase).style.backgroundImage = "url(" + this.tmp.arme.visuel + ")";
                this.tmp = null;
            }
            this.detectionChangementDArme(celluleFinTour);
            this.moving = false;
            this.stopped = false;
            if(this === joueurUn){
                console.log(joueurUn, joueurDeux);
                this.detectionCombat(joueurDeux);
                this.tourSuivant(joueurDeux);
            } else {
                this.detectionCombat(joueurUn);
                this.tourSuivant(joueurUn);
            }

        }
      
    }

    detectionChangementDArme(celluleFinTour) {
        //pbm avec cette fonction
      carteUne.cellules.forEach(cellule => {
          if (cellule.id === celluleFinTour.id) {
              if (cellule.contientArme !== null) {
                  let tampon = {
                      arme: this.arme,
                      idCase: celluleFinTour.id
                  }
                  this.tmp = tampon;
                  this.arme = cellule.contientArme;
                  this.afficheInfos();
                  cellule.contientArme = tampon.arme;

              } 
          }

      });
  
  }

  detectionCombat(adversaire) {
    if (((this.posX === adversaire.posX) && (this.posY === (adversaire.posY - 1))) ||
        ((this.posX === adversaire.posX) && (this.posY === (adversaire.posY + 1))) ||
        ((this.posX === adversaire.posX - 1) && (this.posY === (adversaire.posY))) ||
        ((this.posX === adversaire.posX + 1) && (this.posY === (adversaire.posY)))) {
        alert("Combat lancé");
        this.stopped = true;
        adversaire.stopped = true;
        this.afficheInfos();
        adversaire.afficheInfos();
        this.boutonsCombat(adversaire);
    }

}

    tourSuivant(adversaire) {
        if(this.actif === true && this.stopped === false){
            let btnTourSuivant = document.createElement("button");
            btnTourSuivant.className += "game_btn";
            btnTourSuivant.innerHTML = "Tour suivant";
            this.coteJoueur.appendChild(btnTourSuivant);
            this.btnTourSuivant = btnTourSuivant;
            

        btnTourSuivant.addEventListener("click", () => {
            this.actif = false;
            this.afficheInfos();
            adversaire.actif = true;
            adversaire.stopped = false;
            adversaire.afficheInfos();
            console.log("tour suivant : this "+ this.nom + " " + this.actif + " adversaire " + adversaire.nom + " " + adversaire.actif );
        });
    }
    
    }

   

    /**
     * Affiche les boutons du combat dans l'encadré de chaque joueur
     * @param{object} adversaire - le joueur adverse
     */

    boutonsCombat(adversaire) {
        
        this.afficheInfos();
        adversaire.afficheInfos();

        if (this.actif === true) {
            let btnAttaquer = document.createElement("button");
            btnAttaquer.className += "game_btn";
            this.coteJoueur.appendChild(btnAttaquer);
            btnAttaquer.innerHTML = "Attaquer";
            let btnSeDefendre = document.createElement("button");
            btnSeDefendre.className += "game_btn";
            this.coteJoueur.appendChild(btnSeDefendre);
            btnSeDefendre.innerHTML = "Se défendre";
            btnAttaquer.addEventListener("click", () => {
                this.attaquer(adversaire);
            });
            btnSeDefendre.addEventListener("click", () => {
                this.seDefendre(adversaire);
            });
        }

    
      }

      
      

    

    

    /**
     * attaque l'adversaire et réalise les dégâts définis par l'arme
     * @param{object} adversaire - le joueur adverse
     */

    attaquer(adversaire) {
        this.choixDefense = false;
        if (adversaire.choixDefense === true) {
            adversaire.sante -= this.power / 2;
        } else {
            adversaire.sante -= this.power;
        }
        adversaire.afficheInfos();
        if (adversaire.sante <= 0) {
            this.gameOver(adversaire);
        }
        this.actif = false;
        this.afficheInfos();
        adversaire.actif = true;
        adversaire.boutonsCombat(this);
    }
    /**
     * passe choixDefense à true
     * @param{object} adversaire - le joueur adverse
     */

    seDefendre(adversaire) {
        this.choixDefense = true;
        this.actif = false;
        this.afficheInfos();
        adversaire.actif = true;
        adversaire.boutonsCombat(this);

    }
    /**
     * animation de fin de combat
     * @param{object} adversaire - le joueur adverse
     */

    gameOver(adversaire) {
        let gameOver = document.getElementById("game_over");
        document.getElementById("game").style.display = "none";
        gameOver.style.display = "block";
        gameOver.innerHTML = this.nom + " wins. " + adversaire.nom + " looses. <br />";
        let btnRestart = document.createElement("button");
        btnRestart.className += "outro_btn";
        game.appendChild(btnRestart);
        btnRestart.innerHTML = "<a href='index.html'>RESTART ?</a>";
        gameOver.appendChild(btnRestart);

    }

}