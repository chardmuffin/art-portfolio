# Serve React app using Nginx
FROM nginx:stable-alpine
COPY ./build /usr/share/nginx/html

# Copy Nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]