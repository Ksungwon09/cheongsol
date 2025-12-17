# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source
COPY . .

# [추가됨] 이미지 업로드 폴더 생성
RUN mkdir -p uploads

# Your app binds to port 3001
EXPOSE 3001

# Command to run your app
CMD [ "npm", "start" ]
