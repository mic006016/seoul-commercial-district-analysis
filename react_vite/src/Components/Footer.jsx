import styled from "@emotion/styled"
import { Typography } from "@mui/material"

export default function Footer() {
  return (
    <Container>
      <LeftWrap>
        <img
          src="src\imgs\logo.png"
          style={{ width: "17px", height: "17px", marginRight: "5px" }}
        />
        <Typography variant="subtitle1" sx={{ color: "white" }}>
          차자조AI
        </Typography>
      </LeftWrap>
      <RightWrap>
        <Typography variant="caption" sx={{ color: "white" }}>
          © 2025 All Rights Reserved
        </Typography>
      </RightWrap>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  display: flex;
  background-color: #2e4f21;
  justify-content: space-between;
  height: 200px;
`
const LeftWrap = styled.div`
  display: flex;
  padding: 1em 1em 1em 1em;
`
const RightWrap = styled.div`
  padding-right: 1em;
  padding-bottom: 1em;
  margin-top: auto;
`
