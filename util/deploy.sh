cd ..

rm -rf dist &&

node_modules/webpack/bin/webpack.js --bail --progress --profile &&

# TODO run tests
cp -r ./repo/fungi-lang.rust/target ./dist/examples
rm -rf ./dist/examples/debug
rm ./dist/examples/rustc_info.json

# git add . &&
# git commit -m "(Deploy)" &&
git push heroku master

rm -rf dist


## Helpful for testing ##
# git add . && git commit --amend --no-edit && git push heroku master --force && heroku logs -t