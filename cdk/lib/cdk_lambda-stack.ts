import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Repository } from "aws-cdk-lib/aws-ecr";
import { DockerImageCode, DockerImageFunction } from "aws-cdk-lib/aws-lambda";

export class CdkLambdaStack extends Stack {
    // Lambda関数を生成する
    constructor(scope: Stack, id: string, props?: StackProps) {
        super(scope, id, props);

        const repository = Repository.fromRepositoryName(this, "Repository", "my-ruby-app");
        // CDKでDockerイメージを使ったLambda関数を作成する
        new DockerImageFunction(this, "LambdaFunction", {
            code: DockerImageCode.fromEcr(repository, { tag: "latest" }),
            timeout: Duration.seconds(30),
        });
    }
}
