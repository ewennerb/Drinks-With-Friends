#!/bin/bash

name="$1 $2"
echo "commits for " $name
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%ad) %C(bold blue)<%an>%Creset' --abbrev-commit --author="$name"
