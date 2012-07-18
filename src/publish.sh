echo "[![Logo](logo.png)](index.html)" >header

for file in `ls *.md`
  do
  echo Converting file $file
  # cp header `basename $file .md`_.md
  cat $file >> `basename $file .md`_.md
  ./fr2html.sh `basename $file .md`_.md
  ./convertLinks.sh `basename $file .md`_.md
  markdown `basename $file .md`_.md>../`basename $file .md`_.html
  cat headerHTML ../`basename $file .md`_.html > ../`basename $file .md`.html
  rm ../`basename $file .md`_.html
  rm `basename $file .md`_.md
done

echo Copying documentation and sources onto server
cp *.png simulator.html *.js *.xml ..
scp ../*.png ../*.html ../*.js carpasinivores@198.245.54.228:/var/www/carpasinivores

rm header
