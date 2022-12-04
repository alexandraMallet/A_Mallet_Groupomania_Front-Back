## GROUPOMANIA - réseau social d'entreprise - projet de formation Openclassrooms

"Le projet consiste à construire un réseau social interne pour les employés de Groupomania. Le
but de cet outil est de faciliter les interactions entre collègues. Le département RH de
Groupomania a imaginé plusieurs fonctionnalités pour favoriser les échanges entre collègues."

### langages, frameworks, outils...

Node.js (doit être préalablement installé sur la machine), Vue.js, Sass, Express, MongoDB, mongoose...

### pour lancer l'application depuis votre ordinateur :

- cloner ce repository
- __depuis le répertoire backend :__ 
    - lancer la commande __npm i__
    - créer le fichier __.env__
    - remplir le fichier __.env__ avec les identifiants de connexion à la BDD MongoDB, et la clé de token, sur le modèle du fichier .env.example
    - lancer la commande __nodemon server__
        Le terminal affiche le message : "Listening on port 3000 - Application connectée à MongoDB"
- __depuis le répertoire frontend :__ 
    - lancer la commande __npm install__
    - lancer la commande __npm run serve__ 
        Vous devriez recevoir le message "App running at : - Local: http://localhost:8080/  - Network: http://[your IP adress]:8080/"
    - cliquer sur un des deux liens, ou le copier-coller dans la barre url du navigateur.


