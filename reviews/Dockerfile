FROM public.ecr.aws/nginx/nginx:latest

ARG envType
COPY dist /usr/share/nginx/html
COPY nginx_${envType}.conf /etc/nginx/conf.d/default.conf
