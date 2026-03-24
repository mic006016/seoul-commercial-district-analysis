import {
  SalesBar,
  FpLine,
  AgeRadar,
  AgeSaleRadar,
  TimeSales,
} from "../Components/Chart"
import styled from "@emotion/styled"
import { useResultData } from "../context/ResultDataContext"
import { Table, TableRow, TableCell, LinearProgress } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function ResultPage() {
  const { dbResult, selection, aiResult } = useResultData()
  const navigate = useNavigate()
  const hasRedirected = useRef(false)
  const [showCharts, setShowCharts] = useState(false)

  // selection / result 상태 계산
  const hasSelection =
    selection && selection.gu && selection.dong && selection.category

  const noSelection = !hasSelection

  const hasResult =
    Array.isArray(dbResult) &&
    dbResult.length > 0 &&
    Array.isArray(dbResult[0]) &&
    dbResult[0].length > 0

  const noResult = !hasResult

  // 검색 결과에 따른 리다이렉트 처리
  useEffect(() => {
    if (hasRedirected.current) return

    // 검색 데이터 없는 경우 (직접 /result로 들어온 경우)
    if (noSelection) {
      hasRedirected.current = true

      requestAnimationFrame(() => {
        setTimeout(() => {
          navigate("/", {
            replace: true,
            state: { error: "NO_SELECTION" },
          })
        }, 0)
      })
      return
    }

    // 검색 결과 없는 경우
    if (noResult) {
      hasRedirected.current = true

      requestAnimationFrame(() => {
        setTimeout(() => {
          navigate("/", {
            replace: true,
            state: { error: "NO_RESULT" },
          })
        }, 0)
      })
      return
    }
  }, [noSelection, noResult, navigate])

  // 로딩 오버레이
  useEffect(() => {
    if (noSelection || noResult) return

    const timer = setTimeout(() => {
      setShowCharts(true)
    }, 4000) //

    return () => clearTimeout(timer)
  }, [noSelection, noResult])

  // 렌더링 방어
  if (noSelection || noResult) {
    return null
  }

  const data_qs = dbResult[0] || []
  const data_ags = dbResult[1] || []
  const data_fp = dbResult[2] || []
  const data_ssi = dbResult[3] || []
  const data_cai = dbResult[4] || []
  const data_ts = dbResult[5] || []
  console.log(aiResult)

  const monthAvg = Math.floor(
    data_qs[data_qs.length - 1].qs_sales / 3
  ).toLocaleString()
  const monthAvgMen = Math.floor(
    data_ags[data_ags.length - 1].ags_male / 3
  ).toLocaleString()
  const monthAvgWomen = Math.floor(
    data_ags[data_ags.length - 1].ags_female / 3
  ).toLocaleString()
  const monthAvgPop = Math.floor(
    data_fp[data_fp.length - 1].fp_total / 3
  ).toLocaleString()
  const timeSales = data_ts.slice(-4)
  const ssiCnt = data_ssi[data_ssi.length - 1].ssi_cnt
  const ssiSmrCnt = data_ssi[data_ssi.length - 1].ssi_similar_cnt

  const gu = selection?.gu
  const dong = selection?.dong
  const category = selection?.category
  return (
    <Container>
      {!showCharts && !noSelection && !noResult && (
        <LoadingOverlay>
          <LoadingBox>
            <p>AI가 분석 중입니다...</p>
            <LinearProgress />
          </LoadingBox>
        </LoadingOverlay>
      )}
      {showCharts && (
        <>
          <ResultWrapper>
            <ResultWrap>
              <ResultContent>
                <H2>
                  선택하신
                  <span style={{ color: "#e65100" }}> {gu} </span>
                  <span style={{ color: "#e65100" }}>{dong}</span>의
                  <span style={{ color: "#e65100" }}> {category} </span>업종은
                </H2>
              </ResultContent>
              <ResultTitle>
                <H1>
                  {aiResult?.prediction?.label}
                  <small> 입니다.</small>
                </H1>
              </ResultTitle>
            </ResultWrap>
            <ResultImg>
              <ImgBox>
                <img
                  src="src/imgs/high.png"
                  style={{
                    height: "auto",
                    // objectFit: "cover",
                    // objectPosition: "center",
                  }}
                />
              </ImgBox>
            </ResultImg>
          </ResultWrapper>
          <SectionTitle>
            How it works<p></p>
            <h2>상세 분석 내용</h2>
            <br />
            <p
              dangerouslySetInnerHTML={{
                __html: aiResult?.prediction?.report ?? "",
              }}
            />
          </SectionTitle>

          <SectionWrap>
            <SecTitle>1. 최근 분기 간단 요약</SecTitle>
            <SecBox>
              <UBox>
                <Table>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      🏦 동일업종 수
                    </TableCell>
                    <TableCell>{ssiCnt} 개</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      🏨 유사업종 수
                    </TableCell>
                    <TableCell>{ssiSmrCnt} 개</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      💰 월 평균 매출
                    </TableCell>
                    <TableCell>{monthAvg} 원</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      🚶🏻 월 평균 유동인구
                    </TableCell>
                    <TableCell>{monthAvgPop} 명</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      🙋🏻‍♂️ 월 평균 매출(남)
                    </TableCell>
                    <TableCell>{monthAvgMen} 원</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      🙋🏻‍♀️ 월 평균 매출(여)
                    </TableCell>
                    <TableCell>{monthAvgWomen} 원</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      🚍 버스 정류장
                    </TableCell>
                    <TableCell>
                      {data_cai[data_cai.length - 1].cai_bus_stop} 개
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>🚇 지하철</TableCell>
                    <TableCell>
                      {data_cai[data_cai.length - 1].cai_subway} 개
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      🏤 초등학교
                    </TableCell>
                    <TableCell>
                      {data_cai[data_cai.length - 1].cai_school_ele} 개
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>🏟 중학교</TableCell>
                    <TableCell>
                      {data_cai[data_cai.length - 1].cai_school_mid} 개
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      🏫 고등학교
                    </TableCell>
                    <TableCell>
                      {data_cai[data_cai.length - 1].cai_school_hig} 개
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>🏯 대학교</TableCell>
                    <TableCell>
                      {data_cai[data_cai.length - 1].cai_university} 개
                    </TableCell>
                  </TableRow>
                </Table>
              </UBox>
              <DBox></DBox>
            </SecBox>
          </SectionWrap>
          <SectionWrap>
            <SecTitle>2. 분기별 매출 현황</SecTitle>
            <SecChart>
              <SalesBar data={data_qs} />
            </SecChart>
          </SectionWrap>
          <SectionWrap>
            <SecTitle>3. 유동인구 현황</SecTitle>
            <SecChart>
              <FpLine data={data_fp} />
            </SecChart>
          </SectionWrap>
          <SectionWrap>
            <SecTitle>4. 시간별 매출 현황(2024년 분기별)</SecTitle>
            <SecChart>
              <TimeSales data={timeSales} />
            </SecChart>
          </SectionWrap>
          <SectionWrap>
            <SecTitle>5. 연령별 유동인구 분포 및 매출 현황</SecTitle>
            <SecChart>
              <DivBox>
                <AgeRadar data={data_fp} />
              </DivBox>
              <DivBox>
                <AgeSaleRadar data={data_ags} />
              </DivBox>
            </SecChart>
          </SectionWrap>

          <CommentWrap>
            <CmtTitle>
              <h6>Notice</h6>
            </CmtTitle>
            <CmtContent>
              <CmtBox>
                <p></p>본 웹 사이트를 통해 배포, 전송되거나, 본 웹 사이트에
                포함되어 있는 서비스로부터 제공되는 상권정보는 참고 사항이며,
                사실과 차이가 있을 수 있어 정확성이나 신뢰성에 대해 어떠한
                보증도 하지 않습니다.
                <p></p>
                제공된 정보에 의한 투자결과에 대한 법적인 책임을 지지 않습니다.
                또한, 서비스 및 정보와 관련하여 직접, 간접, 부수적, 파생적인
                손해에 대해서 책임을 지지 않습니다.
                <p></p> 필요한 경우 그 재량에 의해 타인의 권리를 침해하거나
                위반하는 사용자에 대하여 사전 통지 없이 서비스 이용 제한 조치를
                취할 수 있습니다.
              </CmtBox>
            </CmtContent>
          </CommentWrap>
        </>
      )}
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  background-color: #f9f9f9;
`
const ResultWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2em;

  @media (max-width: 780px) {
    flex-direction: column;
  }
`
const ResultWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 2em;
  padding-bottom: 2em;
`
const ResultContent = styled.div`
  width: 100%;
`
const H2 = styled.h2`
  text-align: center;
  font-size: 2em;
`
const ResultTitle = styled.div`
  width: 100%;
`
const H1 = styled.h1`
  text-align: center;
  font-size: 3em;
`
const ResultImg = styled.div`
  width: 100%;
`
const ImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const SectionTitle = styled.div`
  padding: 2em 2em 2em 2em;
`
const SectionWrap = styled.div`
  padding: 3em 3em;

  @media (max-width: 780px) {
    flex-direction: column;
    height: auto; /* 여기서만 자동 높이 */
  }
`
const SecTitle = styled.div`
  font-size: 1.5em;
`
const SecChart = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: space-between;

  @media (max-width: 780px) {
    flex-direction: column;
    height: auto; /* 여기서만 자동 높이 */
  }
`
const DivBox = styled.div`
  width: 100%;
`
const SecBox = styled.div``
const UBox = styled.div`
  width: 100%;
  padding: 1em 1em;
`
const DBox = styled.div`
  width: 100%;
`
const CommentWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2em;
`
const CmtTitle = styled.div`
  font-size: 1.8em;
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
  inset: 0; /* top:0, right:0, bottom:0, left:0 와 동일 */
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
