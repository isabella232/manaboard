import { BigInt } from "@graphprotocol/graph-ts";
import { Mint, Burn } from "../entities/ManaToken/ManaToken";
import { Latest } from "../entities/schema";

export function getLatest(): Latest {
  let latest = Latest.load("0x01");
  if (latest == null) {
    let newLatest = new Latest("0x01");
    newLatest.burned = BigInt.fromI32(0);
    newLatest.supply = BigInt.fromI32(0);
    return newLatest;
  } else {
    if (latest.burned == null) {
      latest.burned = BigInt.fromI32(0);
    }
    if (latest.supply == null) {
      latest.supply = BigInt.fromI32(0);
    }
    return latest as Latest;
  }
}
export function handleMint(event: Mint): void {
  let last = getLatest();
  last.supply = last.supply.plus(event.params.amount);
  last.save();
}

export function handleBurn(event: Burn): void {
  let last = getLatest();
  last.burned = last.burned.plus(event.params.value);
  last.supply = last.supply.minus(event.params.value);
  last.save();
}
