R:

	Rscript -e "rmarkdown::render('data/2015-09-23_mcas-districts.Rmd')"
	open data/2015-09-23_mcas-districts.html

R_deploy:

	cp data/2015-09-23_mcas-districts.html /Volumes/www_html/multimedia/graphics/projectFiles/Rmd/
	rsync -rv data/2015-09-23_mcas-districts_files /Volumes/www_html/multimedia/graphics/projectFiles/Rmd
	open http://private.boston.com/multimedia/graphics/projectFiles/Rmd/2015-09-23_mcas-districts.html

all:

	cd data; node index.js;
