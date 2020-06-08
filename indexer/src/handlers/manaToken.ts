import { BigInt } from "@graphprotocol/graph-ts";
import { Mint, Burn, Transfer } from "../entities/ManaToken/ManaToken";
import { Latest, TimeSummary } from "../entities/schema";
import { days } from "../data/days";
import { getLatest } from "./getLatest";

let bidBurner = "0x0fcf114c63a5387878e0da051c81cb6febd93b6c";
let marketBurner = "0xadfeb1de7876fcabeaf87df5a6c566b70f970018";

export function handleMint(event: Mint): void {
  let last = getLatest();
  last.supply = last.supply.plus(event.params.amount);
  last.save();
}

export function handleTransfer(event: Transfer): void {
  let address = event.params.to.toHex();
  if (address === marketBurner || address === bidBurner) {
    let last = getLatest();
    last.burned = last.burned.plus(event.params.value);
    last.supply = last.supply.minus(event.params.value);

    let summary = getDailySummary(event.block.timestamp);
    summary.burned = summary.burned.plus(event.params.value);

    summary.save();
    last.save();
  }
}

export function handleBurn(event: Burn): void {
  let last = getLatest();
  let address = event.params.burner.toHex();
  if (address !== marketBurner && address !== bidBurner) {
    last.burned = last.burned.plus(event.params.value);
    last.supply = last.supply.minus(event.params.value);

    let summary = getDailySummary(event.block.timestamp);
    summary.burned = summary.burned.plus(event.params.value);

    summary.save();
    last.save();
  }
}

function getStart(time: i64, from: i32, to: i32): i64 {
  let middle = (from + to) / 2;
  if (to - from <= 1) {
    return days[from];
  }
  if (days[middle] < time) {
    return getStart(time, middle, to);
  } else {
    return getStart(time, from, middle);
  }
}

export function getDailySummary(timestamp: BigInt): TimeSummary {
  let day = BigInt.fromI32(
    getStart(timestamp.toI32() as i64, 0 as i32, days.length as i32) as i32
  );
  let id = "day-" + day.toString();
  let summary = TimeSummary.load(id);
  if (summary == null) {
    summary = new TimeSummary(id);
    let latest = getLatest();
    summary.burned = BigInt.fromI32(0);
    summary.timestamp = day;
  } else {
    if (summary.burned == null) {
      summary.burned = BigInt.fromI32(0);
    }
  }
  return summary!;
}
