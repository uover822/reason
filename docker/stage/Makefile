build :
	mkdir -p app/data
	mkdir -p app/srv
	cp -r ../../../reason/reason.js app
	cp -r ../../../reason/srv/*.js app/srv
	docker build -t msr-reason:1 .
	docker build -t msr-reason-prod:1 -f Dockerfile-prod .

clean :
	rm *~

.PHONY : build clean
