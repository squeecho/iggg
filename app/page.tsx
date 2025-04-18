'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const 공정항목 = [
  '철거', '자재 입고', '가설', '목공', '전기', '금속', '설비', '방수', '양생',
  '셀프 레벨링', '도장', '아트미장', '도배', '필름', '타일', '데코타일', '마루시공',
  '덕트 공사', '폐기물처리', '간판 공사', '주방 입고', '가스 공사', '온수기 설치',
  '의탁자 입고', '준공 청소'
]

export default function 공사보고생성기() {
  const [현장명, set현장명] = useState('')
  const [오늘공정, set오늘공정] = useState<string[]>([])
  const [내일공정, set내일공정] = useState<string[]>([])
  const [특이사항, set특이사항] = useState('금일 특이사항 없습니다.')
  const [결과, set결과] = useState('')
  const [토스트, set토스트] = useState('')

  const handleToggle = (value: string, list: string[], setList: Function) => {
    if (list.includes(value)) {
      setList(list.filter(i => i !== value))
    } else {
      setList([...list, value])
    }
  }

  const generate = () => {
    const full = `안녕하세요!^^\n[${현장명}] 보고드리겠습니다.🙂\n\n[오늘] ${오늘공정.join(', ')} 진행되었습니다.\n[내일] ${내일공정.join(', ')} 예정입니다.\n\n* ${특이사항}\n감사합니다 ^^`
    set결과(full)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      set토스트('📋 복사되었습니다!')
      setTimeout(() => set토스트(''), 2000)
    })
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6 relative">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label>현장명</Label>
            <Input value={현장명} onChange={e => set현장명(e.target.value)} placeholder="예: 이견공간 뉴욕점" />
          </div>
          <div>
            <Label>오늘 공정</Label>
            <div className="flex flex-wrap gap-2">
              {공정항목.map(item => (
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
          <div>
            <Label>내일 공정</Label>
            <div className="flex flex-wrap gap-2">
              {공정항목.map(item => (
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
          <div>
            <Label>특이사항</Label>
            <Textarea value={특이사항} onChange={e => set특이사항(e.target.value)} placeholder="없음 또는 특이사항 메모" />
          </div>
          <Button onClick={generate} className="w-full">보고서 생성</Button>
        </CardContent>
      </Card>

      {결과 && (
        <div className="space-y-4">
          <Card>
            <CardContent className="whitespace-pre-wrap space-y-2">
              <div>{결과}</div>
              <Button onClick={() => copyToClipboard(결과)} className="mt-2 w-full">📋 보고서 복사하기</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {토스트 && (
        <div className="fixed bottom-4 right-4 bg-black text-white text-sm px-4 py-2 rounded-lg shadow">
          {토스트}
        </div>
      )}
    </div>
  )
}