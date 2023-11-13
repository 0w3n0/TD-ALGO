let myChart;  // Déclarer la variable globale pour stocker l'instance du graphique
let myChart2;  // Déclarer la variable globale pour stocker l'instance du graphique


function dichoR(tab, n, debut = 0, fin = tab.length - 1) {
    if (debut > fin) return -1;
    let milieu = Math.floor((debut + fin) / 2);
    if (n == tab[milieu]) return "trouvé";
    else if (tab[milieu] < n) return dichoR(tab, n, milieu + 1, fin);
    else if (tab[milieu] > n) return dichoR(tab, n, debut, milieu - 1);
}

function dichoNR(tab, n) {
    let debut = 0;
    let fin = tab.length - 1;

    while (debut <= fin) {
        let milieu = Math.floor((debut + fin) / 2);
        if (tab[milieu] === n) {
            return "trouvé";
        } else if (tab[milieu] < n) {
            debut = milieu + 1;
        } else {
            fin = milieu - 1;
        }
    }

    return -1;
}


function CreateGrapheDichotomie() {
    // Détruire l'instance existante de Chart.js
    if (myChart2) {
        myChart2.destroy();
    }

    const taillesTableau = [10, 100, 1000, 10000, 50000, 100000];
    const tempsExecutionsRecursif = [];
    const tempsExecutionsNonRecursif = [];

    for (const taille of taillesTableau) {
        const tableauTest = Array.from({ length: taille }, (_, index) => index);
        console.log(tableauTest);
        const tempsExecutionRecursif = mesurerTempsExecution(dichoR, tableauTest, 72);
        const tempsExecutionNonRecursif = mesurerTempsExecution(dichoNR, tableauTest, 72);

        tempsExecutionsRecursif.push(tempsExecutionRecursif);
        tempsExecutionsNonRecursif.push(tempsExecutionNonRecursif);
        console.log(tempsExecutionNonRecursif)
        console.log(tempsExecutionRecursif);
    }

    // Utilisation de Chart.js pour créer un graphique
    const ctx2 = document.getElementById('myChart2').getContext('2d');
    myChart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: taillesTableau.map(String),
            datasets: [{
                label: 'Temps d\'exécution (ms) - Récursif',
                data: tempsExecutionsRecursif,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }, {
                label: 'Temps d\'exécution (ms) - Non Récursif',
                data: tempsExecutionsNonRecursif,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                },
                y: {
                    type: 'linear',
                    position: 'left'
                }
            }
        }
    });
}

function triBulle(tableau) {
    let n = tableau.length;
    let superieur;

    do {
        superieur = false;
        for (let i = 0; i < n - 1; i++) {
            if (tableau[i] > tableau[i + 1]) {
                let temp = tableau[i];
                tableau[i] = tableau[i + 1];
                tableau[i + 1] = temp;
                superieur = true;
            }
        }
        n--;
    } while (superieur);

    return tableau;
}

function triInsertion(tableau) {
    const n = tableau.length;

    for (let i = 1; i < n; i++) {
        let cle = tableau[i];
        let j = i - 1;

        while (j >= 0 && tableau[j] > cle) {
            tableau[j + 1] = tableau[j];
            j = j - 1;
        }
        tableau[j + 1] = cle;
    }

    return tableau;
}

function triFusion(tableau) {
    if (tableau.length <= 1) {
        return tableau;
    }

    const milieu = Math.floor(tableau.length / 2);
    const gauche = tableau.slice(0, milieu);
    const droite = tableau.slice(milieu);

    return fusionner(triFusion(gauche), triFusion(droite));
}

function fusionner(gauche, droite) {
    let resultat = [];
    let indexGauche = 0;
    let indexDroite = 0;

    while (indexGauche < gauche.length && indexDroite < droite.length) {
        if (gauche[indexGauche] < droite[indexDroite]) {
            resultat.push(gauche[indexGauche]);
            indexGauche++;
        } else {
            resultat.push(droite[indexDroite]);
            indexDroite++;
        }
    }

    return resultat.concat(gauche.slice(indexGauche), droite.slice(indexDroite));
}

function mesurerTempsExecution(fonction, ...args) {
    const debut = performance.now();
    fonction(...args);
    const fin = performance.now();
    return fin - debut;
}

function genererGraphiques() {
    // Détruire l'instance existante de Chart.js
    if (myChart) {
        myChart.destroy();
    }

    const intervalle = parseInt(document.getElementById('interval').value, 10);
    const triBulleChecked = document.getElementById('triBulleCheckbox').checked;
    const triInsertionChecked = document.getElementById('triInsertionCheckbox').checked;
    const triFusionChecked = document.getElementById('triFusionCheckbox').checked;

    const taillesTableau = [10, 100, 1000, 10000, 100000].filter(taille => taille <= intervalle);

    const tempsExecutions = {};
    const fonctionsTri = [];

    if (triBulleChecked) {
        fonctionsTri.push(triBulle);
        tempsExecutions['Tri à bulle'] = [];
    }
    if (triInsertionChecked) {
        fonctionsTri.push(triInsertion);
        tempsExecutions['Tri insertion'] = [];
    }
    if (triFusionChecked) {
        fonctionsTri.push(triFusion);
        tempsExecutions['Tri fusion'] = [];
    }

    for (const taille of taillesTableau) {
        const tableauTest = Array.from({ length: taille }, () => Math.floor(Math.random() * 1000));

        for (const fonctionTri of fonctionsTri) {
            if (!tempsExecutions[fonctionTri.name]) {
                tempsExecutions[fonctionTri.name] = []; // Assurez-vous que la propriété est définie avant de pousser des valeurs
            }
            const tempsExecutionTri = mesurerTempsExecution(fonctionTri, [...tableauTest]);
            tempsExecutions[fonctionTri.name].push(tempsExecutionTri);
        }
    }

    // Calculer les comparaisons entre les temps d'exécution
    const comparaisons = {};
    for (const fonctionTri of fonctionsTri) {
        comparaisons[fonctionTri.name] = {};
        for (const autreTri of fonctionsTri) {
            if (fonctionTri !== autreTri) {
                comparaisons[fonctionTri.name][autreTri.name] = comparerTemps(
                    tempsExecutions[fonctionTri.name],
                    tempsExecutions[autreTri.name]
                );
            }
        }
    }

    // Calculer les moyennes
    const moyennes = {};
    for (const fonctionTri of fonctionsTri) {
        moyennes[fonctionTri.name] = calculerMoyenne(tempsExecutions[fonctionTri.name]);
    }

    console.log('Comparaisons entre les temps d\'exécution :', comparaisons);
    console.log('Moyennes de temps d\'exécution :', moyennes);


    // Utilisation de Chart.js pour créer un graphique
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: taillesTableau.map(String),
            datasets: fonctionsTri.map((fonctionTri, index) => ({
                label: `Temps d'exécution (ms) - ${fonctionTri.name}`,
                data: tempsExecutions[fonctionTri.name],
                backgroundColor: `rgba(${index * 100 + 50}, ${255 - index * 100}, ${index * 50}, 0.7)`,
                borderColor: `rgba(${index * 100 + 50}, ${255 - index * 100}, ${index * 50}, 1)`,
                borderWidth: 1
            }))
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                },
                y: {
                    type: 'linear',
                    position: 'left'
                }
            }
        }
    });
    // Afficher les comparaisons et moyennes sous le graphe
    afficherComparaisonsEtMoyennes(comparaisons, moyennes);
}

function comparerTemps(tempsTri1, tempsTri2) {
    const differences = tempsTri1.map((temps1, index) => temps1 - tempsTri2[index]);
    const sommeDifferences = differences.reduce((somme, diff) => somme + diff, 0);
    return sommeDifferences;
}

function calculerMoyenne(tempsTri) {
    const somme = tempsTri.reduce((somme, temps) => somme + temps, 0);
    return somme / tempsTri.length;
}

function afficherComparaisonsEtMoyennes(comparaisons, moyennes) {
    const resultatDiv = document.getElementById('resultat');
    resultatDiv.innerHTML = '';

    for (const tri in comparaisons) {
        for (const autreTri in comparaisons[tri]) {
            const difference = comparaisons[tri][autreTri];
            console.log(tri, autreTri);
            console.log(difference);
            const message = `Le tri ${tri} est ${difference < 0 ? 'plus rapide' : 'plus lent'} que le tri ${autreTri} de ${Math.abs(difference)} ms.`;
            const paragraphe = document.createElement('p');
            paragraphe.textContent = message;
            resultatDiv.appendChild(paragraphe);
        }
    }

    for (const tri in moyennes) {
        const messageMoyenne = `Le tri ${tri} met en moyenne ${moyennes[tri]} ms pour effectuer le tri.`;
        const paragrapheMoyenne = document.createElement('p');
        paragrapheMoyenne.textContent = messageMoyenne;
        resultatDiv.appendChild(paragrapheMoyenne);
    }
}