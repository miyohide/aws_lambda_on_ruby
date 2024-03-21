# これは何か

AWS LambdaをRubyで実装したものです。

- [docker_version](./docker_version/)
  - コンテナイメージ版です
- [non_docker_version](./non_docker_version/)
  - ソースコード版です

# non_docker_version版

ソースコード版の動かし方は以下の通り。

- `docker build -t ruby-lambda-layer .`
- `docker run --rm -it -v $PWD:/var/task ruby-lambda-layer`
- `aws lambda publish-layer-version --layer-name <LAYER名> --zip-file fileb://layer.zip --compatible-runtimes ruby3.2 --compatible-architectures x86_64`
