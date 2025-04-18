"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const 공정항목 = ['철거', '목공', '전기', '도장', '필름', '도배', '타일', '가스', '준공청소', '덕트', '폐기물처리', '자재입고', '주방입고', '의탁자입고', '설비', '방수', '셀프레벨링', '양생']

export default function 공사보고생성기() {
  const [현장명, set현장명] = useState('')
  const [오늘공정, set오늘공정] = useState([])
  const [내일공정, set내일공정] = useState([])
  const [특이사항, set특이사항] = useState('금일 특이사항 없습니다.')
  const [결과, set결과] = useState('')
  const [요약, set요약] = useState('')

  const handleToggle = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter(i => i !== value))
    } else {
      setList([...list, value])
    }
  }

  const generate = () => {
    const full = `안녕하세요!^^\n[${현장명}] 보고드리겠습니다.🙂\n\n[오늘] ${오늘공정.join(', ')} 진행되었습니다.\n[내일] ${내일공정.join(', ')} 예정입니다.\n\n* ${특이사항}\n감사합니다 ^^`
    const summary = `[공사보고 - ${현장명}]\n오늘: ${오늘공정.join(', ')}\n내일: ${내일공정.join(', ')}\n특이사항: ${특이사항}`
    set결과(full)
    set요약(summary)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
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
                <Button key={item} variant={오늘공정.includes(item) ? 'default' : 'outline'} size="sm" onClick={() => handleToggle(item, 오늘공정, set오늘공정)}>
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label>내일 공정</Label>
            <div className="flex flex-wrap gap-2">
              {공정항목.map(item => (
                <Button key={item} variant={내일공정.includes(item) ? 'default' : 'outline'} size="sm" onClick={() => handleToggle(item, 내일공정, set내일공정)}>
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
              <Button onClick={() => copyToClipboard(결과)} className="mt-2 w-full">보고서 복사하기</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="whitespace-pre-wrap space-y-2">
              <div>{요약}</div>
              <Button onClick={() => copyToClipboard(요약)} className="mt-2 w-full">요약 복사하기</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
