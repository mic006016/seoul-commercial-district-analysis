import React from "react"
import { ResponsiveBar } from "@nivo/bar"
import { ResponsiveLine } from "@nivo/line"

// 랭크별 색상
const RANK_COLORS = {
  1: "#ff8a80",
  2: "#fff59d",
  3: "#90caf9",
}

const formatCurrencyCompact = (v) =>
  new Intl.NumberFormat("ko-KR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(v))

const formatCurrency = (v) => new Intl.NumberFormat("ko-KR").format(Number(v))

const formatPercent = (v) => (Number(v) * 100).toFixed(1) + "%"

// 1. 자치구 점포당 매출 TOP3
export function StatusSalesBar({ apiData }) {
  if (!apiData || !Array.isArray(apiData.sales_per_store_top3)) return null

  const data = apiData.sales_per_store_top3.map((item) => ({
    gu: item.gu,
    value: item.value,
    gu_sales: item.gu_sales,
    gu_stores: item.gu_stores,
    rank: item.rank,
  }))

  const UnitNote = ({ innerWidth }) => (
    <g>
      <text
        x={innerWidth - 4}
        y={-6}
        textAnchor="end"
        fontSize={10}
        fontWeight={500}
        fill="#666"
        pointerEvents="none"
      >
        (단위: 원)
      </text>
    </g>
  )

  return (
    <ResponsiveBar
      data={data}
      keys={["value"]}
      indexBy="gu"
      margin={{ top: 20, right: 10, bottom: 40, left: 80 }}
      padding={0.3}
      layout="vertical"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      enableGridY={true}
      gridYValues={5}
      axisBottom={{ tickRotation: 0 }}
      axisLeft={{
        tickValues: 4,
        format: (v) => formatCurrencyCompact(v),
      }}
      colors={({ data }) => RANK_COLORS[data.rank] || "#b0bec5"}
      borderRadius={3}
      labelSkipWidth={40}
      labelSkipHeight={14}
      label={(d) => formatCurrencyCompact(d.value)}
      theme={{
        axis: { ticks: { text: { fontWeight: 400 } } },
        labels: { text: { fontWeight: 700 } },
      }}
      layers={["grid", "axes", "bars", "markers", "legends", UnitNote]}
      tooltip={({ data }) => (
        <div
          style={{
            padding: "6px 8px",
            background: "#222",
            color: "#fff",
            fontSize: 12,
            borderRadius: 4,
          }}
        >
          <div>
            <strong>
              {data.rank}위 · {data.gu}
            </strong>
          </div>
          <div>
            점포당 매출: <strong>{formatCurrency(data.value)}</strong>
          </div>
          <div>총 매출: {formatCurrency(data.gu_sales ?? 0)}</div>
          <div>점포 수: {formatCurrency(data.gu_stores ?? 0)}</div>
        </div>
      )}
    />
  )
}

// 2. TOP3 자치구 매출 추이(5분기) – y축: 매출 / tooltip: 성장률(QoQ)
export function StatusGrowthLine({ apiData }) {
  if (!apiData || !Array.isArray(apiData.sales_growth_top3)) return null

  const safeNum = (v) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  }

  const formatGrowth = (g) => (g === null ? "N/A" : formatPercent(g))

  // 매출 라인 데이터
  const lineData = apiData.sales_growth_top3.map((item) => {
    const points = [
      { x: "20234", y: safeNum(item.sales_20234) },
      { x: "20241", y: safeNum(item.sales_20241) },
      { x: "20242", y: safeNum(item.sales_20242) },
      { x: "20243", y: safeNum(item.sales_20243) },
      { x: "20244", y: safeNum(item.sales_20244) },
    ].filter((d) => d.y !== null)

    return { id: item.gu, rank: item.rank, data: points }
  })

  const EndLabels = ({ series }) => (
    <g>
      {series.map((s) => {
        const last = s.data[s.data.length - 1]
        if (!last) return null
        return (
          <text
            key={s.id}
            x={last.position.x + 8}
            y={last.position.y + 4}
            fill={s.color}
            fontSize={11}
            fontWeight={600}
            pointerEvents="none"
          >
            {s.id}
          </text>
        )
      })}
    </g>
  )
  const UnitNote = ({ innerWidth }) => (
    <g>
      <text
        x={innerWidth - 4}
        y={-6}
        textAnchor="end"
        fontSize={10}
        fontWeight={500}
        fill="#666"
        pointerEvents="none"
      >
        (단위: 원)
      </text>
    </g>
  )

  return (
    <ResponsiveLine
      data={lineData}
      colors={(serie) => RANK_COLORS[serie.rank] || "#90caf9"}
      margin={{ top: 20, right: 70, bottom: 40, left: 70 }}
      xScale={{ type: "point" }}
      yScale={{ type: "linear", min: "auto", max: "auto" }}
      // y축은 매출
      axisLeft={{
        tickValues: 4,
        format: (v) => formatCurrencyCompact(v),
      }}
      enableGridY={true}
      gridYValues={5}
      pointSize={6}
      pointBorderWidth={1}
      legends={[]}
      useMesh={true}
      isInteractive={true}
      tooltip={(input) => {
        const point = input?.point ?? input
        if (!point) return null

        const gu = String(
          point.serieId ?? point.serie?.id ?? point.seriesId ?? point.id ?? ""
        )
        const q = String(point.data?.x ?? point.data?.xFormatted ?? "")

        const serie = lineData.find((s) => String(s.id) === gu)

        let growth = null

        if (serie) {
          const idx = serie.data.findIndex((p) => String(p.x) === q)
          if (idx > 0) {
            const curr = Number(serie.data[idx]?.y)
            const prev = Number(serie.data[idx - 1]?.y)
            if (Number.isFinite(curr) && Number.isFinite(prev) && prev !== 0) {
              growth = (curr - prev) / prev
            }
          }
        }

        return (
          <div
            style={{
              padding: "4px 6px",
              background: "#222",
              color: "#fff",
              fontSize: 12,
              borderRadius: 4,
              lineHeight: 1.2,
              minWidth: 100,
              textAlign: "left",
              whiteSpace: "nowrap",
            }}
          >
            <div style={{ fontWeight: 600 }}>{gu}</div>
            <div>
              {q} 성장률: <strong>{formatGrowth(growth)}</strong>
            </div>
          </div>
        )
      }}
      layers={[
        "grid",
        "markers",
        "axes",
        "lines",
        "points",
        EndLabels,
        UnitNote,
        "mesh",
      ]}
    />
  )
}

// 3. 자치구 일 평균 유동인구 TOP3
export function StatusFpInfographic({ apiData }) {
  if (!apiData || !Array.isArray(apiData.float_pop_top3)) return null

  const list = apiData.float_pop_top3
  const maxVal = Math.max(...list.map((item) => item.value || 0), 1)

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        width: "100%",
        height: "100%",
        alignItems: "flex-end",
        justifyContent: "space-between",
      }}
    >
      {list.map((item) => {
        const ratio = (item.value || 0) / maxVal
        const size = 10 + ratio * 60 // 40~70px
        const rank = item.rank
        const color = RANK_COLORS[rank] || "#90caf9"

        return (
          <div
            key={item.gu}
            style={{
              flex: 1,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 6,
            }}
          >
            <div
              style={{
                width: size,
                height: size * 2.5,
                borderRadius: size,
                background: color,
                opacity: 0.9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              }}
            >
              <span
                style={{
                  fontSize: size * 0.7,
                }}
              >
                🧍
              </span>
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                marginTop: 4,
              }}
            >
              {rank}위 · {item.gu}
            </div>
            <div style={{ fontSize: 11, color: "#555" }}>
              <strong>{formatCurrency(item.value ?? 0)}</strong> 명
            </div>
          </div>
        )
      })}
    </div>
  )
}
