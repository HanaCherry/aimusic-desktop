# AI Music Desktop 0.4.0

Application Windows indépendante et non officielle pour https://aimusic.so/fr/app.

Le studio utilise les vrais formulaires et commandes du service. Les crédits viennent du solde affiché par AI Music. Les commandes de navigation et la vue originale du service se trouvent dans Paramètres.

## Nouveautés

- Pochette fixe dans un cadre arrondi, avec miniature près du titre dans le lecteur inférieur transparent.
- Lecture/pause, retour et avance de 15 secondes, répétition, favori, partage et téléchargement reliés aux commandes du service.
- Thème officiel et icône provenant des ressources publiques AI Music.
- Couleurs du thème Musique et de la progression extraites de la pochette sélectionnée, en mémoire.
- Mon compte : photo et pseudo locaux, distincts du compte AI Music. La photo est réduite à 256 pixels et reste dans le profil local.
- Paramètres audio : dix bandes de 31 Hz à 16 kHz, préampli, profils, A/B, largeur stéréo, panoramique, auto-pan, réverbération, écho et spectre. Les profils personnalisés restent locaux.

## Audio et vérification

Les effets activés utilisent un graphe Web Audio sur le véritable élément audio du lecteur. Le mode A/B revient au signal original. Le thème Musique réagit aux basses mesurées entre 35 et 180 Hz ; sans signal accessible, les étoiles restent immobiles et les paramètres indiquent cet état. Les contraintes normales du navigateur et du serveur audio sont conservées.

Les tests Electron utilisent un profil temporaire, un morceau synthétique et une page de service simulée. Ils vérifient les commandes, la pochette et sa palette, le profil local, les dix bandes, la réponse réelle des filtres, les effets et le bypass. Ils ne prouvent pas la compatibilité de chaque morceau distant. Aucun achat ni génération de chanson n'est effectué par ces tests.

## Données et cache

Profil : %APPDATA%/AIMusicDesktopIndependent. Cookies du service, cache disque, settings.json et local-profile.json restent dans ce profil propre. Aucun profil SunoApp ou navigateur n'est importé. Nettoyer le cache dans Paramètres conserve les cookies et préférences. La connexion Internet reste nécessaire.

## Développement

Node.js 22.12+, pnpm et Electron : pnpm install --frozen-lockfile, puis node node_modules/electron/install.js.

Tests : node --test tests/*.test.cjs puis electron . --smoke-test. Aperçu isolé : electron . --preview. Construction : node node_modules/electron-builder/cli.js --win nsis --x64 --publish never.

Le logiciel et l'installateur ne sont pas signés. Voir NOTICE.md pour les ressources officielles et l'indépendance du projet.
