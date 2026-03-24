import { useEffect, useState, useRef } from "react"
import styled from "@emotion/styled"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

export default function BoardDetail() {
  const [form, setForm] = useState({
    title: "",
    writer: "",
    content: "",
    password: "", // 보통은 안 보여주지만 형식 맞추려고 남겨둠
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // 삭제용 비밀번호
  const [deletePassword, setDeletePassword] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const [editForm, setEditForm] = useState({
    title: "",
    writer: "",
    content: "",
  })

  const [editPassword, setEditPassword] = useState("")

  const navigate = useNavigate()
  const { id } = useParams() // /board/:id

  const hasFetched = useRef(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/board/${id}`
        )

        const data = res.data
        // ✅ 백엔드에서 반환하는 키 이름에 맞게 매핑
        setForm({
          title: data.ip_title ?? "",
          writer: data.ip_writer ?? "",
          content: data.ip_content ?? "",
          password: "", // 비밀번호는 보통 안 내려줌
        })
      } catch (err) {
        console.error("게시판 상세 조회 오류:", err)
        setError("게시글을 불러오는 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }

    if (!id) return

    // StrictMode 때문에 두 번 실행되는 것을 방지하는 가드
    if (hasFetched.current) return
    hasFetched.current = true

    fetchPost()
  }, [id])

  if (loading) {
    return <Wrapper>게시글을 불러오는 중입니다...</Wrapper>
  }

  if (error) {
    return <Wrapper>{error}</Wrapper>
  }

  const handleEditStart = () => {
    // 현재 글 내용을 편집용 상태에 복사
    setEditForm({
      title: form.title,
      writer: form.writer,
      content: form.content,
    })
    setEditPassword("")
    setIsEditing(true)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
  }

  const handleEditSave = async () => {
    if (!window.confirm("수정 내용을 저장하시겠습니까?")) return

    if (!editForm.title || !editForm.content) {
      alert("제목과 내용을 입력해주세요.")
      return
    }
    if (!editPassword) {
      alert("비밀번호를 입력해주세요.")
      return
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/board/${id}`, {
        title: editForm.title,
        content: editForm.content,
        password: editPassword,
      })

      alert("수정되었습니다.")

      // 상세 화면(state)도 수정된 내용으로 갱신
      setForm((prev) => ({
        ...prev,
        title: editForm.title,
        content: editForm.content,
      }))

      setIsEditing(false)
      setEditPassword("")
    } catch (err) {
      console.error("수정 오류", err)

      if (err.response && err.response.status === 403) {
        alert("비밀번호가 일치하지 않습니다.")
      } else if (err.response && err.response.status === 404) {
        alert("존재하지 않는 글입니다.")
      } else {
        alert("수정 중 오류가 발생했습니다.")
      }
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("정말 이 글을 삭제하시겠습니까?")) return

    if (!deletePassword) {
      alert("비밀번호를 입력하세요.")
      return
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/board/${id}`, {
        // axios의 DELETE 에서 body 보내는 법: data 속성 사용
        data: { password: deletePassword },
      })
      alert("삭제되었습니다.")
      navigate("/board")
    } catch (err) {
      console.error("삭제 오류", err)

      if (err.response && err.response.status === 403) {
        alert("비밀번호가 일치하지 않습니다.")
      } else if (err.response && err.response.status === 404) {
        alert("이미 삭제되었거나 존재하지 않는 글입니다.")
      } else {
        alert("삭제 중 오류가 발생했습니다.")
      }
    }
  }

  return (
    <Wrapper>
      <Title>게시글</Title>
      {/* ✅ onSubmit 없음 → 글 작성/수정 불가 */}
      <Form>
        <Label>제목</Label>
        <Input
          name="title"
          value={isEditing ? editForm.title : form.title}
          readOnly={!isEditing}
          onChange={
            isEditing
              ? (e) =>
                  setEditForm((prev) => ({ ...prev, title: e.target.value }))
              : undefined
          }
        />

        <Label>작성자</Label>
        <Input
          name="writer"
          value={isEditing ? editForm.writer : form.writer}
          readOnly={!isEditing}
          onChange={
            isEditing
              ? (e) =>
                  setEditForm((prev) => ({ ...prev, writer: e.target.value }))
              : undefined
          }
        />

        <Label>내용</Label>
        <Textarea
          name="content"
          value={isEditing ? editForm.content : form.content}
          readOnly={!isEditing}
          onChange={
            isEditing
              ? (e) =>
                  setEditForm((prev) => ({ ...prev, content: e.target.value }))
              : undefined
          }
        />

        {/* 🆕 삭제용 비밀번호 입력칸 */}
        <Label>게시글 삭제 비밀번호</Label>
        <Input
          type="password"
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
        />

        {isEditing && (
          <>
            <Label>게시글 수정 비밀번호 </Label>
            <Input
              type="password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
            />
          </>
        )}

        <ButtonRow>
          {/* 편집 중이 아닐 떼 */}
          {/* 목록 버튼 */}
          {!isEditing && (
            <>
              <Button type="button" onClick={() => navigate("/board")}>
                목록
              </Button>
              {/* 수정 버튼 */}
              <Button type="button" onClick={handleEditStart}>
                수정
              </Button>
              {/* 삭제 버튼 */}
              <DeleteButton type="button" onClick={handleDelete}>
                삭제
              </DeleteButton>
            </>
          )}

          {/* 편집 중일 때 */}
          {isEditing && (
            <>
              <Button type="button" onClick={handleEditSave}>
                저장
              </Button>
              <Button type="button" onClick={handleEditCancel}>
                취소
              </Button>
            </>
          )}
        </ButtonRow>
      </Form>
    </Wrapper>
  )
}

/* -------------------------------
   styled-components 정의 (그대로 사용)
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
  background-color: #f5f5f5; /* 읽기 전용 느낌 살짝 */
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
  background-color: #f5f5f5;
  &:focus {
    border-color: #0077ff;
    outline: none;
  }
`

const ButtonRow = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
`

const Button = styled.button`
  margin: 5px;
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
const DeleteButton = styled(Button)`
  margin-left: 8px;
  background-color: #e53935;

  &:hover {
    backgroud-color: #c62828;
  }
`
