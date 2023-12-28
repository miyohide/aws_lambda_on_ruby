import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { Repository } from "aws-cdk-lib/aws-ecr";
import { DockerImageCode, DockerImageFunction } from "aws-cdk-lib/aws-lambda";

export class CdkLambdaStack extends Stack {
    constructor(scope: Stack, id: string, props?: StackProps) {
        super(scope, id, props);

        // VPCの作成
        const vpc = new Vpc(this, "MyVPC", {
            enableDnsHostnames: true,
            enableDnsSupport: true,
            maxAzs: 2,
            natGateways: 1,
            subnetConfiguration: [
                {
                    name: "PublicSubnet",
                    subnetType: SubnetType.PUBLIC,
                    cidrMask: 24,
                    mapPublicIpOnLaunch: true,
                },
                {
                    name: "PrivateSubnet",
                    subnetType: SubnetType.PRIVATE_WITH_EGRESS,
                    cidrMask: 24,
                },
                {
                    name: "DBSubnet",
                    subnetType: SubnetType.PRIVATE_ISOLATED,
                    cidrMask: 24,
                }
            ]
        });

        // const repository = Repository.fromRepositoryName(this, "Repository", "my-ruby-app");
        // // CDKでDockerイメージを使ったLambda関数を作成する
        // new DockerImageFunction(this, "LambdaFunction", {
        //     code: DockerImageCode.fromEcr(repository, { tag: "latest" }),
        //     timeout: Duration.seconds(30),
        // });
    }
}
