#
# Usual commands 
#

pull :
#	update from the repository
	git pull

push :
#	commit onto the repository
	git commit -a -m 'commited from makefile' ; git push


publish :
#	publish on the web site
	./publish.sh

clean :
#	clean local files
	./clean.sh
	git status


#install :
# In the parent directory we had to run : git clone git@github.com:guillaumematheron/carpasinivores
