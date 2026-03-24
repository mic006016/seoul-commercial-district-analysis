import { ResponsiveBar } from "@nivo/bar"

export default function FloatPopChart({ guStats }) {
  const fp = guStats?.floating_pop_gender
  if (!fp) return <SmallHint text="구를 클릭하면 유동인구 비율을 불러옵니다." />

  const male = fp.fp_male ?? 0
  const female = fp.fp_female ?? 0
  const denom = male + female

  const data = [
    {
      key: "gender",
      male: denom ? (male / denom) * 100 : 0,
      female: denom ? (female / denom) * 100 : 0,
    },
  ]

  return (
    <div>
      <div style={{ height: 70 }}>
        <ResponsiveBar
          data={data}
          keys={["male", "female"]}
          indexBy="key"
          layout="horizontal"
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          padding={0.35}
          colors={({ id }) => (id === "male" ? "#ffe574ff" : "#ffccb8ff")}
          enableGridX={false}
          enableGridY={false}
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          axisLeft={null}
          labelSkipWidth={999}
          labelSkipHeight={999}
          tooltip={({ id, value }) => (
            <div style={tipStyle}>
              <div style={{ fontWeight: 700 }}>
                {id === "male" ? "🙋‍♂️ 남" : "🙋‍♀️ 여"}
              </div>
              <div>{value.toFixed(1)}%</div>
            </div>
          )}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
        }}
      >
        <span>
          🙋‍♂️ 남 {denom ? ((male / denom) * 100).toFixed(1) : "0.0"}% (
          {male.toLocaleString()}명)
        </span>
        <span>
          🙋‍♀️ 여 {denom ? ((female / denom) * 100).toFixed(1) : "0.0"}% (
          {female.toLocaleString()}명)
        </span>
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
