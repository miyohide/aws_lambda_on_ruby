import * as cdk from 'aws-cdk-lib';
import { AmazonLinuxImage, Instance, InstanceClass, InstanceSize, InstanceType, Port, SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { Code, Handler, Runtime, Function } from 'aws-cdk-lib/aws-lambda';
import { DatabaseInstance, DatabaseInstanceEngine, SubnetGroup } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
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

    // // EC2用のセキュリティグループを作成する
    // const ec2SecurityGroup = new SecurityGroup(this, "EC2SecurityGroup", {
    //   vpc: vpc,
    //   description: "EC2 Security Group",
    // });

    // // Databaseマネジメント用のEC2インスタンスを作成する
    // const machineImage = new AmazonLinuxImage();
    // const ec2Instance = new Instance(this, "ec2Instance", {
    //   vpc: vpc,
    //   instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
    //   machineImage: machineImage,
    //   vpcSubnets: {
    //     subnetType: SubnetType.PRIVATE_WITH_EGRESS,
    //   },
    //   securityGroup: ec2SecurityGroup,
    // })

    // ECRのリポジトリを指定する
    const repository = Repository.fromRepositoryName(this, "MyRepository", "my-ruby-app");

    // Lambda用のセキュリティグループを作成する
    const lambdaSecurityGroup = new SecurityGroup(this, "LambdaSecurityGroup", {
      vpc: vpc,
      description: "Lambda Security Group",
      allowAllOutbound: true,
    });

    // ECRにあるコンテナイメージを利用してLambda関数を作成する
    const lambda = new Function(this, "Lambda", {
      code: Code.fromEcrImage(repository, {
        tag: "latest",
      }),
      functionName: "my-ruby-app",
      runtime: Runtime.FROM_IMAGE,
      handler: Handler.FROM_IMAGE,
      timeout: cdk.Duration.seconds(30),
      vpc: vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [lambdaSecurityGroup],
    });

    // RDS用のセキュリティグループの作成
    const rdsSecurityGroup = new SecurityGroup(this, "RDSSecurityGroup", {
      vpc: vpc,
      description: "RDS Security Group",
      allowAllOutbound: true,
    });

    const dbSubnetGroup = new SubnetGroup(this, "MyDBSubnetGroup", {
      vpc: vpc,
      description: "My DB Subnet Group",
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED,
        onePerAz: true,
      }
    });

    // RDSインスタンスの作成と設定を行う。今回はPostgreSQLを使用しているため、
    // DatabaseInstanceEngine.POSTGRESを指定する。
    const rdsInstance = new DatabaseInstance(this, "MyRDSInstance", {
      engine: DatabaseInstanceEngine.POSTGRES,
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      vpc: vpc,
      databaseName: "mypostgresdb",
      multiAz: false,
      subnetGroup: dbSubnetGroup,
      securityGroups: [rdsSecurityGroup],
    });

    // rdsInstance.connections.allowDefaultPortFrom(ec2Instance, "EC2 to RDS");
    rdsInstance.connections.allowDefaultPortFrom(lambda, "Lambda to RDS");
  }
}
