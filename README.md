# AI-Online-Assignment-Plagiraism-System
MTI 2021 Graduation Project.

## How to install
* Install Docker via [Docker Docs](https://docs.docker.com/get-docker/)
* Clone this project 
* Navigate to the project home.
* Create a `.env` file and provide the follwoing environment variables:
	```bash
	OAPSEMAIL=<YOUR EMAIL GOES HERE>
	OAPSPASSWORD=<YOUR PASSWORD GOES HERE>
	```
	Those credentials are for any google mail ( [gmail](https://mail.google.com) ) account used for sending email confirmations and reports.
	
	For the official credentials for the OAPS email please contact the [project maintainer](https://github.com/N05h3ll).
* Navigate to the project home through your `(Terminal for mac, linux users)` or `(Powershell for windows users)`
* Install dependencies and run the project:
	```bash
	docker-compose up
	```
	You can read more about [Docker Compose](https://docs.docker.com/compose/reference/up/) for various installation and running options.

 *`Project installation and running may take up to 20 minutes according to your network speed`*

 *`Please Note that the project is memory  'RAM' intensive it may use up to 16gb of memory to load the models. This is only a temporarly issue and will be optimized in future updates.`* 

The project now is running in your device navigate to ``` http://127.0.0.1:8080 ``` or ``` http://localhost:8080 ``` .

### For any bug report or issues please open a new [Github Issue](https://github.com/N05h3ll/AI-Online-Assignment-Plagiarism-System/issues).
<br/>

### If you are a contributor please don't hesitate to implement new features and resolve existing bugs. Just make your own branch or fork from the project and open a new [Pull Request](https://github.com/N05h3ll/AI-Online-Assignment-Plagiarism-System/pulls).