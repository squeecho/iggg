'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

const 카테고리공정 = {
  '기초': ['철거', '자재 입고', '가설', '보양', '폐기물처리'],
  '본공사1': ['목공', '전기', '금속', '설비', '방수', '양생', '도장', '필름', '타일', '덕트', '잔마무리', '준공 청소'],
  '본공사2': ['도배', '데코타일', '바닥마루', '아트미장'],
  '외주': ['소방', '간판', '주방 입고', '가스', '온수기 설치', '의탁자 입고', 'CCTV']
}

// 모든 공정항목을 하나의 배열로 합치기
const 공정항목 = Object.values(카테고리공정).flat()

export default function 공사보고생성기() {
  const { show } = useToast()
  const [현장명, set현장명] = useState('')
  const [현장목록, set현장목록] = useState<string[]>([])
  const [오늘공정, set오늘공정] = useState<string[]>([])
  const [내일공정, set내일공정] = useState<string[]>([])
  const [특이사항, set특이사항] = useState('금일 특이사항 없습니다.')
  const [결과, set결과] = useState('')
  const [다음작업일정, set다음작업일정] = useState<'내일' | '월요일'>('내일')

  useEffect(() => {
    const sn = localStorage.getItem('현장명')
    const sl = localStorage.getItem('현장목록')
    if (sn) set현장명(sn)
    if (sl) set현장목록(JSON.parse(sl))
  }, [])

  useEffect(() => {
    localStorage.setItem('현장명', 현장명)
  }, [현장명])

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
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '.')
    const txt = `안녕하세요! 
[${dateStr}] 
[${현장명}] 공사 보고드립니다.🙂

■ 오늘 작업: ${오늘공정.join(', ')}  
■ ${다음작업일정} 작업: ${내일공정.join(', ')} 예정

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
      <Card>
        <CardContent className="space-y-4">
          <div>
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
                  <span onClick={() => set현장명(h)} className="cursor-pointer">{h}</span>
                  <button onClick={() => handle현장삭제(h)} className="text-red-500">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* 오늘 공정 */}
          <div>
            <div className="bg-[#FFF9E6] border rounded-md p-3 mb-3 shadow-sm">
              <h3 className="text-[#222933] text-lg font-bold text-center">오늘 작업 공정</h3>
            </div>
            {Object.entries(카테고리공정).map(([카테고리, 항목들]) => (
              <div key={카테고리} className="mb-4 border rounded-md p-2 bg-gray-50">
                <p className="text-md font-bold mb-2 pb-1 border-b">{카테고리}</p>
                <div className="flex flex-wrap gap-2">
                  {항목들.map(item => (
                    <Button
                      key={item}
                      variant={오늘공정.includes(item) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToggle(item, 오늘공정, set오늘공정)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 다음 작업 일정 */}
          <div>
            <Label>다음 작업 일정</Label>
            <div className="flex gap-2">
              {['내일', '월요일'].map(opt => (
                <Button
                  key={opt}
                  variant={다음작업일정 === opt ? 'default' : 'outline'}
                  onClick={() => set다음작업일정(opt as '내일' | '월요일')}
                >
                  {opt}
                </Button>
              ))}
            </div>
          </div>

          {/* 내일 공정 */}
          <div>
            <div className="bg-[#FFF9E6] border rounded-md p-3 mb-3 shadow-sm">
              <h3 className="text-[#222933] text-lg font-bold text-center">내일(월요일) 작업 공정</h3>
            </div>
            {Object.entries(카테고리공정).map(([카테고리, 항목들]) => (
              <div key={카테고리} className="mb-4 border rounded-md p-2 bg-gray-50">
                <p className="text-md font-bold mb-2 pb-1 border-b">{카테고리}</p>
                <div className="flex flex-wrap gap-2">
                  {항목들.map(item => (
                    <Button
                      key={item}
                      variant={내일공정.includes(item) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToggle(item, 내일공정, set내일공정)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
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

          <Button
            onClick={generate}
            className="w-full active:scale-[0.98] transition"
          >
            보고서 생성
          </Button>
        </CardContent>
      </Card>

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