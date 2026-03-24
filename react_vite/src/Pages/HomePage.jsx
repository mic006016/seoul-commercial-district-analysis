import {
  Typography,
  FormControl,
  InputLabel,
  NativeSelect,
  Button,
} from "@mui/material"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styled from "@emotion/styled"
import Map from "../Components/kakaomap/Map"
import { useResultData } from "../context/ResultDataContext"
import axios from "axios"

export default function HomePage() {
  const [selectedGu, setSelectedGu] = useState("")
  const [selectedDong, setSelectedDong] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [guList, setGuList] = useState([])
  const [dongList, setDongList] = useState([])
  const [categoryList, setCategoryList] = useState([])

  const { setSelection, setAiResult, setDbResult, resetResults } =
    useResultData()

  useEffect(() => {
    const fetchGu = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/gu`)
        setGuList(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchGu()
  }, [])

  useEffect(() => {
    if (!selectedGu) {
      setDongList([])
      setSelectedDong("")
      return
    }

    const fetchDong = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/gu/dong`, {
          params: { gu: selectedGu }, // 쿼리 파라미터로 구 보내기
        })
        setDongList(res.data)
      } catch (err) {
        console.error(err)
        setDongList([])
      }
    }

    fetchDong()
  }, [selectedGu])

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/category`)
        setCategoryList(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchCategory()
  }, [])

  const handleGuChange = (e) => {
    const value = e.target.value
    setSelectedGu(value)
    setSelectedDong("")
  }
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  const navigate = useNavigate()

  const handleSearchClick = async () => {
    if (!selectedGu || !selectedDong || !selectedCategory) {
      alert("구, 동, 업종을 모두 선택해주세요.")
      return
    }

    const body = {
      gu: selectedGu,
      dong: selectedDong,
      category: selectedCategory,
    }

    try {
      setLoading(true)
      resetResults()
      setSelection(body)

      const [aiRes, dbRes] = await Promise.all([
        // axios.get("/ai", { params: body }),
        axios.get(`${import.meta.env.VITE_API_URL}/ai`, { params: body }),
        axios.get(`${import.meta.env.VITE_API_URL}/result`, { params: body }),
      ])

      // 응답 Provider에 저장
      setAiResult(aiRes.data)
      setDbResult(dbRes.data)

      // 저장 후 ResultPage로 이동
      navigate("/result")
    } catch (err) {
      console.error(err)
      alert("서버 요청 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }
  return (
    <Container>
      <SearchWrapper>
        <ContentWrap>
          <Typography variant="h3" gutterBottom>
            서울지역 상권 추천 서비스
          </Typography>
          <Typography variant="h6" gutterBottom>
            모든 항목을 선택하세요.
          </Typography>
        </ContentWrap>
        <FormWrap>
          <SelectForm>
            <FormControl sx={{ width: "50%" }}>
              <InputLabel variant="standard" htmlFor="selected-gu">
                구 선택
              </InputLabel>
              <NativeSelect value={selectedGu} onChange={handleGuChange}>
                <option value=""></option>
                {guList.map((gu) => (
                  <option key={gu} value={gu}>
                    {gu}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>

            <FormControl sx={{ width: "50%" }}>
              <InputLabel variant="standard" htmlFor="selected-dong">
                동 선택
              </InputLabel>
              <NativeSelect
                value={selectedDong}
                onChange={(e) => setSelectedDong(e.target.value)}
              >
                <option value=""></option>
                {dongList.map((dong) => (
                  <option key={dong} value={dong}>
                    {dong}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
          </SelectForm>

          <SearchForm>
            <FormControl sx={{ width: "50%" }}>
              <InputLabel variant="standard" htmlFor="selected-categorynative">
                업종 선택
              </InputLabel>
              <NativeSelect
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value=""></option>
                {categoryList.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
            <Button
              onClick={handleSearchClick}
              variant="contained"
              disabled={loading}
              sx={{
                width: "26%",
                backgroundColor: "#2E4F21",
                borderRadius: "25px",
              }}
            >
              조회하기
            </Button>
          </SearchForm>
        </FormWrap>
      </SearchWrapper>
      <MapWrapper>
        <MapWrap>
          <Map selectedGu={selectedGu} selectedDong={selectedDong} />
        </MapWrap>
      </MapWrapper>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #a0f1bd;

  @media (max-width: 780px) {
    flex-direction: column;
  }
`
const SearchWrapper = styled.div`
  width: 100%;
`
const ContentWrap = styled.section`
  margin-top: 3em;
  padding: 2em;
`
const FormWrap = styled.div`
  padding: 2em;
`
const SelectForm = styled.div`
  margin-bottom: 2em;
`
const SearchForm = styled.div`
  display: flex;
  justify-content: space-between;
`
const MapWrapper = styled.div`
  width: 100%;
`
const MapWrap = styled.div`
  margin-top: 3em;
  padding: 2em;
`
