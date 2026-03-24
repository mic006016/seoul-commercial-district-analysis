import IndustryChart from "./Charts/IndustryChart"
import FloatPopChart from "./Charts/FloatPopChart"
import OpenCloseRatio from "./Charts/OpenCloseRatio"

export function GuInfoPanel({ guInfo, guStats }) {
  if (!guInfo) {
    return (
      <div style={{ padding: "1rem" }}>
        <h2>자치구 현황</h2>
        <p>지도를 클릭하면 해당 구 정보를 보여드립니다.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ marginBottom: "0.25rem" }}>{guInfo.name}</h2>

      {guInfo.summary && (
        <p
          style={{
            marginTop: "0.5rem",
            color: "#444",
            textAlign: "center",
            fontSize: "0.9rem",
          }}
        >
          {guInfo.summary}
        </p>
      )}

      {/* ---- 차트 영역 ---- */}
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <Section title="업종 비율 (Top 10 + 기타)">
          <IndustryChart guStats={guStats} />
        </Section>

        <Section title="유동인구 남/여 비율">
          <FloatPopChart guStats={guStats} />
        </Section>

        <Section title="개·폐업율 (가중 평균)">
          <OpenCloseRatio guStats={guStats} />
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
        {title}
      </div>
      {children}
    </div>
  )
}
