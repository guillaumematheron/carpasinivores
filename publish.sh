echo "[![Logo](logo.png)](index.html)" >header

for file in `ls *.md`
  do
  echo Converting file $file
  # cp header `basename $file .md`_.md
  cat $file >> `basename $file .md`_.md
  ./fr2html.sh `basename $file .md`_.md
  ./convertLinks.sh `basename $file .md`_.md
  markdown `basename $file .md`_.md>release/`basename $file .md`_.html
  cat headerHTML release/`basename $file .md`_.html > release/`basename $file .md`.html
  rm release/`basename $file .md`_.html
  rm `basename $file .md`_.md
done

echo Copying documentation and sources onto server
cp *.png *.html *.js *.xml release
scp -r release carpasinivores@198.245.54.228:/var/www/carpasinivores
scp -r index_.html carpasinivores@198.245.54.228:/var/www/carpasinivores/index.html

rm header
