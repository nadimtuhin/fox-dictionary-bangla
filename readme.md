## Fox Dictionary: FirefoxOS/Android/iOS GRE Dictionary

Have not tested with android/ios, because I have none. I would appreciate if you taste and report bugs on it.

## Screenshots
![Alt text](/screenshot1.png?raw=true)
![Alt text](/screenshot2.png?raw=true)


### Start Hacking (*nix workflow)

##### pre-requites (if you dont have them)
```sh
sudo apt-get install nodejs
sudo npm install -g ionic
sudo npm install -g cordova
sudo npm install -g bower
sudo npm install -g gulp
```
##### after you are setup lets build
```sh
npm install
bower install
ionic serve
gulp
```

#### build for your desired os

##### Android
```sh
ionic platform add android
ionic build
```
the apk file is in platform/android/build

##### firefoxos
```sh
ionic platform add firefoxos
ionic build
```
the installable package is in platform/firefoxos/build

### Intended features:
- word games
- add pictures to words
- comment the codebase
- flash cards

### Contribute:
help me to make this app awesome. send me pull requests