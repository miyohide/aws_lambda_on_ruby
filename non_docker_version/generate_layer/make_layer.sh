bundle config --local silence_root_warning true
bundle config set clean true
bundle config set path '/var/task'

mkdir -p /var/task/lib

cp -a /usr/lib64/libpq.so.5.5 /var/task/lib/libpq.so.5
cp -a /usr/lib64/liblber-2.4.so.2.10.7 /var/task/lib/liblber-2.4.so.2
cp -a /usr/lib64/libldap_r-2.4.so.2.10.7 /var/task/lib/libldap_r-2.4.so.2
cp -a /usr/lib64/libsasl2.so.3.0.0 /var/task/lib/libsasl2.so.3
cp -a /usr/lib64/libssl.so.1.0.2k /var/task/lib/libssl.so.10

cd /var/task
zip -r layer.zip .
