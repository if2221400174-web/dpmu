#!/bin/bash
# Membuka gerbang Nginx agar menerima file hingga 50 Megabyte
echo "client_max_body_size 50M;" > /etc/nginx/conf.d/upload_limit.conf

# Me-restart Nginx agar aturan baru berlaku
service nginx reload
