function mouvementJoueur(joueur) {
    joueur.actif = true;
    let rightPressed = false;
    let leftPressed = false;
    let downPressed = false;
    let upPressed = false;

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

    // let celluleFinTour = trouver la cellule sur laquelle le joueur est ("cellule" + joueur.posX + joueur.posY)
    let celluleFinTour = this.cellules.find((cellule) => {
        return (cellule.x === joueur.posX) && (cellule.y === joueur.posY) && (cellule.disponible === true);
    });

        keyDownHandler(e);
        keyUpHandler(e);
        if(rightPressed) {
            if (celluleFinTour.y > this.colonnes || celluleFinTour.y > (joueur.posY + 3)){
                celluleFinTour.y = this.colonnes;
                alert("Impossible d'aller plus loin");
            }else{
            celluleFinTour.y++;
            }
            // vérifier si la cellule est bien dans les cases possibles
            if(casesPossibles.includes(celluleFinTour) === true){
                nouvellePosJoueur(casesPossibles, celluleFinTour, joueur);
            }
            // et on propose de changer de tour
        }
        if(leftPressed) {
            if (celluleFinTour.y < 0 || celluleFinTour.y < (joueur.posY - 3)){
                celluleFinTour.y = 0;
                alert("Impossible d'aller plus loin");
            }else{
                celluleFinTour.y--;
            }
            if(casesPossibles.includes(celluleFinTour) === true){
                // mettre ça dans une petite fonction
                nouvellePosJoueur(casesPossibles, celluleFinTour, joueur);
            }

        }if(downPressed) {
            if (celluleFinTour.x > this.lignes || celluleFinTour.x > (joueur.posX + 3)){
                celluleFinTour.x = this.lignes;
                alert("Impossible d'aller plus loin");
            }else{
                celluleFinTour.x++;
            }
            if(casesPossibles.includes(celluleFinTour) === true){
                // mettre ça dans une petite fonction
                nouvellePosJoueur(casesPossibles, celluleFinTour, joueur);
            }


        }if(upPressed) {
            if(celluleFinTour.x < 0 || celluleFinTour.x < (joueur.posX - 3)){
                celluleFinTour.x = 0;
                alert("Impossible d'aller plus loin");
            }else{
                celluleFinTour.x--;
            }if(casesPossibles.includes(celluleFinTour) === true){
                // mettre ça dans une petite fonction
                nouvellePosJoueur(casesPossibles, celluleFinTour, joueur);
            }
        } 
           
            joueur.actif = false;
        }


function keyDownHandler(e){
    if(e.key =="Right" || e.key=="ArrowRight"){
        rightPressed = true;
    } if(e.key =="Left" || e.key =="ArrowLeft"){
        leftPressed = true;
    } if(e.key =="Down" || e.key =="ArrowDown"){
        downPressed = true;
    } else if(e.key =="Up" || e.key =="ArrowUp"){
        upPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    } if(e.key =="Down" || e.key =="ArrowDown"){
        downPressed = false;
    } else if(e.key =="Up" || e.key =="ArrowUp"){
        upPressed = false;
    }
}

function nouvellePosJoueur(casesPossibles, celluleFinTour, joueur) {
    casesPossibles.forEach(cellule => {
        document.getElementById(cellule.id).style.backgroundColor = "#4C2E4D";
    });
    document.getElementById(celluleFinTour.id).style.backgroundImage = "url(" + joueur.visuel + ")";
    document.getElementById("cellule" + joueur.posX + joueur.posY).style.backgroundImage = "none";
    joueur.posX = celluleFinTour.x;
    joueur.posY = celluleFinTour.y;
    if (joueur.tmp !== null) {
        document.getElementById(joueur.tmp.idCase).style.backgroundImage = "url(" + joueur.tmp.arme.visuel + ")";
        joueur.tmp = null;
    }
    detectionChangementDArme(celluleFinTour, joueur);
    detectionCombat(joueur);    
}

function detectionChangementDArme(celluleFinTour, joueur){
    this.cellules.forEach(cellule => {
        if (cellule.id === celluleFinTour.id) {
            if (cellule.contientArme !== null) {
                let tampon = {
                    arme: joueur.arme,
                    idCase: idCelluleFinTour
                }
                joueur.tmp = tampon;
                joueur.arme = cellule.contientArme;
                joueur.coteInfos.innerHTML = joueur.informations;
                cellule.contientArme = tampon.arme;

            }
        }

    });
}

function detectionCombat(joueur){
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