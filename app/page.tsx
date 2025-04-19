'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

// YYYY.MM.DD 형식으로 날짜 반환
function formatDate(date: Date) {
  const yy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yy}.${mm}.${dd}`
}

const 공정항목 = [
  '철거','자재 입고','가설','목공','전기','금속','설비','방수','양생',
  '셀프 레벨링','도장','아트미장','도배','필름','타일','데코타일','마루시공',
  '덕트','에어컨','폐기물처리','간판','주방 입고','가스',
  '온수기 설치','의탁자 입고','준공 청소'
]

export default function 공사보고생성기() {
  const { show } = useToast()
  const [현장명, set현장명] = useState('')
  const [현장목록, set현장목록] = useState<string[]>([])
  const [오늘공정, set오늘공정] = useState<string[]>([])
  const [내일공정, set내일공정] = useState<string[]>([])
  const [특이사항, set특이사항] = useState('금일 특이사항 없습니다.')
  const [결과, set결과] = useState('')

  // 로컬스토리지에서 불러오기
  useEffect(() => {
    const sn = localStorage.getItem('현장명')
    const sl = localStorage.getItem('현장목록')
    if (sn) set현장명(sn)
    if (sl) set현장목록(JSON.parse(sl))
  }, [])

  // 현장명 저장
  useEffect(() => {
    localStorage.setItem('현장명', 현장명)
  }, [현장명])

  // 현장목록 저장
  useEffect(() => {
    localStorage.setItem('현장목록', JSON.stringify(현장목록))
  }, [현장목록])

  const handleToggle = (
    v: string,
    list: string[],
    setList: (l: string[]) => void
  ) => {
    setList(list.includes(v) ? list.filter(x => x !== v) : [...list, v])
  }

  const handle현장추가 = () => {
    if (!현장명 || 현장목록.includes(현장명)) {
      show('이미 있는 현장이거나 빈칸입니다.')
      return
    }
    set현장목록([현장명, ...현장목록])
    show('현장명이 추가되었습니다.')
  }

  const handle현장삭제 = (h: string) => {
    set현장목록(현장목록.filter(x => x !== h))
    if (현장명 === h) set현장명('')
    show('현장명이 삭제되었습니다.')
  }

  const generate = () => {
    const today = new Date()
    const dateString = formatDate(today)
    const tomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    )

    const txt = `안녕하세요!
[${dateString}] 
[${현장명}] 공사 보고드립니다.🙂

■ 오늘 작업: ${오늘공정.join(', ')}  
■ 내일 작업: ${내일공정.join(', ')} 예정

* ${특이사항}
감사합니다!`
    set결과(txt)
    show('보고서가 생성되었습니다.')
  }

  const copyToClipboard = (t: string) => {
    navigator.clipboard.writeText(t)
    show('복사되었습니다.')
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      {/* 현장명 입력 */}
      <Card>
        <CardContent className="space-y-4">
          <Label>현장명</Label>
          <div className="flex gap-2">
            <Input
              value={현장명}
              onChange={e => set현장명(e.target.value)}
              placeholder="예: 이견공간 뉴욕점"
            />
            <Button onClick={handle현장추가}>추가</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {현장목록.map(h => (
              <div
                key={h}
                className="flex items-center gap-1 border rounded px-2 py-1 text-sm"
              >
                <span
                  onClick={() => set현장명(h)}
                  className="cursor-pointer"
                >
                  {h}
                </span>
                <button
                  onClick={() => handle현장삭제(h)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* 오늘/내일 공정 */}
          <div>
            <Label>오늘 작업 공정</Label>
            <div className="flex flex-wrap gap-2">
              {공정항목.map(item => (
                <Button
                  key={item}
                  variant={오늘공정.includes(item) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    handleToggle(item, 오늘공정, set오늘공정)
                  }
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label>내일 작업 공정</Label>
            <div className="flex flex-wrap gap-2">
              {공정항목.map(item => (
                <Button
                  key={item}
                  variant={내일공정.includes(item) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    handleToggle(item, 내일공정, set내일공정)
                  }
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>

          {/* 특이사항 */}
          <div>
            <Label>특이사항</Label>
            <Textarea
              value={특이사항}
              onChange={e => set특이사항(e.target.value)}
              placeholder="없음 또는 특이사항 메모"
            />
          </div>

          {/* 보고서 생성 버튼 */}
          <Button
            onClick={generate}
            className="w-full active:scale-[0.98] transition"
          >
            보고서 생성
          </Button>
        </CardContent>
      </Card>

      {/* 결과 출력 & 복사 */}
      {결과 && (
        <Card>
          <CardContent className="whitespace-pre-wrap space-y-2">
            <div>{결과}</div>
            <Button
              onClick={() => copyToClipboard(결과)}
              className="mt-2 w-full active:scale-[0.98] transition"
            >
              보고서 복사하기
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}