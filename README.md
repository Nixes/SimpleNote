# SimpleNote
This project attempts to be a simple note manager in the same vain as Google Keep. This was my first project utilising an infinite but on demand content loading system based on ajax.

Please Note: This project in not production ready, feel free to use for personal use where all users are known and trusted.

To allow running without the to be released common-login system remove the include `__DIR__.'../../user_validate.php' `, from both the index.php and noteQuery.php. Instead use a http login specificed in a htaccess file for now.

### Requirements: 
This project requires PHP and MySQL on the server side, and a modern browser with javascript enabled for the client.
