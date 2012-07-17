for file in `ls *.md`
  do
  echo Converting file $file
  cp $file `basename $file .md`_.md
  ./fr2html.sh `basename $file .md`_.md
  ./convertLinks.sh `basename $file .md`_.md
  markdown `basename $file .md`_.md>`basename $file .md`.html
  rm `basename $file .md`_.md
done

echo Copying documentation and sources onto server
scp *.png *.html *.js carpasinivores@198.245.54.228:/var/www/carpasinivores

for file2 in `ls *.md`
  do
  file=`basename $file2 .md`.html
  echo Removing temp file $file
  rm $file
done

