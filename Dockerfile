FROM public.ecr.aws/lambda/ruby:3.2 as builder

RUN yum install -y amazon-linux-extras && \
    amazon-linux-extras enable postgresql14 && \
    yum group install "Development Tools" -y

RUN yum install -y postgresql-devel

# Copy Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ${LAMBDA_TASK_ROOT}/

# Install the specified gems
RUN bundle config set --local path 'vendor/bundle' && \
    bundle install

FROM public.ecr.aws/lambda/ruby:3.2

RUN yum install -y amazon-linux-extras && \
    amazon-linux-extras enable postgresql14 && \
    yum install -y postgresql-devel

COPY --from=builder ${LAMBDA_TASK_ROOT}/vendor/bundle ${LAMBDA_TASK_ROOT}/vendor/bundle
COPY --from=builder ${LAMBDA_TASK_ROOT}/Gemfile ${LAMBDA_TASK_ROOT}/Gemfile.lock ${LAMBDA_TASK_ROOT}/

# Copy function code
COPY lambda_function.rb ${LAMBDA_TASK_ROOT}/

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "lambda_function.LambdaFunction::Handler.process" ]
