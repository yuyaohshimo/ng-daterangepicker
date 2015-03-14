#!/bin/sh

tag=$1
archive=http://github.com/yuyaohshimo/ng-daterangepicker/archive/
tmp=tmp/

echo $tag # e.g. v0.0.0
echo $archive

echo $archive$tag.zip

# download target version
mkdir tmp
rm daterangepicker*

wget $archive$tag.zip -P $tmp
unzip $tmp/$tag -d $tmp

# update daterangepicker.js daterangepicker.css
cp ${tmp}ng-daterangepicker-*/dist/daterangepicker.[!min]* ./
mv daterangepicker.css daterangepicker-${tag}.css
mv daterangepicker.js daterangepicker-${tag}.js

# update app.js
cp -f ${tmp}ng-daterangepicker-*/example/app.js ./

# replace links
cp -f ${tmp}ng-daterangepicker-*/example/index.html ./
sed -e 's/\.\.\/bower_components\/angular\/angular\.js/angular-v1.3.6.js/' -e 's/\.\.\/bower_components\/moment\/moment\.js/moment-v2.9.0.js/' -e 's/\.\.\/dist\/daterangepicker\.js/daterangepicker-'${tag}'.js/' -e 's/\.\.\/dist\/daterangepicker\.css/daterangepicker-'${tag}'.css/' index.html > ./out.html
mv -f ./out.html ./index.html

rm -rf tmp

# push to github
git add --all
git commit -m ':arrow_up: '${tag}
git push origin gh-pages