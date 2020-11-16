import { envTLD } from "dcl-ops-lib/domain";
import { buildStatic } from "dcl-ops-lib/buildStatic";

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
