for file in `ls *.md`
  do
  echo Converting file $file
  cp $file `basename $file .md`_.md
  ./fr2html.sh `basename $file .md`_.md
  ./convertLinks.sh `basename $file .md`_.md
  markdown `basename $file .md`_.md>`basename $file .md`.html
  rm `basename $file .md`_.md
done

echo Copying files onto server
scp *.html carpasinivores@198.245.54.228:/var/www/carpasinivores/doc
