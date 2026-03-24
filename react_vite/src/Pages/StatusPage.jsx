import { useEffect, useState } from "react"
import styled from "@emotion/styled"
import { LinearProgress } from "@mui/material"
import {
  StatusSalesBar,
  StatusGrowthLine,
  StatusFpInfographic,
} from "../Components/StatusChart"

import { SeoulMap } from "../Components/SeoulMap"
import { GuInfoPanel } from "../Components/GuInfoPanel"

const API = import.meta.env.VITE_API_URL || "http://localhost:8000"

export default function StatusPage() {
  const [statusData, setStatusData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedGu, setSelectedGu] = useState(null)
  const [guInfo, setGuInfo] = useState(null)
  const [guStats, setGuStats] = useState(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API}/status?yqc=20244`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setStatusData(json)
      } catch (e) {
        setError(e.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [])

  useEffect(() => {
    if (!selectedGu) return

    Promise.all([
      fetch(`${API}/status_map/gu_info/${selectedGu.code}`).then((r) =>
        r.json()
      ),
      fetch(
        `${API}/status_map/gu_stats?gu_name=${encodeURIComponent(
          selectedGu.name
        )}&yqc=20244`
      ).then((r) => r.json()),
    ])
      .then(([info, stats]) => {
        setGuInfo({
          ...info,
          code: selectedGu.code,
          name: info?.name ?? selectedGu.name,
        })
        setGuStats(stats)
      })
      .catch(() => {
        setGuInfo({
          code: selectedGu.code,
          name: selectedGu.name,
          summary: "구 정보가 아직 등록되지 않았어요.",
        })
        setGuStats(null)
      })
  }, [selectedGu])

  if (loading) {
    return (
      <Container>
        <LoadingOverlay>
          <LoadingBox>
            <p>서울 상권 현황을 불러오는 중입니다...</p>
            <LinearProgress />
          </LoadingBox>
        </LoadingOverlay>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <PageHeader>
          <PageTitle>서울 상권 현황</PageTitle>
          <PageSubTitle>데이터 로딩 중 오류가 발생했습니다.</PageSubTitle>
        </PageHeader>
        <SectionWrap>
          <ErrorBox>{error}</ErrorBox>
        </SectionWrap>
      </Container>
    )
  }

  if (!statusData) {
    return (
      <Container>
        <PageHeader>
          <PageTitle>서울 상권 현황</PageTitle>
        </PageHeader>
        <SectionWrap>
          <ErrorBox>데이터가 없습니다.</ErrorBox>
        </SectionWrap>
      </Container>
    )
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>서울 상권 현황</PageTitle>
        <PageSubTitle />
      </PageHeader>

      <SectionWrap>
        <SectionTitle>서울시 지도</SectionTitle>
        <SectionDesc>
          지도를 클릭하면 자치구 정보를 확인할 수 있습니다.
        </SectionDesc>

        <MapRow>
          <MapCard>
            <MapBox>
              <SeoulMap onSelectGu={setSelectedGu} />
            </MapBox>
          </MapCard>

          <PanelCard>
            <PanelInner>
              <GuInfoPanel guInfo={guInfo} guStats={guStats} />
            </PanelInner>
          </PanelCard>
        </MapRow>
      </SectionWrap>

      <SectionWrap>
        <SectionTitle>자치구 TOP 3 인사이트</SectionTitle>
        <SectionDesc>
          최근 분기 데이터를 기반으로 점포당 매출, 매출 추이, 일 평균 유동인구
          기준 상위 3개 자치구를 한눈에 볼 수 있습니다.
        </SectionDesc>

        <ChartRow>
          <ChartCard>
            <CardTitle>점포당 매출 TOP 3</CardTitle>
            <CardSub>
              같은 자치구 내 행정동의 매출과 점포 수를 합산한{" "}
              <strong>점포당 평균 매출</strong> 기준입니다.
            </CardSub>
            <ChartBox>
              <StatusSalesBar apiData={statusData} />
            </ChartBox>
          </ChartCard>

          <ChartCard>
            <CardTitle>매출 추이 & 성장률 TOP 3</CardTitle>
            <CardSub>
              최근 1년(5개 분기) 매출 추이와{" "}
              <strong>연평균 성장률(CAGR)</strong>이 높은 자치구입니다.
            </CardSub>
            <ChartBox>
              <StatusGrowthLine apiData={statusData} />
            </ChartBox>
          </ChartCard>

          <ChartCard>
            <CardTitle>일 평균 유동인구 TOP 3</CardTitle>
            <CardSub>
              분기 유동인구 총합을 일 단위로 환산해{" "}
              <strong>일 평균 유동인구</strong>가 높은 자치구입니다.
            </CardSub>
            <ChartBox>
              <StatusFpInfographic apiData={statusData} />
            </ChartBox>
          </ChartCard>
        </ChartRow>
      </SectionWrap>

      <CommentWrap>
        <CmtTitle>
          <h6>Notice</h6>
        </CmtTitle>
        <CmtContent>
          <CmtBox>
            본 페이지에서 제공되는 상권 정보는 통계 자료를 바탕으로 한
            참고용입니다. 실제 상권 상황과 차이가 발생할 수 있으며, 이를 근거로
            한 투자 및 영업 활동의 결과에 대해서는 책임을 지지 않습니다.
          </CmtBox>
        </CmtContent>
      </CommentWrap>
    </Container>
  )
}

/* ===== 스타일 ===== */

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f9f9f9;
`

const PageHeader = styled.div`
  padding: 2em 2em 1em 2em;
`

const PageTitle = styled.h1`
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 0.3em;
`

const PageSubTitle = styled.p`
  font-size: 0.9em;
  color: #666;
`

const SectionWrap = styled.div`
  padding: 1.5em 2em 2em 2em;
`

const SectionTitle = styled.h2`
  font-size: 1.4em;
  font-weight: 600;
  margin-bottom: 0.4em;
`

const SectionDesc = styled.p`
  font-size: 0.9em;
  color: #555;
  margin-bottom: 1em;
`

const MapRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: stretch;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`

const MapCard = styled.div`
  flex: 2;
  min-width: 0px;
  background: #fff;
  border-radius: 12px;
  padding: 14px 16px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`

const MapBox = styled.div`
  width: 100%;
  height: 560px;
`

const PanelCard = styled.div`
  flex: 1;
  min-width: 0px;
  background: #fff;
  border-radius: 12px;
  padding: 14px 16px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`

const PanelInner = styled.div`
  height: 520px;
  overflow-y: auto;
`

const ChartRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: stretch;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`

const ChartCard = styled.div`
  flex: 1;
  min-width: 0px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 14px 16px 16px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`

const CardTitle = styled.div`
  font-size: 1em;
  font-weight: 600;
  margin-bottom: 0.25em;
`

const CardSub = styled.div`
  font-size: 0.8em;
  color: #777;
  margin-bottom: 0.75em;
`

const ChartBox = styled.div`
  width: 100%;
  height: 240px;
  min-height: 240px;
  min-width: 0;
  position: relative;
`

const ErrorBox = styled.div`
  padding: 1.5em;
  border-radius: 8px;
  background-color: #ffe5e5;
  color: #b00020;
  font-size: 0.9em;
`

const CommentWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1em;
  margin-bottom: 2em;
`

const CmtTitle = styled.div`
  font-size: 1.2em;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
`

const CmtContent = styled.div`
  width: 100%;
`

const CmtBox = styled.div`
  width: 80%;
  background-color: #e3f2fd;
  font-size: 0.75em;
  color: #333;
  padding: 1em;
  border-radius: 10px;
  margin: auto;
  margin-bottom: 2em;
  text-align: center;
`

const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`

const LoadingBox = styled.div`
  width: 60%;
  max-width: 400px;
  padding: 1.5em 2em;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  text-align: center;
  font-size: 0.9rem;
`
