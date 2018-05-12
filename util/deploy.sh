cd ..

npm_lifecycle_event=build

rm -rf dist &&

node node_modules/webpack-cli/bin/webpack.js --bail --progress --profile &&

git add . &&
# git commit -m"(Deploy)"
# git push origin master
# git push heroku master
git commit --amend --no-edit &&
git push heroku master --force &&

rm -rf dist


## Helpful for testing ##
# git add . && git commit --amend --no-edit && git push heroku master --force && heroku logs -t