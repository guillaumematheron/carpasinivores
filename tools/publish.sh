for file in `ls ../doc/*.md`
  do
  echo Converting file $file
  base=`basename $file .md`
  base_=`echo $base`_

  #Copy each file into release dir
  cat ../doc/$file >> ../release/$base_.md
  
  #Patch for accentuated characters
  ./fr2html.sh ../release/$base_.md

  #Convert links
  ./convertLinks.sh ../release/$base_.md

  #Convert to HTML using markdown
  markdown ../release/$base_.md>../release/$base_.html

  #Wrap in html
  cat ../doc/headerHTML ../release/$base_.html ../doc/footerHTML > ../release/$base.html
  rm ../release/$base_.html
  rm ../release/$base_.md
done

echo Copying files to release dir
cp ../sources/*.html ../sources/*.js ../release
cp ../doc/*.png ../release

exit

echo Copying documentation and sources onto server
cp *.png *.html *.js *.xml release
scp -r release carpasinivores@198.245.54.228:/var/www/carpasinivores
scp -r index_.html carpasinivores@198.245.54.228:/var/www/carpasinivores/index.html

