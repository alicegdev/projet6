/**
 * représente le joueur et ses attributs
 * @constructor
 * @param {string} nom - nom donné au joueur
 * @param {object} arme - l'arme par défaut ou prise par le joueur
 * @param {number} sante - les points de vie du joueur
 * @param {img} visuel - l'image utilisée comme avatar du joueur
 * @param {element} coteJoueur - tout l'encadré qui montre les stats du joueur et contient les boutons
 * @param {element} coteInfos - uniquement le container des informations du joueur
 * @param {number} posX - la position en x de la case sur laquelle est le joueur
 * @param {number} posY- la position en y de la case sur laquelle est le joueur
 * @param {object} tmp - contient l'arme détenue par le joueur avant d'en changer
 * @param {boolean} actif - "true" si c'est au tour du joueur en question
 * @param {boolean} choixDefense - "true" si le joueur a fait le choix de se défendre
 * @method afficheInfos - affiche les détails du joueur dans son encadré + le bouton déplacement
 * @method boutonsCombat - affiche les boutons du combat au tour par tour dans l'encadré
 * @method attaquer - attaque l'adversaire et réalise les dégâts définis par l'arme
 * @method seDefendre - passe choixDefense à true
 * @method gameOver - animation de fin de combat

 */

class Joueur {
    constructor(nom, arme, sante, visuel) {
        this.nom = nom;
        this.arme = arme;
        this.sante = sante;
        this.visuel = visuel;
        this.coteJoueur = 0;
        this.coteInfos = 0;
        this.posX = 0;
        this.posY = 0;
        this.tmp = null;
        this.actif = false;
        this.choixDefense = false;
    }

    get informations() {
        return `<br />Nom : ${this.nom}` + `<br /><br />Arme : ${this.arme.nom}` + `<br /><br />Sante : ${this.sante} <br />`;
    }

    get power() {
        return this.arme.degats;
    }

    afficheInfos() {
        this.coteJoueur.innerHTML = "";
        let coteInfos = document.createElement("div");
        this.coteInfos = coteInfos;
        this.coteInfos.innerHTML = this.informations;
        this.coteJoueur.appendChild(this.coteInfos);
        let btnDeplacement = document.createElement("button");
        btnDeplacement.className += "game_btn";
        this.coteJoueur.appendChild(btnDeplacement);
        btnDeplacement.innerHTML = "Déplacement";
        btnDeplacement.addEventListener("click", () => {
            carteUne.mouvementJoueur(this);
        })
    }

    boutonsCombat(adversaire) {
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

    seDefendre(adversaire) {
        this.choixDefense = true;
        this.actif = false;
        this.afficheInfos();
        adversaire.actif = true;
        adversaire.boutonsCombat(this);

    }
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
