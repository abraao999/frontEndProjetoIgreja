#!/bin/zsh

# npm run build
git add .

echo "mensagem do commit"
read message
git commit -m "$message"
git push -u origin main --force
