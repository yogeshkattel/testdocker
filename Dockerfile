FROM node:alpine
RUN mkdir -p /home/app 
COPY ./authentication /home/app
WORKDIR /home/app
RUN npm install 
CMD [ "npm", "start" ]
EXPOSE 5434