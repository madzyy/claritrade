                  {active.includes("anatomy") ? (
<div className="flex flex-col gap-2 border-t border-border pt-3">
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      Candle anatomy · W1 / MN
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Read OHLC or OLHC. Classic bodies, one-sided reversal
                      wicks, or both-sided chop. Avoid consolidation. There is a
                      trade at the open, at mid expansion, or at the end once HC
                      or LC is in.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {CANDLE_PATHS.map((path) => (
                        <button
                          key={path.id}
                          type="button"
                          title={path.description}
                          onClick={() =>
                            setField(
                              "candlePath",
                              core.candlePath === path.id ? "" : path.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            core.candlePath === path.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {path.label}
                        </button>
                      ))}
                    </div>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      {core.candlePath === "OHLC"
                        ? "High first, then low. Bearish path."
                        : core.candlePath === "OLHC"
                          ? "Low first, then high. Bullish path."
                          : "OHLC seeks the high first. OLHC seeks the low first."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {CANDLE_FORMATIONS.map((formation) => {
                        const active = core.candleFormation === formation.id
                        return (
                          <button
                            key={formation.id}
                            type="button"
                            title={formation.description}
                            onClick={() => {
                              const next =
                                core.candleFormation === formation.id
                                  ? ""
                                  : formation.id
                              setField("candleFormation", next)
                              const nextBias = next ? formationBias(next) : null
                              if (nextBias) setBias(nextBias)
                            }}
                            className={cn(
                              "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                              active
                                ? formation.id === "CONSOLIDATION"
                                  ? "border-[#DC2626] bg-[#DC2626] text-white"
                                  : "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                                : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            )}
                          >
                            {formation.label}
                          </button>
                        )
                      })}
                    </div>
                    {core.candleFormation === "CONSOLIDATION" ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#DC2626]">
                        Both-sided wicks. Sideways. Do not take a bias from this
                        candle.
                      </p>
                    ) : core.candleFormation === "BULLISH_REVERSAL" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Started heavily bearish, then reversed — usually after a
                        key level. Bottom wick.
                      </p>
                    ) : core.candleFormation === "BEARISH_REVERSAL" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Started heavily bullish, then reversed later. Top wick.
                      </p>
                    ) : core.candleFormation.startsWith("CLASSIC") ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Full body. Mostly body, little wick.
                      </p>
                    ) : null}
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      Where in the candle
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {CANDLE_ENTRIES.map((entry) => (
                        <button
                          key={entry.id}
                          type="button"
                          title={entry.description}
                          onClick={() =>
                            setField(
                              "candleEntry",
                              core.candleEntry === entry.id ? "" : entry.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            core.candleEntry === entry.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {entry.label}
                        </button>
                      ))}
                    </div>
                    {core.candleEntry === "END" ? (
                      <div className="flex flex-wrap gap-2">
                        {CANDLE_ENDS.map((end) => (
                          <button
                            key={end.id}
                            type="button"
                            title={end.description}
                            onClick={() =>
                              setField(
                                "candleEnd",
                                core.candleEnd === end.id ? "" : end.id
                              )
                            }
                            className={cn(
                              "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                              core.candleEnd === end.id
                                ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                                : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            )}
                          >
                            {end.label}
                          </button>
                        ))}
                      </div>
                    ) : core.candleEntry === "OPEN" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Buy below the open. Sell above it.
                      </p>
                    ) : core.candleEntry === "MID_EXPANSION" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Middle of the range, while price is expanding — not
                        chopping.
                      </p>
                    ) : null}
                  </div>
                  ) : null}
{active.includes("iof") ? (
<div className="flex flex-col gap-2 border-t border-border pt-3">
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      HTF IOF
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Trend is your friend until proven otherwise. Probe IOF,
                      then blend it with candle anatomy, the HTF key level, and
                      premium / discount.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {LTP_IOF_SIDES.map((side) => (
                        <button
                          key={side.id}
                          type="button"
                          title={side.description}
                          onClick={() => {
                            patch({
                              iof: core.iof === side.id ? "" : side.id,
                              iofChecks: [],
                            })
                          }}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            core.iof === side.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {side.label}
                        </button>
                      ))}
                    </div>
                    {core.iof
                      ? ltpIofSignatures(core.iof).map((check) => {
                          const active = core.iofChecks.includes(
                            check.id
                          )
                          return (
                            <button
                              key={check.id}
                              type="button"
                              title={check.description}
                              onClick={() =>
                                toggleField("ltpIofChecks", check.id)
                              }
                              className={cn(
                                "flex items-start gap-3 rounded-lg border px-3 py-2 text-left transition-all",
                                active
                                  ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                                  : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                              )}
                            >
                              <span className="text-[10px] font-black tabular-nums opacity-70">
                                {check.n}
                              </span>
                              <span className="flex-1">
                                <span className="block text-[11px] font-bold">
                                  {check.label}
                                </span>
                                <span
                                  className={cn(
                                    "block text-[10px] leading-relaxed",
                                    active
                                      ? "text-blue-100"
                                      : "text-muted-foreground"
                                  )}
                                >
                                  {check.description}
                                </span>
                              </span>
                            </button>
                          )
                        })
                      : null}
                    {core.iof
                      ? LTP_IOF_CONFIRM.map((check) => {
                          const active = core.iofChecks.includes(
                            check.id
                          )
                          return (
                            <button
                              key={check.id}
                              type="button"
                              title={check.description}
                              onClick={() =>
                                toggleField("ltpIofChecks", check.id)
                              }
                              className={cn(
                                "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                                active
                                  ? check.id === "INTO_OPPOSING_KL"
                                    ? "border-[#DC2626] bg-[#DC2626] text-white"
                                    : "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                                  : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                              )}
                            >
                              {check.label}
                            </button>
                          )
                        })
                      : null}
                    {core.iof ? (
                      <p
                        className={cn(
                          "text-[10px] leading-relaxed font-semibold",
                          core.iofChecks.includes("INTO_OPPOSING_KL")
                            ? "text-[#DC2626]"
                            : iofCore
                              ? "text-[#2563EB]"
                              : "text-muted-foreground"
                        )}
                      >
                        {core.iofChecks.includes("INTO_OPPOSING_KL")
                          ? "Opposing key level. IOF is proven otherwise only here."
                          : iofCore
                            ? core.iof === "BEARISH"
                              ? "All three. Bearish until price trades into an opposing key level."
                              : "All three. Bullish until price trades into an opposing key level."
                            : "Need all three signatures before you call HTF IOF."}
                      </p>
                    ) : null}
                    {core.iof &&
                    anatomyBias &&
                    anatomyBias !== "RANGE" ? (
                      <p
                        className={cn(
                          "text-[10px] leading-relaxed",
                          (core.iof === "BEARISH" &&
                            anatomyBias === "BEARISH") ||
                            (core.iof === "BULLISH" &&
                              anatomyBias === "BULLISH")
                            ? "font-semibold text-muted-foreground"
                            : "font-semibold text-[#DC2626]"
                        )}
                      >
                        {(core.iof === "BEARISH" &&
                          anatomyBias === "BEARISH") ||
                        (core.iof === "BULLISH" &&
                          anatomyBias === "BULLISH")
                          ? "IOF matches the candle. Blend with the HTF key level and premium / discount."
                          : "IOF does not match candle anatomy. Do not force a bias."}
                      </p>
                    ) : null}
                    {klPd && core.iof ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        {core.iof === "BEARISH"
                          ? klPd === "PREMIUM"
                            ? "HTF KL in premium. That is where bearish IOF sells."
                            : "Bearish IOF still sells from premium, not from discount."
                          : klPd === "DISCOUNT"
                            ? "HTF KL in discount. That is where bullish IOF buys."
                            : "Bullish IOF still buys from discount, not from premium."}
                      </p>
                    ) : null}
                  </div>
                  ) : null}
{active.includes("pd") ? (
<div className="flex flex-col gap-2 border-t border-border pt-3">
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      Premium / discount
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Always buy discount, never buy premium. Always sell
                      premium, never sell discount. The dealing range is both
                      the entry parameter and the draw. Price is always
                      delivering premium to discount or discount to premium.
                      Profile LTF as it walks toward a key level inside that
                      half.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {DEALING_FORMATIONS.map((formation) => (
                        <button
                          key={formation.id}
                          type="button"
                          title={formation.description}
                          onClick={() => {
                            const next =
                              core.dealingFormation === formation.id
                                ? ""
                                : formation.id
                            patch({
                              dealingFormation: next,
                              dealingDelivery: next ? formation.delivery : "",
                            })
                          }}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            core.dealingFormation === formation.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {formation.label}
                        </button>
                      ))}
                    </div>
                    {core.dealingFormation === "HIGH_THEN_LOW" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        High run, then expansion through a swing low. That
                        expansion leg is the bearish range. Split it at 50%.
                      </p>
                    ) : core.dealingFormation === "LOW_THEN_HIGH" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Low run, then expansion through a swing high. That
                        expansion leg is the bullish range. Split it at 50%.
                      </p>
                    ) : null}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                          High
                        </Label>
                        <Input
                          value={core.dealingHigh}
                          onChange={(e) =>
                            setField("dealingHigh", e.target.value)
                          }
                          className="h-9 rounded-lg border-border bg-transparent text-xs font-semibold text-foreground"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                          50%
                        </Label>
                        <div className="flex h-9 items-center rounded-lg border border-border bg-transparent px-2 text-xs font-bold text-[#2563EB] tabular-nums">
                          {dealingMid != null
                            ? dealingMid.toFixed(priceDecimals)
                            : "—"}
                        </div>
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Low
                        </Label>
                        <Input
                          value={core.dealingLow}
                          onChange={(e) =>
                            setField("dealingLow", e.target.value)
                          }
                          className="h-9 rounded-lg border-border bg-transparent text-xs font-semibold text-foreground"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {DEALING_JOBS.map((job) => (
                        <button
                          key={job.id}
                          type="button"
                          title={job.description}
                          onClick={() => toggleField("dealingJobs", job.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            core.dealingJobs.includes(job.id)
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {job.label}
                        </button>
                      ))}
                      {DEALING_DELIVERY.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          onClick={() =>
                            setField(
                              "dealingDelivery",
                              core.dealingDelivery === item.id
                                ? ""
                                : item.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            core.dealingDelivery === item.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setField("ltfIntoKl", !core.ltfIntoKl)
                        }
                        className={cn(
                          "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                          core.ltfIntoKl
                            ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                            : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                      >
                        LTF into KL in P/D
                      </button>
                    </div>
                    {pd ? (
                      <p
                        className={cn(
                          "text-[10px] leading-relaxed font-semibold",
                          (formData.direction === "buy" && pd !== "DISCOUNT") ||
                            (formData.direction === "sell" && pd !== "PREMIUM")
                            ? "text-[#DC2626]"
                            : "text-[#2563EB]"
                        )}
                      >
                        {pd === "EQ"
                          ? "Entry is at 50% — equilibrium, not a side."
                          : formData.direction === "buy"
                            ? pd === "DISCOUNT"
                              ? "Buying discount."
                              : "Buying premium. Never buy high."
                            : pd === "PREMIUM"
                              ? "Selling premium."
                              : "Selling discount. Never sell low."}
                      </p>
                    ) : null}
                    {klPd ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        {klPd === "EQ"
                          ? "HTF KL sits at 50% of the dealing range."
                          : `HTF KL is in ${klPd === "PREMIUM" ? "premium" : "discount"}. Use that array.`}
                      </p>
                    ) : null}
                    {core.iof &&
                    ((core.iof === "BEARISH" &&
                      (pd === "PREMIUM" || klPd === "PREMIUM")) ||
                      (core.iof === "BULLISH" &&
                        (pd === "DISCOUNT" || klPd === "DISCOUNT"))) ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#2563EB]">
                        IOF aligned with premium / discount. Higher probability.
                      </p>
                    ) : core.iof && pd ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#DC2626]">
                        IOF is not aligned with this half of the range.
                      </p>
                    ) : null}
                  </div>
                  ) : null}
{active.includes("kl") ? (
<div className="flex flex-col gap-2 border-t border-border pt-3">
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      HTF key level
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Foundation of price. Every trade is based on an HTF key
                      level — to it (the draw) or from it. Blend with premium /
                      discount. Keep the weekly and monthly up: a daily break of
                      structure is often just a retracement into a weekly FVG.
                      These arrays get supercharged on ITP.
                    </p>
                    <div className="grid gap-1">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Level
                      </Label>
                      <Input
                        value={core.klPrice}
                        onChange={(e) =>
                          setField("poiHigh", e.target.value)
                        }
                        placeholder="Price of the HTF KL"
                        className="h-9 rounded-lg border-border bg-transparent text-xs font-semibold text-foreground"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {HTF_KL_TYPES.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          title={type.description}
                          onClick={() =>
                            setField(
                              "htfKlType",
                              core.klType === type.id ? "" : type.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            core.klType === type.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {type.n}. {type.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {HTF_KL_JOBS.map((job) => (
                        <button
                          key={job.id}
                          type="button"
                          title={job.description}
                          onClick={() =>
                            setField(
                              "htfKlJob",
                              core.klJob === job.id ? "" : job.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            core.klJob === job.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {job.label}
                        </button>
                      ))}
                      {HTF_KL_PATHS.map((path) => (
                        <button
                          key={path.id}
                          type="button"
                          title={path.description}
                          onClick={() =>
                            setField(
                              "htfKlPath",
                              core.klPath === path.id ? "" : path.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            core.klPath === path.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {path.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {HTF_KL_CONTEXT.map((ctx) => (
                        <button
                          key={ctx.id}
                          type="button"
                          title={ctx.description}
                          onClick={() => toggleField("htfKlContext", ctx.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            core.klContext.includes(ctx.id)
                              ? ctx.id === "DAILY_RETRACE"
                                ? "border-[#DC2626] bg-[#DC2626] text-white"
                                : "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {ctx.label}
                        </button>
                      ))}
                    </div>
                    {core.klJob === "TO" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Price is the draw into this key level.
                      </p>
                    ) : core.klJob === "FROM" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Engaging from the key level. Can target lower-timeframe
                        liquidity from here.
                      </p>
                    ) : null}
                    {core.klContext.includes("PD_STACK") ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#2563EB]">
                        PD array on an HTF PD array. Higher probability.
                      </p>
                    ) : null}
                    {core.klContext.includes("DAILY_RETRACE") ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#DC2626]">
                        Daily BOS is weekly FVG. Stay with the HTF narrative and
                        IOF.
                      </p>
                    ) : null}
                  </div>
                  ) : null}
{active.includes("range") ? (
<div className="flex flex-col gap-2 border-t border-border pt-3">
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      Timeframe-aligned range
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Always trading a range on every timeframe. Blend the LTP
                      key level with a lower-TF range. That pairing supercharges
                      the KL. Monthly needs a daily range. Weekly needs H4.
                      Daily needs H1.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {KL_RANGE_PAIRS.map((pair) => (
                        <button
                          key={pair.id}
                          type="button"
                          title={pair.description}
                          onClick={() => {
                            const next =
                              core.klRangePair === pair.id ? "" : pair.id
                            patch({ klRangePair: next })
                          }}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            core.klRangePair === pair.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {pair.label}
                        </button>
                      ))}
                    </div>
                    {core.klRangePair === "MN_D1" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        You need a daily range to trade a monthly key level.
                      </p>
                    ) : core.klRangePair === "W1_H4" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        On H4, as price approaches the weekly KL: is there
                        already a range? If yes, mark high and low, wait for the
                        break above into the KL, then attack the range low. If
                        not, wait for a false high before the KL (inducement).
                      </p>
                    ) : core.klRangePair === "D1_H1" ? (
                      <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                        Daily key level, H1 range. Same process: existing range
                        or inducement first.
                      </p>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                      {RANGE_BUILDS.map((build) => (
                        <button
                          key={build.id}
                          type="button"
                          title={build.description}
                          onClick={() =>
                            setField(
                              "rangeBuild",
                              core.rangeBuild === build.id ? "" : build.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            core.rangeBuild === build.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {build.label}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Range high
                        </Label>
                        <Input
                          value={core.swingHigh}
                          onChange={(e) =>
                            setField("swingHigh", e.target.value)
                          }
                          className="h-9 rounded-lg border-border bg-transparent text-xs font-semibold text-foreground"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                          50%
                        </Label>
                        <div className="flex h-9 items-center rounded-lg border border-border bg-transparent px-2 text-xs font-bold text-[#2563EB] tabular-nums">
                          {rangeMid != null
                            ? rangeMid.toFixed(priceDecimals)
                            : "—"}
                        </div>
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Range low
                        </Label>
                        <Input
                          value={core.swingLow}
                          onChange={(e) =>
                            setField("swingLow", e.target.value)
                          }
                          className="h-9 rounded-lg border-border bg-transparent text-xs font-semibold text-foreground"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {RANGE_TF_TOOLS.map((tool) => (
                        <button
                          key={tool.id}
                          type="button"
                          title={tool.description}
                          onClick={() => toggleField("rangeTfTools", tool.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            core.rangeTfTools.includes(tool.id)
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {tool.label}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setField(
                          "oneCandleConsol",
                          !core.oneCandleConsol
                        )
                      }
                      className={cn(
                        "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                        core.oneCandleConsol
                          ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                          : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      )}
                    >
                      Next candle closed inside (1-candle consolidation)
                    </button>
                    {core.oneCandleConsol ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-muted-foreground">
                        That candle is now consolidation. Only two outcomes:
                        breakout, retest, continuation — or AMD. Never
                        consolidation to consolidation.
                      </p>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                      {CONSOL_PATHS.map((path) => (
                        <button
                          key={path.id}
                          type="button"
                          title={path.description}
                          onClick={() =>
                            setField(
                              "consolPath",
                              core.consolPath === path.id ? "" : path.id
                            )
                          }
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            core.consolPath === path.id
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {path.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  ) : null}
{active.includes("closures") ? (
<div className="flex flex-col gap-2 border-t border-border pt-3">
                    <span className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
                      Candle closures
                    </span>
                    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", !showWhy && "hidden")}>
                      Easiest daily bias. The next candle follows the closure
                      until the draw. Blend with premium / discount and the HTF
                      key level — that is high probability. Wick one side, not
                      both.
                    </p>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Bullish
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {BULLISH_CLOSURES.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          onClick={() => toggleField("closeSignatures", item.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            core.closeSignatures.includes(item.id)
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Bearish
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {BEARISH_CLOSURES.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={item.description}
                          onClick={() => toggleField("closeSignatures", item.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            core.closeSignatures.includes(item.id)
                              ? "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {CLOSURE_CONTEXT.map((ctx) => (
                        <button
                          key={ctx.id}
                          type="button"
                          title={ctx.description}
                          onClick={() => toggleField("closeContext", ctx.id)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all",
                            core.closeContext.includes(ctx.id)
                              ? ctx.id === "USE_CONSOL"
                                ? "border-[#475569] bg-[#334155] text-white dark:border-slate-400 dark:bg-slate-600"
                                : "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {ctx.label}
                        </button>
                      ))}
                    </div>
                    {closeRead === "BULLISH" ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#2563EB]">
                        Bullish closures. Higher prices until a high is taken —
                        usually the end of the candle. At a KL, wick below the
                        previous candle and close above, then expect highs.
                      </p>
                    ) : closeRead === "BEARISH" ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#2563EB]">
                        Bearish closures. Lower prices until a low is taken. At
                        a KL, wick above and close below, then expect lows.
                      </p>
                    ) : closeRead === "MIXED" ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#DC2626]">
                        Mixed closures. One side only. Both sides is
                        consolidation — use the range.
                      </p>
                    ) : null}
                    {core.candleFormation === "CONSOLIDATION" ||
                    core.closeContext.includes("USE_CONSOL") ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-muted-foreground">
                        In consolidation, use the consolidation. Everything else
                        is just consolidation.
                      </p>
                    ) : null}
                    {closeRead &&
                    closeRead !== "MIXED" &&
                    (core.klType || core.klPrice) &&
                    ((closeRead === "BULLISH" &&
                      (pd === "DISCOUNT" || klPd === "DISCOUNT")) ||
                      (closeRead === "BEARISH" &&
                        (pd === "PREMIUM" || klPd === "PREMIUM"))) ? (
                      <p className="text-[10px] leading-relaxed font-semibold text-[#2563EB]">
                        Closures + HTF KL + the right half of the range. High
                        probability.
                      </p>
                    ) : null}
                  </div>
) : null}
