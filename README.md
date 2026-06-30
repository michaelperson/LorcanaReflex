# Lorcana Reflex — Exercice JavaScript : Timers & Tableaux

> **Module** : Web Interactive — JavaScript
> **Thème** : `setInterval`, `setTimeout`, manipulation de tableaux et du DOM
> **Durée estimée** : 3 à 5 h
> **Niveau** : Intermédiaire (HTML/CSS acquis, bases de JS et du DOM)

---

## 1. Le mot du formateur

Un jeu de réflexe est l'exemple le plus honnête qui soit pour comprendre les timers : on ne *triche* pas avec le temps, le navigateur exécute votre code quand vous le lui demandez, ni avant ni après. Si votre carte clignote trop vite, ce n'est pas la faute de JavaScript — c'est votre `setTimeout` qui est mal calibré.

L'objectif n'est donc pas seulement de « faire marcher le jeu », mais de **maîtriser le cycle de vie d'un timer** : le démarrer, le mémoriser, l'arrêter. Un `setInterval` qu'on oublie de `clearInterval`, c'est une fuite : le grand classique qui transforme une page web fluide en radiateur.

---

## 2. Aperçu du jeu

**Lorcana Reflex** est un mini-jeu de rapidité sur le thème des cartes Disney Lorcana.

Une grille de **3 × 3 cartes** est affichée, toutes face cachée (le dos doré). À intervalle régulier, **une carte se retourne** et révèle un Illumineur pendant un court instant. Le joueur doit **cliquer dessus avant qu'elle ne se retourne**. Chaque carte attrapée rapporte un point de « lumière ». Quand les 9 cartes ont été capturées, une **modale de fin de partie** s'affiche avec le score final.

Trois niveaux de difficulté règlent la **vitesse d'apparition** : Facile (lent), Normal (classique), Extrême (réflexes d'Illumineur).

---

## 3. Objectifs pédagogiques

À la fin de cet exercice, vous devez être capable de :

| # | Compétence | Concept clé |
|---|-----------|-------------|
| 1 | Déclencher une action répétée dans le temps | `setInterval` |
| 2 | Déclencher une action différée unique | `setTimeout` |
| 3 | **Arrêter** un timer proprement | `clearInterval` + mémorisation de l'ID |
| 4 | Stocker et parcourir une collection de données | Tableau `[]`, `for`, `Array.includes`, `Array.push` |
| 5 | Tirer un élément au hasard | `Math.random`, `Math.floor`, indices |
| 6 | Générer des éléments du DOM dynamiquement | `createElement`, `appendChild`, `id` dynamiques |
| 7 | Réagir aux clics utilisateur | `addEventListener("click", …)` |
| 8 | Lire des données depuis le HTML | attributs `data-*` (`dataset`) |
| 9 | Afficher/masquer un composant | `classList.add` / `remove` (`is-hidden`) |

---

## 4. Prérequis

- HTML5 et CSS3 (le code vous est **fourni**, vous ne le réécrivez pas).
- Notions de base en JavaScript : variables (`let`/`const`), fonctions, conditions, boucles.
- Un éditeur (VS Code recommandé) et l'extension **Live Server** pour exécuter le projet dans le navigateur.

---

## 5. Structure du projet

```
LorcanaReflex/
├── index.html          ← Structure de la page (FOURNI, à ne pas modifier)
├── css/
│   └── style.css       ← Thème, grille, animations (FOURNI)
├── images/
│   ├── back.jpg        ← Dos de carte (état par défaut)
│   ├── Dodge!.jpg      ← 9 Illumineurs (faces avant)
│   └── … (8 autres cartes)
└── js/
    └── script.js       ← VOTRE TRAVAIL
```

### Ce qui est fourni

- **`index.html`** : tout le balisage est prêt. Repérez-y les « points d'accroche » que votre JS va utiliser (voir tableau §7).
- **`css/style.css`** : tout le style est prêt, **y compris les classes que votre JS doit poser/retirer** (`card--target`, `is-hidden`, …). Vous n'avez pas à écrire de CSS.
- **`images/`** : le dos de carte et les 9 faces.

### Ce que vous devez produire

- **`js/script.js`** uniquement : toute la logique du jeu.

---

## 6. Les points d'accroche du HTML

Votre JavaScript dialogue avec le HTML via ces identifiants et attributs. Lisez-les avant de coder.

| Élément HTML | Sélecteur | Rôle |
|---|---|---|
| `<section id="game-board">` | `#game-board` | Conteneur où vous **injectez** les 9 cartes |
| `<span id="score">` | `#score` | Affichage du score (texte) |
| `<button id="start-btn">` | `#start-btn` | Lance la partie |
| `<button id="replay-btn">` | `#replay-btn` | Relance une partie |
| `<div id="end-modal">` | `#end-modal` | Modale de fin (cachée via `.is-hidden`) |
| `<span id="final-score">` | `#final-score` | Score recopié dans la modale |
| `<input name="difficulty" data-spawn="…">` | `input[name="difficulty"]:checked` | Niveau choisi ; `data-spawn` = vitesse en ms |

### Les vitesses (attribut `data-spawn`)

| Niveau | `data-spawn` | Une carte apparaît toutes les… |
|---|---|---|
| 🌙 Facile | `1100` | 1,1 s |
| ✦ Normal *(coché par défaut)* | `800` | 0,8 s |
| 🔥 Extrême | `500` | 0,5 s |

> **Note du formateur** : les valeurs vivent dans le HTML, pas dans le JS. C'est volontaire. Un designer doit pouvoir rééquilibrer la difficulté sans toucher à votre code. Lisez-les avec `element.dataset.spawn` — et n'oubliez pas que `dataset` renvoie toujours une **chaîne** : `"800"` n'est pas `800`. Pensez `Number(…)`.

### Classes CSS pilotées par le JS

| Classe | Posée par le JS sur… | Effet visuel |
|---|---|---|
| `card` + `card__face--back` | chaque carte créée | Affiche le dos `back.jpg` |
| `card--target` | la carte actuellement révélée | Halo doré + animation |
| `is-hidden` | la modale | La masque (`display:none`) |

> Pour révéler une face : on **vide ou on remplit** `style.backgroundImage` de la carte. Vide → le CSS reprend le dos. Rempli avec `url('./images/…')` → la face s'affiche.

---

## 7. Règles du jeu (la spécification fonctionnelle)

1. Au chargement, la grille affiche **9 cartes face cachée**.
2. Le joueur choisit une difficulté (ou garde « Normal ») puis clique sur **Lancer la partie**.
3. Toutes les `data-spawn` millisecondes, **une carte encore non capturée** se retourne au hasard.
4. La carte révélée reste visible un court instant (un peu moins que l'intervalle), puis se **referme automatiquement** si elle n'a pas été cliquée.
5. Si le joueur **clique sur la carte pendant qu'elle est révélée**, elle est **capturée** : elle ne réapparaîtra plus et le score augmente de 1.
6. Une carte **déjà capturée** ne se retourne plus jamais.
7. Quand les **9 cartes** sont capturées, la partie s'arrête (`clearInterval`) et la **modale de fin** s'affiche avec le score.
8. Le bouton **Rejouer** réinitialise la grille pour une nouvelle partie.

---

## 8. Énoncé — étapes guidées

Travaillez par incréments : à chaque étape, **testez dans le navigateur** avant de passer à la suivante. Le débogage d'un timer cassé est dix fois plus simple quand on n'a ajouté qu'une seule chose.

### Étape 0 — Câblage
Récupérez vos éléments du DOM (`getElementById`) : plateau, score, bouton démarrer, bouton rejouer, modale.

### Étape 1 — Les données
Créez le **tableau des 9 noms de fichiers** d'images. Créez aussi un tableau vide qui mémorisera les **cartes déjà capturées**.

### Étape 2 — Générer le plateau
Écrivez une fonction qui **vide** le plateau puis crée **9 `<div>`** en boucle. Chaque carte doit :
- recevoir les classes `card` et `card__face--back`,
- recevoir un `id` unique (ex. `orcana-0` … `orcana-8`),
- écouter le clic de l'utilisateur.

Appelez cette fonction au chargement de la page.

### Étape 3 — Retourner une carte
Écrivez une fonction `flip` qui, pour un index donné :
- **révèle** la face (remplit `backgroundImage`, ajoute `card--target`) **ou**
- **referme** la carte (vide `backgroundImage`, retire `card--target`).
- Quand elle révèle une carte, elle programme sa fermeture automatique avec **`setTimeout`** (durée : un peu moins que l'intervalle).
- Une carte déjà capturée ne doit pas pouvoir être retournée.

> Pensez à mémoriser **quelle carte est actuellement révélée** dans une variable (ex. `currentIndex`).

### Étape 4 — Choisir une carte au hasard
Écrivez une fonction qui construit la liste des **indices encore disponibles** (non capturés), en choisit **un au hasard**, et appelle `flip` pour le révéler.

### Étape 5 — Le tic d'horloge
Au clic sur **Lancer la partie** :
- lisez la vitesse via `data-spawn` (n'oubliez pas `Number(…)`),
- démarrez un **`setInterval`** qui appelle votre fonction de l'étape 4,
- **mémorisez l'ID retourné** par `setInterval` dans une variable — vous en aurez besoin pour l'arrêter,
- désactivez le bouton et le choix de difficulté pendant la partie.

### Étape 6 — Capturer une carte
Écrivez la fonction appelée au clic sur une carte. Elle doit vérifier que **la carte cliquée est bien celle actuellement révélée**. Si oui : marquez-la comme capturée, incrémentez le score.

### Étape 7 — Fin de partie
Quand le score atteint **9** : `clearInterval` (avec l'ID mémorisé !), affichez la modale, recopiez le score final dedans.

### Étape 8 — Rejouer
Au clic sur **Rejouer** : remettez la grille à zéro et ré-autorisez le démarrage.

---

## 9. Exigences techniques

- Le jeu doit être **100 % piloté par `js/script.js`** ; ne modifiez ni le HTML ni le CSS.
- Vous **devez** utiliser au moins une fois `setInterval`, `setTimeout` et `clearInterval`.
- L'ID du `setInterval` **doit** être stocké dans une variable pour permettre l'arrêt — un timer non arrêté est une faute.
- Les cartes sont générées **dynamiquement** par le JS (pas de `<div class="card">` écrit en dur dans le HTML).
- Code **lisible** : noms de variables explicites, fonctions courtes, commentaires sur les passages non évidents.
- Aucune erreur dans la **console** du navigateur.

---

## 10. Barème indicatif (/20)

| Critère | Points |
|---|---|
| Génération dynamique des 9 cartes | 3 |
| Révélation aléatoire d'une carte via `setInterval` | 4 |
| Fermeture automatique via `setTimeout` | 3 |
| Détection correcte du clic « réussi » + score | 4 |
| Fin de partie : `clearInterval` + modale | 3 |
| Lecture du niveau via `data-spawn` | 1 |
| Qualité du code (lisibilité, console propre) | 2 |

---

## 11. Pour aller plus loin (bonus)

- **Réinitialisation complète au Rejouer** : remettre le score **et** le tableau des cartes capturées à zéro (voir §15, c'est un piège classique).
- **Vrai sélecteur de difficulté** : relire le radio coché *au moment du clic* sur « Lancer », pas une fois pour toutes (voir §15).
- **Compteur de temps** ou **score de précision** (ratio clics réussis / clics totaux).
- **Effet sonore** ou animation `card--hit` (déjà prête dans le CSS) au moment de la capture.
- **Meilleur score** conservé en mémoire pendant la session.

---

## 12. Comment lancer le projet

1. Ouvrez le dossier `LorcanaReflex` dans VS Code.
2. Clic droit sur `index.html` → **Open with Live Server** (ou ouvrez simplement le fichier dans un navigateur).
3. Ouvrez la **console développeur** (`F12`) pour surveiller les erreurs pendant que vous codez.

---
---

# PARTIE 2 — Documentation technique du code de référence

> Cette partie décrit le fonctionnement du `script.js` fourni à titre de **solution de référence**. À distribuer **après** l'exercice, ou à réserver au formateur. Elle inclut une analyse honnête des limites du code — précieuse pour la correction et pour alimenter les bonus.

## A. Vue d'ensemble du flux

```
Chargement page
   └─ loadGameBoard()            → crée 9 cartes face cachée

Clic « Lancer la partie »
   ├─ level = Number(data-spawn) → vitesse choisie
   ├─ setInterval(nextIndex, level) → INTERVAL stocké dans intervalGame
   └─ désactive bouton + difficulté

À chaque tic (toutes les `level` ms) : nextIndex()
   ├─ liste les indices NON capturés
   ├─ en tire un au hasard
   └─ flip(0, index)             → révèle la carte
        └─ setTimeout(flip(1, index), level - 200)  → la referme

Clic sur une carte : checkLighted(i)
   ├─ si i == currentIndex → capture : push + score++
   └─ si score == 9 → clearInterval + modale

Clic « Rejouer » : loadGameBoard() + réactive les contrôles
```

## B. Variables globales et sélecteurs

```js
const gameBoard = document.getElementById("game-board"); // plateau
const score     = document.getElementById("score");      // <span> du score
const btnGo      = document.getElementById("start-btn");
const btnRejouer = document.getElementById("replay-btn");
const modale     = document.getElementById("end-modal");

const radio  = document.querySelector('input[name="difficulty"]:checked');
const niveau = radio.value;   // "facile" | "normal" | "extreme"
let level = 800;              // vitesse par défaut (ms), écrasée au démarrage

let intervalGame;            // mémorise l'ID du setInterval (pour clearInterval)
```

- **`intervalGame`** est la variable cruciale : sans elle, impossible d'arrêter le jeu. C'est le « ticket de consigne » du timer.
- **`level`** est la durée d'un intervalle en millisecondes.

## C. Les deux tableaux

```js
const Cards = [ "Dodge!.jpg", "Donald_Duck_-_Buccaneer.jpg", /* … 9 au total */ ];
const lightedCard = [];   // indices des cartes déjà capturées
let currentIndex;         // index de la carte actuellement révélée
```

- **`Cards`** : la source de vérité des faces. `Cards.length` (= 9) sert aussi de **condition de victoire**.
- **`lightedCard`** : sert de « liste noire ». Une carte dont l'index y figure ne sera plus jamais retournée (`includes`) ni proposée par `nextIndex`.
- **`currentIndex`** : pivot de la détection du clic. Si on clique sur une carte dont l'index ≠ `currentIndex`, c'est raté.

## D. `flip(back = 1, index)` — retourner une carte

```js
const flip = function (back = 1, index) {
  if (!lightedCard.includes(index)) {              // ignore les cartes capturées
    let flipCard = document.getElementById(`orcana-${index}`);
    if (back == 1) {                               // → REFERMER
      flipCard.style.backgroundImage = "";         // le CSS reprend back.jpg
      flipCard.classList.remove("card--target");
      currentIndex = null;
    } else {                                       // → RÉVÉLER
      flipCard.style.backgroundImage = `url('./images/${Cards[index]}')`;
      flipCard.classList.add("card--target");
      currentIndex = index;
      setTimeout(() => { flip(1, index); }, level - 200); // auto-fermeture
    }
  }
};
```

- Le paramètre `back` (défaut `1`) sert d'interrupteur : `1` ferme, `0` ouvre.
- **Le `setTimeout`** est le cœur du gameplay : la carte reste visible `level - 200` ms. À « Extrême » (500), cela fait **300 ms** pour réagir.
- Vider `backgroundImage` suffit à réafficher le dos, car `back.jpg` est défini en CSS sur `.card`.

## E. `checkLighted(clickIndex)` — gérer un clic

```js
const checkLighted = function (clickIndex) {
  if (currentIndex == undefined || currentIndex == null) return; // aucune carte ouverte
  if (currentIndex == clickIndex) {                  // bon clic !
    lightedCard.push(clickIndex);                    // carte capturée
    let currentScore = parseInt(score.textContent);
    currentScore++;
    score.textContent = currentScore;
    if (currentScore == Cards.length) {              // victoire (9/9)
      clearInterval(intervalGame);                   // STOP le timer
      modale.classList.remove("is-hidden");          // affiche la modale
      document.getElementById("final-score").textContent = currentScore;
      document.getElementById("finlevel").innerText = `(Niveau : ${niveau})`;
    }
  }
};
```

- Le `return` en garde évite de scorer quand aucune carte n'est révélée.
- La victoire compare le score à `Cards.length` — élégant : si demain on passe à 12 cartes, la condition suit toute seule.
- **`clearInterval(intervalGame)`** : le geste qui clôt proprement la partie.

## F. `loadGameBoard()` — fabriquer la grille

```js
const loadGameBoard = function () {
  gameBoard.innerHTML = "";                 // table rase
  for (let i = 0; i < 9; i++) {
    let carte = document.createElement("div");
    carte.style.backgroundImage = "";
    carte.classList.add("card");
    carte.classList.add("card__face--back");
    carte.id = `orcana-${i}`;               // id unique pour flip()
    carte.addEventListener("click", () => checkLighted(i));
    gameBoard.appendChild(carte);
  }
};
```

- `innerHTML = ""` purge l'ancienne grille (utile au Rejouer).
- L'`id` `orcana-${i}` est le lien entre la position visuelle et la logique : c'est ainsi que `flip` retrouve le bon `<div>`.
- La closure `() => checkLighted(i)` capture le bon `i` grâce à `let` (portée de bloc).

## G. `nextIndex()` — tirage au sort

```js
const nextIndex = function () {
  const disponibles = [];
  for (let i = 0; i < 9; i++) {
    if (!lightedCard.includes(i)) disponibles.push(i); // seulement les non capturées
  }
  if (disponibles.length > 0) {
    const index = disponibles[Math.floor(Math.random() * disponibles.length)];
    flip(0, index);                                    // révèle
  }
};
```

- On ne tire **que parmi les cartes encore en jeu** → pas de temps perdu à révéler une carte déjà gagnée.
- `Math.floor(Math.random() * n)` : le motif standard pour un indice aléatoire de `0` à `n-1`.

## H. Démarrage, arrêt et rejouer

```js
loadGameBoard();   // au chargement

btnGo.addEventListener("click", function () {
  radio.disabled = true;
  level = Number(radio.dataset.spawn);      // lit la vitesse depuis le HTML
  modale.classList.add("is-hidden");
  intervalGame = setInterval(nextIndex, level); // ← le moteur du jeu
  btnGo.disabled = true;
});

btnRejouer.addEventListener("click", function () {
  loadGameBoard();
  btnGo.disabled = false;
  modale.classList.add("is-hidden");
  radio.disabled = false;
});
```

## I. Tableau de bord des timers

| Timer | Type | Déclencheur | Période | Action | Arrêt |
|---|---|---|---|---|---|
| Apparition des cartes | `setInterval` | Clic « Lancer » | `level` ms | `nextIndex()` | `clearInterval(intervalGame)` à 9/9 |
| Fermeture d'une carte | `setTimeout` | Chaque révélation | `level - 200` ms (une fois) | `flip(1, index)` | s'auto-termine |

---

## J. Limites connues & pistes de correction *(or pédagogique)*

Le code de référence **fonctionne pour une partie**, mais contient deux pièges très instructifs. Idéal pour transformer la correction en discussion, ou pour alimenter les bonus du §11.

### 1. Le sélecteur de difficulté est « gelé »

```js
const radio = document.querySelector('input[name="difficulty"]:checked');
```

Cette ligne s'exécute **une seule fois, au chargement**. Elle capture le radio coché à cet instant (« Normal »). Si le joueur clique ensuite sur « Facile » ou « Extrême », le DOM change… mais la variable `radio` **pointe toujours sur l'élément « Normal »**. Résultat : `radio.dataset.spawn` vaut toujours `800`, quelle que soit la sélection. De même, `radio.disabled = true` ne désactive que le radio « Normal ».

> **Correction** : relire le radio coché **au moment du clic** sur « Lancer » :
> ```js
> btnGo.addEventListener("click", function () {
>   const radio = document.querySelector('input[name="difficulty"]:checked');
>   level = Number(radio.dataset.spawn);
>   // …
> });
> ```
> C'est l'illustration parfaite de la différence entre **capturer une valeur** et **capturer une référence vivante**.

### 2. « Rejouer » ne réinitialise pas tout

`btnRejouer` recrée bien la grille, mais **ne remet à zéro ni le score ni `lightedCard`** :

- `score.textContent` reste à `9` ;
- `lightedCard` contient toujours les 9 indices → toutes les cartes sont considérées « capturées » → `nextIndex` ne trouve **aucune carte disponible** et plus rien ne se retourne.

> **Correction** : dans le handler de Rejouer, ajouter
> ```js
> score.textContent = "0";
> lightedCard.length = 0;   // vide le tableau
> currentIndex = null;
> ```

### 3. Chevauchement de cartes (cas limite)

Si `level - 200` est mal calibré, une nouvelle carte peut apparaître avant la fermeture de la précédente. `currentIndex` étant écrasé, l'ancienne carte reste visible mais **n'est plus cliquable avec succès**. C'est cohérent avec un jeu de réflexe, mais à connaître.

---

## K. Glossaire express

| Terme | Définition courte |
|---|---|
| **`setInterval(fn, ms)`** | Exécute `fn` toutes les `ms` millisecondes, à l'infini. Renvoie un **ID**. |
| **`setTimeout(fn, ms)`** | Exécute `fn` **une seule fois**, après `ms` millisecondes. |
| **`clearInterval(id)`** | Stoppe l'intervalle identifié par `id`. |
| **`dataset`** | Accès aux attributs `data-*` du HTML (toujours des chaînes). |
| **`classList`** | API pour ajouter/retirer/tester des classes CSS sur un élément. |
| **closure** | Fonction qui « se souvient » des variables de son contexte de création (ici, le bon `i`). |

---

*Que la magie de Lorcana soit avec ton code. ✦*
