import { Stack, StackProps } from "aws-cdk-lib";
import { Repository } from "aws-cdk-lib/aws-codecommit";
import { Construct } from "constructs";

export class CdkCodesStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);

      // CodeCommitを作成する
      const repository = new Repository(this, "Repository", {
        repositoryName: "MyRepository",
      });
    }
}
