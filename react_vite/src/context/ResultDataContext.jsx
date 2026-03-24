// src/context/ResultDataContext.jsx
import { createContext, useContext, useState } from "react"

const ResultDataContext = createContext(null)

export function ResultDataProvider({ children }) {
  const [selection, setSelection] = useState({
    gu: "",
    dong: "",
    category: "",
  })

  const [aiResult, setAiResult] = useState(null) // AI 분석 결과
  const [dbResult, setDbResult] = useState(null) // DB 조회 결과

  const resetResults = () => {
    setSelection({ gu: "", dong: "", category: "" })
    setAiResult(null)
    setDbResult(null)
  }

  const value = {
    selection,
    setSelection,
    aiResult,
    setAiResult,
    dbResult,
    setDbResult,
    resetResults,
  }

  return (
    <ResultDataContext.Provider value={value}>
      {children}
    </ResultDataContext.Provider>
  )
}

export function useResultData() {
  const ctx = useContext(ResultDataContext)
  if (!ctx) {
    throw new Error("useResultData must be used within a ResultDataProvider")
  }
  return ctx
}
