import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CdkEcrStack } from '../lib/cdk_ecr-stack';

test('ECRが1つ作成されること', () => {
  const app = new cdk.App();
  const stack = new CdkEcrStack(app, 'ECRStack');
  const template = Template.fromStack(stack);

  // 作成されるECRの数を確認する
  template.resourceCountIs('AWS::ECR::Repository', 1);
  // 作成されるECRがもつCloudFormationのPropertiesを確認する
  template.hasResourceProperties('AWS::ECR::Repository', {
    RepositoryName: 'my-ruby-app',
    EmptyOnDelete: true,  // 中身があった場合でも削除する
  });
  // 作成されるECRのProperties以外の値を確認する
  template.hasResource('AWS::ECR::Repository', {
    DeletionPolicy: 'Delete', // スタック削除時にECRも削除する
  });
});
