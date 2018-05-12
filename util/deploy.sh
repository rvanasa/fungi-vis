cd ..

# cp ../config/prod.config.js config.js &&
rm -rf dist &&

webpack --bail --progress --profile &&

git add . &&
git commit -m"(Deploy)" &&
# git push origin master &&
git push heroku master

# rm -f config.js
rm -rf dist
