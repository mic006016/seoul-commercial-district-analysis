export default function OpenCloseRatio({ guStats }) {
  const oc = guStats?.open_close_rate
  if (!oc) return <SmallHint text="구를 클릭하면 개·폐업율을 불러옵니다." />

  // DB 값이 0~1인지, 0~100인지 애매할 수 있어서 방어(둘 다 대응)
  const toPct = (v) => {
    const x = Number(v || 0)
    return x <= 1 ? x * 100 : x
  }

  const openPct = toPct(oc.open_rate)
  const closePct = toPct(oc.close_rate)
  const net = openPct - closePct

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Row label="🟢 개업율" value={`${openPct.toFixed(2)}%`} pct={openPct} />
      <Row label="🔴 폐업율" value={`${closePct.toFixed(2)}%`} pct={closePct} />
      <div style={{ fontSize: 12, color: "#555" }}>
        📈 순증(개업-폐업): <b>{net.toFixed(2)}%</b>
      </div>
    </div>
  )
}

function Row({ label, value, pct }) {
  // bar는 너무 길게 꽉 차는 걸 방지(시각용). 0~10% 구간에서 보기 좋게 스케일링.
  const width = Math.max(0, Math.min(100, (pct / 10) * 100))

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
        }}
      >
        <span>{label}</span>
        <b>{value}</b>
      </div>
      <div
        style={{
          height: 6,
          background: "#eee",
          borderRadius: 999,
          overflow: "hidden",
          marginTop: 6,
        }}
      >
        <div
          style={{ height: "100%", width: `${width}%`, background: "#90caf9" }}
        />
      </div>
      <div style={{ fontSize: 11, color: "#777", marginTop: 4 }}>
        (시각화 스케일: 10% = 100% bar)
      </div>
    </div>
  )
}

function SmallHint({ text }) {
  return <div style={{ fontSize: 12, color: "#777" }}>{text}</div>
}
