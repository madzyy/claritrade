"use client"

import { useLogTrade } from "./form-context"
import { InstitutionalSponsorship } from "./sponsorship"
import { RangeLiquidityPanel } from "./range-liquidity"
import { RangePanel } from "./range-panel"
import { DealingRangePanel } from "./dealing-range"
import { DeferredDeliveryPanel } from "./deferred-delivery"
import { StructurePoolsPanel } from "./structure-pools"
import { RelativeEqualsPanel } from "./relative-equals"
import { OpeningGapsPanel } from "./opening-gaps"
import { IpdaProfilePanel } from "./ipda-profile"
import { MmxmPanel } from "./mmxm-panel"

export function OptionalStack() {
  const { logTab } = useLogTrade()
  return (
    <section className="flex flex-col gap-3">
      <InstitutionalSponsorship perspective={logTab} />
      <RangeLiquidityPanel perspective={logTab} />
      <RangePanel perspective={logTab} />
      <DealingRangePanel perspective={logTab} />
      <DeferredDeliveryPanel perspective={logTab} />
      <StructurePoolsPanel perspective={logTab} />
      <RelativeEqualsPanel perspective={logTab} />
      <OpeningGapsPanel perspective={logTab} />
      <IpdaProfilePanel perspective={logTab} />
      <MmxmPanel perspective={logTab} />
    </section>
  )
}
