import { env, envTLD } from "dcl-ops-lib/domain";
import { buildStatic } from "dcl-ops-lib/buildStatic";
import { globalConfig } from "dcl-ops-lib/values";

const { defaultSecurityGroupName } = globalConfig[env]

async function main() {
  const site = buildStatic({
    domain: `manaboard.decentraland.${envTLD}`
  });

  return {
    cloudfrontDistribution: site.cloudfrontDistribution,
    bucketName: site.contentBucket,
  };
}
export = main;
