# Configuration du formulaire de contact

Le site est statique. Un site statique ne peut pas envoyer un courriel directement à `officiellenovaparti@gmail.com` sans un service externe ou un serveur.

## Option 1 — Version actuelle : mailto

Déjà fonctionnelle : les formulaires ouvrent l'application courriel du visiteur avec un message préparé.

Avantage : simple, gratuit, aucun serveur.  
Limite : le visiteur doit cliquer sur envoyer dans son application courriel.

## Option 2 — Netlify Forms

1. Héberger le site sur Netlify.
2. Remplacer le formulaire de `contact.html` par un formulaire `method="POST"` avec `data-netlify="true"`.
3. Dans Netlify, activer les notifications par courriel vers `officiellenovaparti@gmail.com`.

## Option 3 — Formspree

1. Créer un formulaire sur Formspree.
2. Remplacer l'action du formulaire par l'URL Formspree.
3. Configurer la destination vers `officiellenovaparti@gmail.com`.

## Option 4 — Serveur PHP/Node

Créer un endpoint sécurisé qui valide les données, protège contre le spam, puis envoie le message par SMTP vers `officiellenovaparti@gmail.com`.
