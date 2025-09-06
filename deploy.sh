#!/bin/bash

# Script de déploiement pour pea-app
# Usage: ./deploy.sh "Message du commit"

# Vérifie qu'un message de commit est fourni
if [ -z "$1" ]; then
  echo "❌ Usage: ./deploy.sh \"Message du commit\""
  exit 1
fi

COMMIT_MSG="$1"

echo "📦 Ajout des fichiers..."
git add .

echo "📝 Commit avec le message : $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

echo "🚀 Push vers GitHub..."
git push origin main

echo "✅ Code envoyé sur GitHub."
