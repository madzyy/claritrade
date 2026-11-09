from pathlib import Path
p = Path(__file__).resolve().parents[1] / "app/dashboard/_components/log-trade/ltp-model.tsx"
lines = p.read_text(encoding="utf-8").splitlines(keepends=True)
ins = '                  <CoreConcepts perspective="LTP" />\n'
# 0-index: keep 0..256, skip 257..1169, keep 1170+
out = lines[:257] + [ins] + lines[1170:]
p.write_text("".join(out), encoding="utf-8")
print("new line count", len(out))
