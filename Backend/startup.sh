#!/bin/bash
echo "client_max_body_size 50M;" > /etc/nginx/conf.d/upload_limit.conf
service nginx reload
