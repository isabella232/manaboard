import { BigInt } from "@graphprotocol/graph-ts";
import { days } from "../data/days";
import { VoteSummary } from "../entities/schema";
import { CastVote } from "../entities/Voting/Voting";
import { getLatest } from "./getLatest";

export function handleVote(event: CastVote): void {
  let ONE = BigInt.fromI32(1);
  let last = getLatest();
  last.votes = last.votes.plus(ONE);

  let summary = getDailySummary(event.block.timestamp, last.votes!);
  summary.votes = summary.votes.plus(ONE);

  summary.save();
  last.save();
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

export function getDailySummary(
  timestamp: BigInt,
  accumulated: BigInt
): VoteSummary {
  let ZERO = BigInt.fromI32(0);
  let day = BigInt.fromI32(
    getStart(timestamp.toI32() as i64, 0 as i32, days.length as i32) as i32
  );
  let id = "vot-" + day.toString();
  let summary = VoteSummary.load(id);
  if (summary == null) {
    summary = new VoteSummary(id);
    summary.votes = ZERO;
    summary.accumulated = accumulated;
    summary.timestamp = day;
  } else {
    if (summary.votes == null) {
      summary.votes = ZERO;
    }
    if (summary.accumulated == null) {
      summary.accumulated = accumulated;
    }
  }
  return summary! as VoteSummary;
}
