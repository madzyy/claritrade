from pathlib import Path

ltp = Path(__file__).resolve().parents[1] / "app/dashboard/_components/log-trade/ltp-model.tsx"
lines = ltp.read_text(encoding="utf-8").splitlines(keepends=True)
body = "".join(lines[257:1170])
for a, b in [
    ("formData.ltpIofChecks", "core.iofChecks"),
    ("formData.ltpIof", "core.iof"),
    ("formData.poiHigh", "core.klPrice"),
    ("formData.poiLow", "core.klLow"),
    ("formData.htfKlType", "core.klType"),
    ("formData.htfKlJob", "core.klJob"),
    ("formData.htfKlPath", "core.klPath"),
    ("formData.htfKlContext", "core.klContext"),
    ("formData.htfKlClose", "core.klClose"),
    ("formData.candlePath", "core.candlePath"),
    ("formData.candleFormation", "core.candleFormation"),
    ("formData.candleEntry", "core.candleEntry"),
    ("formData.candleEnd", "core.candleEnd"),
    ("formData.dealingHigh", "core.dealingHigh"),
    ("formData.dealingLow", "core.dealingLow"),
    ("formData.dealingFormation", "core.dealingFormation"),
    ("formData.dealingJobs", "core.dealingJobs"),
    ("formData.dealingDelivery", "core.dealingDelivery"),
    ("formData.ltfIntoKl", "core.ltfIntoKl"),
    ("formData.klRangePair", "core.klRangePair"),
    ("formData.rangeBuild", "core.rangeBuild"),
    ("formData.rangeTfTools", "core.rangeTfTools"),
    ("formData.consolPath", "core.consolPath"),
    ("formData.oneCandleConsol", "core.oneCandleConsol"),
    ("formData.swingHigh", "core.swingHigh"),
    ("formData.swingLow", "core.swingLow"),
    ("formData.closeSignatures", "core.closeSignatures"),
    ("formData.closeContext", "core.closeContext"),
    ("handleChange(", "setField("),
    ("toggleList(", "toggleField("),
]:
    body = body.replace(a, b)

body = body.replace(
    """setFormData((prev) => ({
                              ...prev,
                              ltpIof: prev.ltpIof === side.id ? "" : side.id,
                              ltpIofChecks: [],
                            }))""",
    """patch({
                              iof: core.iof === side.id ? "" : side.id,
                              iofChecks: [],
                            })""",
)
body = body.replace(
    """setFormData((prev) => ({
                              ...prev,
                              dealingFormation: next,
                              dealingDelivery: next ? formation.delivery : "",
                            }))""",
    """patch({
                              dealingFormation: next,
                              dealingDelivery: next ? formation.delivery : "",
                            })""",
)
body = body.replace(
    """setFormData((prev) => ({
                              ...prev,
                              klRangePair: next,
                              purgeStack: next
                                ? purgeStackForPair(next)
                                : prev.purgeStack,
                            }))""",
    """patch({ klRangePair: next })""",
)

marker = '<div className="flex flex-col gap-2 border-t border-border pt-3">'
parts = body.split(marker)
ids = ["anatomy", "iof", "pd", "kl", "range", "closures"]
if len(parts) != 7:
    print("unexpected parts", len(parts))
else:
    rebuilt = parts[0]
    for cid, chunk in zip(ids, parts[1:]):
        rebuilt += (
            f'{{active.includes("{cid}") ? (\n'
            + marker
            + chunk
            + ") : null}\n"
        )
    body = rebuilt

out = Path(__file__).resolve().parents[1] / "app/dashboard/_components/log-trade/_core-body.tsx"
out.write_text(body, encoding="utf-8")
print("wrote", len(body))
