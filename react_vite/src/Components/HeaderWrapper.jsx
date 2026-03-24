import { Typography } from "@mui/material"
import { Link } from "react-router-dom"
import styled from "@emotion/styled"

export default function HeaderWrapper() {
  return (
    <HeaderRoot>
      <HeaderWrap1>
        <Typography
          component={Link}
          to="/"
          sx={{
            textDecoration: "none", // 언더라인 제거
            color: "inherit", // 부모 색상 사용
            "&:hover": {
              cursor: "pointer",
              textDecoration: "none",
              color: "#333", // 원하는 hover 색상
            },
          }}
        >
          HOME
        </Typography>
      </HeaderWrap1>
      <HeaderBox>
        <HeaderWrap2>
          <Typography
            component={Link}
            to="/status"
            sx={{
              textDecoration: "none", // 언더라인 제거
              color: "inherit", // 부모 색상 사용
              "&:hover": {
                cursor: "pointer",
                textDecoration: "none",
                color: "#333", // 원하는 hover 색상
              },
            }}
          >
            DASHBOARD
          </Typography>
        </HeaderWrap2>
        <HeaderWrap3>
          <Typography
            component={Link}
            to="/board"
            sx={{
              textDecoration: "none", // 언더라인 제거
              color: "inherit", // 부모 색상 사용
              "&:hover": {
                cursor: "pointer",
                textDecoration: "none",
                color: "#333", // 원하는 hover 색상
              },
            }}
          >
            BOARD
          </Typography>
        </HeaderWrap3>
      </HeaderBox>
    </HeaderRoot>
  )
}

const HeaderRoot = styled.div`
  width: 100%;
  max-width: 1280px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  position: fixed;
  top: 0;
  z-index: 999;
  background-color: #a0f1bd;
  margin: auto;
`

const HeaderWrap1 = styled.div`
  margin-left: 2em;
`
const HeaderBox = styled.div`
  display: flex;
`
const HeaderWrap2 = styled.div`
  margin-right: 2em;
`
const HeaderWrap3 = styled.div`
  margin-right: 2em;
`
// const HeaderWrap4 = styled.div`
//   margin-right: 2em;
// `
