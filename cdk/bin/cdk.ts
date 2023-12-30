#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';
import { CdkEcrStack } from '../lib/cdk_ecr-stack';

const app = new cdk.App();
new CdkEcrStack(app, 'ECRStack', {});
new CdkStack(app, 'CdkStack', {});
