# SimpleNote
This project attempts to be a simple note manager in the same vain as Google Keep. This was my first project utilising an infinite but on demand content loading system based on ajax.

To allow running without the to be released common-login system remove the include `__DIR__.'../../user_validate.php' `, from both the index.php and noteQuery.php. Instead use a http login specificed in a htaccess file for now.

## Installation:
```
composer install
cd client
yarn install
```

if using ngnix add below to the location block
```ngnix
if (!-e $request_filename){
    rewrite ^(.*)$ /api.php break;
}
```


## Running backend server:
```
composer start
```
## Running frontend server:
```
yarn start
```

### Requirements: 
This project requires PHP and MySQL on the server side, and a modern browser with javascript enabled for the client.
Also requires composer to install slim (the microframework used for the API)

## API

Routes are relative to the main file like ``api.php/notes/{noteId}``