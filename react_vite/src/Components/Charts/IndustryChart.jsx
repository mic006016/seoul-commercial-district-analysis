import { ResponsivePie } from "@nivo/pie"

export default function IndustryChart({ guStats }) {
  const industry = guStats?.industry_ratio
  const total = industry?.total_store_cnt ?? 0

  if (!industry) {
    return <SmallHint text="구를 클릭하면 업종 비율을 불러옵니다." />
  }

  // 범례/색상 직접 색 지정
  const COLORS = [
    "#66c2a5",
    "#fc8d62",
    "#8da0cb",
    "#e78ac3",
    "#a6d854",
    "#ffd92f",
    "#e5c494",
    "#b3b3b3",
    "#8dd3c7",
    "#fb8072",
    "#cfd8dc", // 기타
  ]

  const data = [
    ...(industry.top10 || []).map((x, idx) => ({
      id: x.name,
      label: x.name,
      value: x.cnt,
      color: COLORS[idx % (COLORS.length - 1)], // 기타 색 제외하고 순환
    })),
    ...(industry.others_cnt > 0
      ? [
          {
            id: "기타",
            label: "기타",
            value: industry.others_cnt,
            color: COLORS[COLORS.length - 1],
          },
        ]
      : []),
  ]

  if (!data.length) return <SmallHint text="업종 데이터가 없습니다." />

  return (
    <div>
      {/* 차트 영역(legends를 SVG에서 제거해서 잘림 방지) */}
      <div style={{ height: 210 }}>
        <ResponsivePie
          data={data}
          margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
          innerRadius={0.62}
          padAngle={1}
          cornerRadius={4}
          activeOuterRadiusOffset={6}
          enableArcLabels={false}
          enableArcLinkLabels={false}
          legends={[]} // 내장 범례 제거(잘림 방지)
          colors={({ data }) => data.color} // 지정 색 사용
          tooltip={({ datum }) => (
            <div style={tipStyle}>
              <div style={{ fontWeight: 700 }}>{datum.label}</div>
              <div>{Number(datum.value).toLocaleString()}개</div>
            </div>
          )}
          layers={[
            "arcs",
            // 가운데 텍스트
            ({ centerX, centerY }) => (
              <g>
                <text
                  x={centerX}
                  y={centerY - 4}
                  textAnchor="middle"
                  style={{ fontSize: 12, fill: "#666" }}
                >
                  총 점포수
                </text>
                <text
                  x={centerX}
                  y={centerY + 14}
                  textAnchor="middle"
                  style={{ fontSize: 18, fontWeight: 800 }}
                >
                  {total.toLocaleString()}
                </text>
              </g>
            ),
          ]}
        />
      </div>

      {/* HTML 범례: 자동 줄바꿈 + 안 잘림 */}
      <div
        style={{
          marginTop: 12,
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "center",
          fontSize: 12,
          lineHeight: 1.2,
        }}
      >
        {data.map((d) => (
          <div
            key={d.id}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: d.color,
                display: "inline-block",
              }}
            />
            <span style={{ whiteSpace: "nowrap" }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SmallHint({ text }) {
  return <div style={{ fontSize: 12, color: "#777" }}>{text}</div>
}

const tipStyle = {
  background: "white",
  padding: "8px 10px",
  border: "1px solid #eee",
  borderRadius: 8,
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
}
