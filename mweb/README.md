# plus mobile web application

This is a container of each micro service, Follow this dicector, you will see:

- client: this is for client render that using redux, reactjs, react-router...etc
- server: this have two mission, one is server render with client director, and another is get api data that using soap, rest and thrift
- public: this is public folder setting by express in server/server.js, and the bundle js will export in this
- config: setting of this project
- logs: access and error of this project, it setting by express in config/app.js

## Install module
```bash
$ npm install
```

## Run dev in all os
```bash
$ npm run dev
```

## Run server in all os
```bash
$ npm start
```

## build bundle file
```bash
$ npm build
```

if webpack watcher is not work, please run this command
```bash
$ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

## csscomb
How to run csscomb
```bash
npm install . 
npm install csscomb -g
csscomb -c .csscomb.json client/ 
```

