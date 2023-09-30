## Getting Start

run command `npm install`

create `.env` file in root with following contents:

```shell
    PORT = < your_port >
    JWT_SECRET = < your_secret >

    USER = < database_user >
    HOST = < database_host >
    DATABASE = < database_name >
    PASSWORD = < database_password >

    GOOGLE_CLIENT_ID = < your_client_id >
    GOOGLE_CLIENT_SECRET = < your_secret >
```

run command `node .\utils\seeders.js` to seed admin into database

run command `npm start` to start the project

all you needed apis in the `./public/JobHunter.postman_collection.json` file

You can login as admin with username 'admin' and password 'admin'
