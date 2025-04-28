#!/usr/bin/bash

rm -rf docs
ng build --base-href /plagdet-ui/ --deploy-url /plagdet-ui/ --output-path docs
mv ./docs/browser/* ./docs
rm -rf docs/browser
