import { BigInt } from "@graphprotocol/graph-ts";
import { Latest } from "../entities/schema";
export function getLatest(): Latest {
    let latest = Latest.load("0x01");
    if (latest == null) {
        let newLatest = new Latest("0x01");
        newLatest.burned = BigInt.fromI32(0);
        newLatest.supply = BigInt.fromI32(0);
        newLatest.votes = BigInt.fromI32(0);
        return newLatest;
    }
    else {
        if (latest.burned == null) {
            latest.burned = BigInt.fromI32(0);
        }
        if (latest.supply == null) {
            latest.supply = BigInt.fromI32(0);
        }
        if (latest.votes == null) {
            latest.votes = BigInt.fromI32(0);
        }
        return latest as Latest;
    }
}
