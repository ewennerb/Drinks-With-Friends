#!/bin/bash

name="$1 $2"
echo "commits for " $name
git log --graph --pretty=format:'%Cgreen(%ad) %Cred%h%Creset -%C(yellow)%d%Creset %s %C(bold blue)<%an>%Creset' --abbrev-commit --author="$name"
