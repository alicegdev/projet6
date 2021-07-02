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
                carteUne.mouvementJoueur(this);
            });
            
        }
    }

    tourSuivant(adversaire) {
        if (this.actif === true || this.stopped === true) {
            let btnTourSuivant = document.createElement("button");
            btnTourSuivant.className += "game_btn";
            btnTourSuivant.innerHTML = "Tour suivant";
            this.coteJoueur.appendChild(btnTourSuivant);
            this.btnTourSuivant = btnTourSuivant;
        }
        this.btnTourSuivant.addEventListener("click", () => {
            this.actif = false;
            adversaire.actif = true;
            adversaire.stopped = false;
            this.afficheInfos();
            adversaire.afficheInfos();
        });
    }

    /**
     * Affiche les boutons du combat dans l'encadré de chaque joueur
     * @param{object} adversaire - le joueur adverse
     */

    boutonsCombat(adversaire) {
        this.stopped = true;
        adversaire.stopped = true;
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