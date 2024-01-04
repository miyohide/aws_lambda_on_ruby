import { Stack, StackProps } from "aws-cdk-lib";
import {
  Cache,
  LinuxBuildImage,
  LocalCacheMode,
  Project,
  Source,
} from "aws-cdk-lib/aws-codebuild";
import { Repository } from "aws-cdk-lib/aws-codecommit";
import { Construct } from "constructs";

export class CdkCodesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

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
        }
      },
      logging: {
        cloudWatch: { enabled: true },
      },
    });
  }
}
