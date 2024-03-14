FROM public.ecr.aws/sam/build-ruby3.2:latest-x86_64

WORKDIR /var/task

RUN yum -y install postgresql-devel
RUN gem update bundler
CMD ["bash", "make_layer.sh"]
