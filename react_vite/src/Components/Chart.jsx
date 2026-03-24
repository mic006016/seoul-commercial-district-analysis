import { ResponsiveBar } from "@nivo/bar"
import { ResponsiveLine } from "@nivo/line"
import { ResponsiveRadar } from "@nivo/radar"

function SalesBar({ data }) {
  if (!data || data.length === 0) {
    return <div>표시할 데이터가 없습니다.</div>
  }

  const weekdayKeys = [
    "qs_mon",
    "qs_tue",
    "qs_wed",
    "qs_thu",
    "qs_fri",
    "qs_sat",
    "qs_sun",
  ]

  const weekdayLabels = {
    qs_mon: "월",
    qs_tue: "화",
    qs_wed: "수",
    qs_thu: "목",
    qs_fri: "금",
    qs_sat: "토",
    qs_sun: "일",
  }

  // 특정 컬럼만 만원 단위로 변환
  const convertToManWonForKeys = (rows, keys) => {
    return rows.map((row) => {
      const updated = { ...row }

      keys.forEach((key) => {
        if (updated[key] != null) {
          updated[key] = Math.round(updated[key] / 10000)
        }
      })

      return updated
    })
  }

  // 1) 요일별 금액을 만원 단위로 변환
  const converted = convertToManWonForKeys(data, weekdayKeys)

  // 2) 각 분기별 합계 필드(totalManWon) 추가
  const chartData = converted.map((row) => {
    const totalManWon = weekdayKeys.reduce(
      (sum, key) => sum + (row[key] ?? 0),
      0
    )

    return {
      ...row,
      totalManWon, // ✅ 이 값으로 합계 라벨 찍음
    }
  })

  // 3) 스택 맨 위(= 마지막 키) 막대 위에만 합계 라벨 찍기
  const lastKey = weekdayKeys[weekdayKeys.length - 1] // "qs_sun"

  const TotalLabelLayer = ({ bars }) => {
    return (
      <>
        {bars
          .filter((bar) => bar.data.id === lastKey) // ✅ 분기당 1개씩만 선택
          .map((bar) => {
            const { indexValue, x, y, width, data: barData } = bar
            const total = barData.data.totalManWon

            return (
              <text
                key={indexValue}
                x={x + width / 2}
                y={y - 4}
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontSize: 11, fontWeight: 600 }}
              >
                {total.toLocaleString()}
              </text>
            )
          })}
      </>
    )
  }

  return (
    <div style={{ width: "100%", height: 420 }}>
      <ResponsiveBar
        data={chartData}
        keys={weekdayKeys} // ✅ 요일별 스택 유지
        indexBy="yqc_code"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        groupMode="stacked"
        axisBottom={{
          legend: "분기",
          legendOffset: 32,
          legendPosition: "middle",
        }}
        axisLeft={{
          legend: "매출 (단위: 만원)",
          legendOffset: -50,
          legendPosition: "middle",
        }}
        // ✅ 각 segment 위의 기본 라벨은 끔 (요일별 숫자는 안 보이게)
        label={() => null}
        labelSkipWidth={12}
        labelSkipHeight={12}
        // ✅ 툴팁은 요일별 금액 그대로
        tooltip={({ id, value, color, indexValue }) => (
          <div
            style={{
              padding: "4px 8px",
              background: "white",
              border: "1px solid #ccc",
            }}
          >
            <div>
              <strong>{indexValue}</strong>
            </div>
            <div style={{ color }}>
              {weekdayLabels[id] ?? id}: {value.toLocaleString()} 만원
            </div>
          </div>
        )}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            translateX: 120,
            itemsSpacing: 3,
            itemWidth: 80,
            itemHeight: 18,
            itemDirection: "left-to-right",
            symbolSize: 14,
            label: (legend) => weekdayLabels[legend.id] ?? legend.id,
          },
        ]}
        // ✅ 커스텀 레이어 추가 (bars 위에 합계)
        layers={["grid", "axes", "bars", TotalLabelLayer, "markers", "legends"]}
      />
    </div>
  )
}

function FpLine({ data }) {
  if (!data || data.length === 0) {
    return <div>표시할 데이터가 없습니다.</div>
  }
  const lineData = [
    {
      id: "male",
      data: data.map((item) => ({
        x: item.yqc_code,
        y: item.fp_male,
      })),
    },
    {
      id: "female",
      data: data.map((item) => ({
        x: item.yqc_code,
        y: item.fp_female,
      })),
    },
    {
      id: "total",
      data: data.map((item) => ({
        x: item.yqc_code,
        y: item.fp_total,
      })),
    },
  ]

  return (
    <div style={{ width: "100%", height: 420 }}>
      <ResponsiveLine
        data={lineData}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        axisBottom={{
          legend: "분기",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          legend: "유동인구",
          legendOffset: -55,
          legendPosition: "middle",
        }}
        pointSize={8}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            translateX: 100,
            itemWidth: 80,
            itemHeight: 22,
            symbolShape: "circle",
          },
        ]}
      />
    </div>
  )
}

function AgeRadar({ data }) {
  const lastItem = data[data.length - 1]

  const radarData = [
    { ages: "10대", total: lastItem.fp_age10 },
    { ages: "20대", total: lastItem.fp_age20 },
    { ages: "30대", total: lastItem.fp_age30 },
    { ages: "40대", total: lastItem.fp_age40 },
    { ages: "50대", total: lastItem.fp_age50 },
    { ages: "60대", total: lastItem.fp_age60 },
  ]

  return (
    <div style={{ height: 420, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <ResponsiveRadar
          data={radarData}
          keys={["total"]}
          indexBy="ages"
          margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
          gridLabelOffset={24}
          dotSize={6}
          dotColor={{ theme: "background" }}
          dotBorderWidth={2}
          blendMode="multiply"
          legends={[]}
        />
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: 8,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        연령대별 유동인구 분포 (최근 분기)
      </div>
    </div>
  )
}

function TimeSales({ data }) {
  const timeKeys = [
    "t_00_06",
    "t_06_11",
    "t_11_14",
    "t_14_17",
    "t_17_21",
    "t_21_24",
  ]

  const transformed = data.map((row) => ({
    id: row.yqc_code, // ← 여기서 id = yqc_code
    data: timeKeys.map((key) => ({
      x: key, // x = t_00_06, t_06_11...
      y: Number(row[key]) / 10000, // y = 해당 값 (숫자로 변환)
    })),
  }))

  return (
    <div style={{ width: "100%", height: 420 }}>
      <ResponsiveLine
        data={transformed}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        axisBottom={{ legend: "시간대별 매출", legendOffset: 36 }}
        axisLeft={{ legend: "매출(단위: 만원)", legendOffset: -50 }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "seriesColor" }}
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            translateX: 100,
            itemWidth: 80,
            itemHeight: 22,
            symbolShape: "circle",
          },
        ]}
      />
    </div>
  )
}

function AgeSaleRadar({ data }) {
  const lastItem = data[data.length - 1]

  const radarData = [
    { ages: "10대", total: lastItem.ags_age10 },
    { ages: "20대", total: lastItem.ags_age20 },
    { ages: "30대", total: lastItem.ags_age30 },
    { ages: "40대", total: lastItem.ags_age40 },
    { ages: "50대", total: lastItem.ags_age50 },
    { ages: "60대", total: lastItem.ags_age60 },
  ]

  return (
    <div style={{ height: 420, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <ResponsiveRadar
          data={radarData}
          keys={["total"]}
          indexBy="ages"
          margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
          gridLabelOffset={24}
          dotSize={6}
          dotColor={{ theme: "background" }}
          dotBorderWidth={2}
          blendMode="multiply"
          legends={[]}
        />
      </div>
      <div
        style={{
          textAlign: "center",
          marginTop: 8,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        연령대별 매출 분포 (최근 분기)
      </div>
    </div>
  )
}

export { SalesBar, FpLine, AgeRadar, TimeSales, AgeSaleRadar }
