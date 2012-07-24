test=`pwd|xargs echo|sed 's/^.*\/\([^\/][^\/]*\)$/\1/'`
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
if [ "$test" != "tools" ]
  then
  echo 'Ran from the wrong dir ! cd-ing into the script dir'
  cd $DIR
  echo `pwd`
fi


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
  cat ../doc/header.html ../release/$base_.html ../doc/footer.html > ../release/$base.html
  rm ../release/$base_.html
  rm ../release/$base_.md
done

echo Copying files to release dir
cp ../sources/*.html ../sources/*.js ../release
cp ../doc/*.png ../release
cp -r ../sources/bootstrap ../release

echo Copying documentation and sources onto server
scp -r ../release carpasinivores@198.245.54.228:/var/www/carpasinivores
scp -r ../index.html carpasinivores@198.245.54.228:/var/www/carpasinivores/index.html
