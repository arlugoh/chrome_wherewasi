#!/bin/bash

pwd;

ls ./dist/;
echo "Removing...";
rm ./dist/*

zip -j ./dist/WhereWasI ./src/*;
