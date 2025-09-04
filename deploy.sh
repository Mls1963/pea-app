#!/bin/bash

# Script de déploiement pour pea-app
# Usage: ./deploy.sh "Message du commit"

# Vérifie qu'un message de commit est fourni
if [ -z "$1" ]; then
  echo "Usage: ./deploy.sh \"Message du commit\""
  exit 1
fi

COMMIT_MSG="$1"

# Étape 1 : Ajouter tous les fichiers
git add .

# Étape 2 : Commit
git commit -m "$COMMIT_MSG"

# Étape 3 : Push sur GitHub
git push origin main

echo "✅ Code poussé sur GitHub avec le message : $COMMIT_MSG"

# Étape 4 (optionnel) : Trigger redeploy via webhook Coolify
# Remplace WEBHOOK_URL par ton URL webhook Coolify si tu en as
WEBHOOK_URL="http://91.205.104.129:8000/api/v1/deploy?uuid=r0k8gskgw4ckw0sc4sokwcww&force=false"
if [ "$WEBHOOK_URL" != "" ]; then
  curl -X POST "$WEBHOOK_URL"
  echo "✅ Redeploy Coolify déclenché via webhook"
fi

echo "🚀 Déploiement terminé !"
