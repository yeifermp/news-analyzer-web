FROM node:14

WORKDIR /app

COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli

COPY . /app

CMD ng serve --host 0.0.0.0