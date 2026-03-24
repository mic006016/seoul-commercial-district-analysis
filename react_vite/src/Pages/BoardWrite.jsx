import { useState } from "react"
import styled from "@emotion/styled"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function BoardWrite() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    content: "",
    password: "",
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      title: form.title,
      writer: form.writer,
      content: form.content,
      password: form.password,
    }

    try {
      // ✅ 백엔드 라우터: POST /board/write 로 보냄
      await axios.post(`${import.meta.env.VITE_API_URL}/board/write`, payload)

      alert("게시글이 등록되었습니다!")
      setForm({ title: "", writer: "", content: "", password: "" })
      navigate("/board") // 목록으로 이동
    } catch (error) {
      console.error("게시글 등록 오류:", error)
      alert("서버와 통신할 수 없습니다.")
    }
  }

  return (
    <Wrapper>
      <Title>게시글 작성</Title>
      <Form onSubmit={handleSubmit}>
        <Label>제목</Label>
        <Input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <Label>작성자</Label>
        <Input
          name="writer"
          value={form.writer}
          onChange={handleChange}
          required
        />

        <Label>내용</Label>
        <Textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          required
        />

        <Label>비밀번호</Label>
        <Input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Button type="submit">등록하기</Button>
      </Form>
    </Wrapper>
  )
}

/* -------------------------------
   styled-components 정의
-------------------------------- */

const Wrapper = styled.div`
  max-width: 500px;
  margin: 40px auto;
`

const Title = styled.h2`
  text-align: center;
  margin-bottom: 24px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 4px;
`

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;

  &:focus {
    border-color: #0077ff;
    outline: none;
  }
`

const Textarea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;
  height: 200px;
  resize: vertical;

  &:focus {
    border-color: #0077ff;
    outline: none;
  }
`

const Button = styled.button`
  margin-top: 16px;
  padding: 12px;
  background-color: #0077ff;
  color: white;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #005fcc;
  }
`
