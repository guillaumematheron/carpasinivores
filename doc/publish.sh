for file in `ls *.md`
  do
  cp $file `basename $file .md`_.md
  ./fr2html.sh `basename $file .md`_.md
  markdown `basename $file .md`_.md>`basename $file .md`.html
  rm `basename $file .md`_.md
done

scp *.html carpasinivores@198.245.54.228:/var/www/carpasinivores/doc
