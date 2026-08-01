FROM nginx:alpine

# hapus config default
RUN rm /etc/nginx/conf.d/default.conf

# copy config nginx kamu
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# copy hasil build frontend
COPY dist /usr/share/nginx/html

