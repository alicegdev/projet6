class Joueur {
    constructor(nom, arme, sante, visuel){
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

    get informations(){
        return `<br />Nom : ${this.nom}` + `<br /><br />Arme : ${this.arme.nom}` + `<br /><br />Sante : ${this.sante} <br />`;
    }

    get power(){
        return this.arme.degats;
    }

    afficheInfos(){
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

    boutonsCombat(adversaire){
        if(this.actif === true){
        let btnAttaquer = document.createElement("button");
        btnAttaquer.className += "game_btn";
        this.coteJoueur.appendChild(btnAttaquer);
        btnAttaquer.innerHTML = "Attaquer";
        let btnSeDefendre = document.createElement("button");
        btnSeDefendre.className +="game_btn";
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

    attaquer(adversaire){
            this.choixDefense = false;
            if(adversaire.choixDefense === true){
            adversaire.sante -= this.power/2;
            }else{
            adversaire.sante -= this.power;
            }
            adversaire.afficheInfos();
            if(adversaire.sante <= 0){
                let gameOver = document.getElementById("game_over");
                document.getElementById("game").style.display = "none";
                gameOver.style.display = "block";
                gameOver.innerHTML = this.nom + " wins. " + adversaire.nom + " looses. <br />";
                let btnRestart = document.createElement("button");
                btnRestart.className += "outro_btn";
                game.appendChild(btnRestart);
                btnRestart.innerHTML ="<a href='index.html'>RESTART ?</a>";
                gameOver.appendChild(btnRestart);
               
                

            }
            this.actif = false;
            this.afficheInfos();
            adversaire.actif = true;
            adversaire.boutonsCombat(this);
    }

    seDefendre(adversaire){
            this.choixDefense = true;
            this.actif = false;
            this.afficheInfos();
            adversaire.actif = true;
            adversaire.boutonsCombat(this);

    }
    

    }




