import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Repository } from "aws-cdk-lib/aws-ecr";
import { Construct } from "constructs";

export class CdkEcrStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const ecrRepository = new Repository(this, "Repository", {
      repositoryName: "my-ruby-app",
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteImages: true,
    });
  }
}
