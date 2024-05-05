FROM public.ecr.aws/sam/build-ruby3.3:latest-x86_64

WORKDIR /var/task

RUN dnf install -y postgresql15 libpq-devel
RUN gem update bundler
CMD ["bash", "make_layer.sh"]
