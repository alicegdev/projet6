

let cellulesInaccessibles = [];

let mitraillette = new Arme("mitraillette", "./img/mitraillette.png", 10);
let pistolet = new Arme("pistolet", "./img/pistolet.png", 5);
let lancegrenades = new Arme("lance-grenades", "./img/lance-grenades.png", 50);
let fusil = new Arme("fusil", "./img/fusil2.png", 25);

let tabArmes = [];

tabArmes[0] = mitraillette;
tabArmes[1] = pistolet;
tabArmes[2] = lancegrenades;
tabArmes[3] = fusil;

let joueurUn = new Joueur("Edea", mitraillette, "100", "./img/edea.png");
let joueurDeux = new Joueur("Grounch", mitraillette, "100", "./img/grounch.png");

let tabJoueurs = [];
tabJoueurs[0] = joueurUn;
tabJoueurs[1] = joueurDeux;

let carteUne = new Carte(6, 4, 3, tabJoueurs, tabArmes);

let btnGenerer = document.getElementById("btn_generer");

btnGenerer.addEventListener("click", () =>{
    carteUne.generer();
    carteUne.genererCasesInaccessibles();
    carteUne.genererCasesArmes();
    carteUne.genererCasesJoueurs();

});
