import { ScopedAws, Stack, StackProps } from "aws-cdk-lib";
import { LinuxBuildImage, Project, Source } from "aws-cdk-lib/aws-codebuild";
import { Repository } from "aws-cdk-lib/aws-codecommit";
import { Construct } from "constructs";

export class CdkCodesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const { accountId, region } = new ScopedAws(this);

    // CodeCommitを作成する
    const repository = new Repository(this, "Repository", {
      repositoryName: "MyRepository",
    });

    // CodeBuildを作成する
    new Project(this, "MyCodeBuildProject", {
      source: Source.codeCommit({ repository }),
      environment: {
        buildImage: LinuxBuildImage.STANDARD_7_0,
        privileged: true,
      },
      environmentVariables: {
        IMAGE_REPO_NAME: {
          value: "my-ruby-app",
        },
        IMAGE_TAG: {
          value: "latest",
        },
        AWS_ACCOUNTID: {
          value: accountId,
        },
      },
      logging: {
        cloudWatch: { enabled: true },
      },
    });
  }
}
