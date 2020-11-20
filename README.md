# Boord

> Boord - Get On Board

_Disclaimer: this project is still in development, feel very free to try it out and open issues, but you might run in some unknown problems_

Open-source Kanban/Scrum board, with the option to create multiple rows of columns 🤯

- Self hosted
- Columns **and** rows
- Like-Trello: multiple boards, cards, assign to card, ~~card comments~~

## Why?

Having worked quite a bit with Trello there has always been the desire to work with multiple teams in one board, or to work with one team on multiple subprojects. This open-source variant enables listing all those subprojects as rows in one scrum board.

Initially build to support the development of museum exhibits, where one team works on a bunch of installations. Having 15 Trello boards wasn't an option, and 1 Trello board for all 15 subprojects didn't work either. This solved that use case.

## Future plans

- Comments
- Attachements
- An easy way to track Scrum points and visualize those

## Tech

- NodeJS
- Mongo
- NuxtJS
- Websockets
- Docker

## Dev Setup

### Docker

``` bash
# Start a development Docker container
$ /bin/sh ./dev.sh
```

### Other

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev
```
