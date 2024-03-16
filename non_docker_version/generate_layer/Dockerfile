FROM public.ecr.aws/sam/build-ruby3.2:latest-x86_64

WORKDIR /var/task

RUN amazon-linux-extras install -y postgresql14
RUN yum -y install postgresql-devel postgresql
RUN gem update bundler
CMD ["bash", "make_layer.sh"]
