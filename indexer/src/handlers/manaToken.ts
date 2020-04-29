import { BigInt } from "@graphprotocol/graph-ts";
import { Mint, Burn } from "../entities/ManaToken/ManaToken";
import { TimeSummary, Latest } from "../entities/schema";

type Granularity = string;
type MaybeLatest = Latest | null;

let latest: MaybeLatest;
export function getLatest(): Latest {
  if (latest == null) {
    latest = Latest.load("latest");
    if (latest == null) {
      latest = new Latest("latest");
      latest.burned = BigInt.fromI32(0);
      latest.save();
    }
  }
  return latest as Latest;
}
export function handleMint(event: Mint): void {
  let last = getLatest();

  last.supply = last.supply.plus(event.params.amount);

  last.save();
}

export function handleBurn(event: Burn): void {
  let last = getLatest();
  last.supply = last.supply.minus(event.params.value);
  last.burned = last.burned.plus(event.params.value);
  last.save();
}
