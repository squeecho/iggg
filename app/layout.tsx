'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Checkbox } from '@/components/ui/checkbox'

// ✅ 수정: 본공사 1+2 통합, 단어 추가/수정
const 카테고리공정 = {
  '기초': ['철거', '자재 입고', '가설', '보양', '폐기물처리', '현장 정리'],
  '본공사': [
    '목공', '전기', '금속', '설비', '방통', '양생', '도장', '필름',
    '타일', '덕트', '경량', '내외부마감', '준공 청소',
    '도배', '데코타일', '바닥마루', '아트미장',
    '바닥마감', '화장실마감', '도기설치', '외부 데크'
  ],
  '외주': [
    '에어컨', '간판', '주방 입고', '가스', '온수기 설치',
    '의탁자 입고', 'CCTV', '소방', '인터넷', '폴딩도어', '덤웨이터', '블라인드'
  ]
}

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

  // ✅ 추가: 오늘/오늘까지 선택
  const [오늘작업구분, set오늘작업구분] = useState<'오늘' | '오늘까지'>('오늘')

  // 공사마감 관련 상태
  const [공사마감임박, set공사마감임박] = useState(false)
  const [현장별남은일정, set현장별남은일정] = useState<{[key: string]: { 날짜: string; 작업: string }[]}>({})
  const [남은일정, set남은일정] = useState<{ 날짜: string; 작업: string }[]>([])
  const [임시작업, set임시작업] = useState('')

  // ✅ 추가: 날짜 건너뛰기용 임시 날짜 상태
  const [임시날짜, set임시날짜] = useState('')

  // 템플릿 관련 상태
  const [템플릿목록, set템플릿목록] = useState<{[key: string]: { 날짜: string; 작업: string }[]}>({})
  const [템플릿명, set템플릿명] = useState('')

  const 남은일정Ref = useRef(남은일정)
  const isLocalUpdate = useRef(false)

  // ✅ 남은일정이 바뀔 때 임시날짜도 자동 갱신 (단, 사용자가 직접 수정 중이 아닐 때)
  useEffect(() => {
    남은일정Ref.current = 남은일정
    if (!isLocalUpdate.current && 현장명) {
      const 업데이트된현장별일정 = { ...현장별남은일정, [현장명]: 남은일정 }
      set현장별남은일정(업데이트된현장별일정)
      localStorage.setItem('현장별남은일정', JSON.stringify(업데이트된현장별일정))
    }
    isLocalUpdate.current = false
    // 다음 추가될 날짜 자동 계산해서 임시날짜 세팅
    set임시날짜(get다음날짜계산(남은일정))
  }, [남은일정, 현장명])

  useEffect(() => {
    const sn = localStorage.getItem('현장명')
    const sl = localStorage.getItem('현장목록')
    const rm = localStorage.getItem('공사마감임박')
    const rs = localStorage.getItem('현장별남은일정')
    const tp = localStorage.getItem('템플릿목록')

    if (sn) set현장명(sn)
    if (sl) set현장목록(JSON.parse(sl))
    if (rm) set공사마감임박(JSON.parse(rm))
    if (rs) {
      const 저장된일정 = JSON.parse(rs)
      set현장별남은일정(저장된일정)
      if (sn && 저장된일정[sn]) {
        isLocalUpdate.current = true
        set남은일정(저장된일정[sn])
      }
    }
    if (tp) set템플릿목록(JSON.parse(tp))
  }, [])

  useEffect(() => {
    if (현장명) {
      isLocalUpdate.current = true
      if (현장별남은일정[현장명]) {
        set남은일정(현장별남은일정[현장명])
      } else {
        set남은일정([])
      }
      set템플릿명(현장명)
    }
  }, [현장명])

  useEffect(() => { localStorage.setItem('현장명', 현장명) }, [현장명])
  useEffect(() => { localStorage.setItem('현장목록', JSON.stringify(현장목록)) }, [현장목록])
  useEffect(() => { localStorage.setItem('공사마감임박', JSON.stringify(공사마감임박)) }, [공사마감임박])
  useEffect(() => { localStorage.setItem('템플릿목록', JSON.stringify(템플릿목록)) }, [템플릿목록])

  const handleToggle = (v: string, list: string[], setList: (l: string[]) => void) => {
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
    const 업데이트된현장별일정 = { ...현장별남은일정 }
    delete 업데이트된현장별일정[h]
    set현장별남은일정(업데이트된현장별일정)
    localStorage.setItem('현장별남은일정', JSON.stringify(업데이트된현장별일정))
    set현장목록(현장목록.filter(x => x !== h))
    if (현장명 === h) set현장명('')
    show('현장명이 삭제되었습니다.')
  }

  // ✅ 순수 함수로 분리 (남은일정 배열을 인자로 받음)
  const get다음날짜계산 = (일정목록: { 날짜: string; 작업: string }[]) => {
    if (일정목록.length === 0) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}`
    } else {
      const 마지막 = 일정목록[일정목록.length - 1]
      const [월, 일] = 마지막.날짜.split('/').map(Number)
      const 다음 = new Date()
      다음.setMonth(월 - 1)
      다음.setDate(일)
      다음.setDate(다음.getDate() + 1)
      return `${다음.getMonth() + 1}/${다음.getDate()}`
    }
  }

  const get다음날짜 = () => get다음날짜계산(남은일정)

  const get요일 = (날짜문자열: string) => {
    const [월, 일] = 날짜문자열.split('/').map(Number)
    const date = new Date()
    date.setMonth(월 - 1)
    date.setDate(일)
    return ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
  }

  // ✅ 수정: 임시날짜(건너뛰기 가능) 사용
  const handle남은일정추가 = () => {
    if (!임시작업) {
      show('작업 내용을 입력해주세요.')
      return
    }
    if (!현장명) {
      show('현장을 먼저 선택해주세요.')
      return
    }

    const 사용할날짜 = 임시날짜 || get다음날짜()
    const 새일정 = [...남은일정, { 날짜: 사용할날짜, 작업: 임시작업 }]

    isLocalUpdate.current = false
    set남은일정(새일정)

    const 업데이트된현장별일정 = { ...현장별남은일정, [현장명]: 새일정 }
    set현장별남은일정(업데이트된현장별일정)
    localStorage.setItem('현장별남은일정', JSON.stringify(업데이트된현장별일정))

    set임시작업('')
    show('남은 일정이 추가되었습니다.')
  }

  const handle남은일정삭제 = (index: number) => {
    const 새일정 = 남은일정.filter((_, i) => i !== index)
    isLocalUpdate.current = false
    set남은일정(새일정)
    if (현장명) {
      const 업데이트된현장별일정 = { ...현장별남은일정, [현장명]: 새일정 }
      set현장별남은일정(업데이트된현장별일정)
      localStorage.setItem('현장별남은일정', JSON.stringify(업데이트된현장별일정))
    }
    show('일정이 삭제되었습니다.')
  }

  // ✅ 추가: 남은일정 날짜 개별 수정
  const handle남은일정날짜수정 = (index: number, 새날짜: string) => {
    const 새일정 = 남은일정.map((item, i) =>
      i === index ? { ...item, 날짜: 새날짜 } : item
    )
    isLocalUpdate.current = false
    set남은일정(새일정)
    if (현장명) {
      const 업데이트된현장별일정 = { ...현장별남은일정, [현장명]: 새일정 }
      set현장별남은일정(업데이트된현장별일정)
      localStorage.setItem('현장별남은일정', JSON.stringify(업데이트된현장별일정))
    }
  }

  // ✅ 추가: 남은일정 작업 내용 개별 수정
  const handle남은일정작업수정 = (index: number, 새작업: string) => {
    const 새일정 = 남은일정.map((item, i) =>
      i === index ? { ...item, 작업: 새작업 } : item
    )
    isLocalUpdate.current = false
    set남은일정(새일정)
    if (현장명) {
      const 업데이트된현장별일정 = { ...현장별남은일정, [현장명]: 새일정 }
      set현장별남은일정(업데이트된현장별일정)
      localStorage.setItem('현장별남은일정', JSON.stringify(업데이트된현장별일정))
    }
  }

  const 템플릿저장 = () => {
    if (!현장명) { show('현장을 먼저 선택해주세요.'); return }
    if (남은일정.length === 0) { show('저장할 일정이 없습니다.'); return }
    const 업데이트된템플릿목록 = { ...템플릿목록, [현장명]: [...남은일정] }
    set템플릿목록(업데이트된템플릿목록)
    localStorage.setItem('템플릿목록', JSON.stringify(업데이트된템플릿목록))
    show(`"${현장명}" 템플릿이 저장되었습니다.`)
  }

  const 템플릿불러오기 = (이름: string) => {
    if (!현장명) { show('현장을 먼저 선택해주세요.'); return }
    if (!템플릿목록[이름]) { show('템플릿을 찾을 수 없습니다.'); return }
    const today = new Date()
    const 재계산된일정 = 템플릿목록[이름].map((일정, index) => {
      const newDate = new Date(today)
      newDate.setDate(today.getDate() + index)
      return { 날짜: `${newDate.getMonth() + 1}/${newDate.getDate()}`, 작업: 일정.작업 }
    })
    isLocalUpdate.current = false
    set남은일정(재계산된일정)
    const 업데이트된현장별일정 = { ...현장별남은일정, [현장명]: 재계산된일정 }
    set현장별남은일정(업데이트된현장별일정)
    localStorage.setItem('현장별남은일정', JSON.stringify(업데이트된현장별일정))
    show(`"${이름}" 템플릿을 불러왔습니다.`)
  }

  const 템플릿삭제 = (이름: string) => {
    const 업데이트된템플릿목록 = { ...템플릿목록 }
    delete 업데이트된템플릿목록[이름]
    set템플릿목록(업데이트된템플릿목록)
    localStorage.setItem('템플릿목록', JSON.stringify(업데이트된템플릿목록))
    show(`"${이름}" 템플릿이 삭제되었습니다.`)
  }

  const 다른현장일정가져오기 = (소스현장: string) => {
    if (!현장명) { show('현재 현장을 먼저 선택해주세요.'); return }
    if (!현장별남은일정[소스현장]) { show('해당 현장의 일정이 없습니다.'); return }
    const 소스일정 = 현장별남은일정[소스현장]
    const today = new Date()
    const 재계산된일정 = 소스일정.map((일정, index) => {
      const newDate = new Date(today)
      newDate.setDate(today.getDate() + index)
      return { 날짜: `${newDate.getMonth() + 1}/${newDate.getDate()}`, 작업: 일정.작업 }
    })
    isLocalUpdate.current = false
    set남은일정(재계산된일정)
    const 업데이트된현장별일정 = { ...현장별남은일정, [현장명]: 재계산된일정 }
    set현장별남은일정(업데이트된현장별일정)
    localStorage.setItem('현장별남은일정', JSON.stringify(업데이트된현장별일정))
    show(`"${소스현장}" 현장의 일정을 가져왔습니다.`)
  }

  const generate = () => {
    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '.')

    // ✅ 수정: 오늘작업구분 반영
    const 오늘라벨 = 오늘작업구분 === '오늘' ? '오늘' : '오늘까지'

    let txt = `안녕하세요! 
[${dateStr}] 
[${현장명}] 공사 보고드립니다.🙂

■ ${오늘라벨} 작업: ${오늘공정.join(', ')}  
■ ${다음작업일정} 작업: ${내일공정.join(', ')} 예정

* ${특이사항}`

    if (공사마감임박 && 남은일정.length > 0) {
      txt += `\n\n■남은일정 안내`
      남은일정.forEach(일정 => {
        const 요일 = get요일(일정.날짜)
        txt += `\n${일정.날짜}(${요일}) - ${일정.작업}`
      })
    }

    txt += `\n\n감사합니다!`
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
          {/* 현장명 */}
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
                <div key={h} className="flex items-center gap-1 border rounded px-2 py-1 text-sm">
                  <span onClick={() => set현장명(h)} className="cursor-pointer">{h}</span>
                  <button
                    onClick={() => handle현장삭제(h)}
                    className="text-red-500 hover:text-white hover:bg-red-500 ml-1 px-1.5 py-0.5 rounded text-xs transition-colors"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ 오늘 작업 공정 - 오늘/오늘까지 선택 추가 */}
          <div>
            <div className="bg-[#FFF9E6] border rounded-md p-3 mb-3 shadow-sm">
              <h3 className="text-[#222933] text-lg font-bold text-center">오늘 작업 공정</h3>
            </div>
            {/* 오늘 / 오늘까지 선택 */}
            <div className="flex gap-2 mb-3">
              {(['오늘', '오늘까지'] as const).map(opt => (
                <Button
                  key={opt}
                  variant={오늘작업구분 === opt ? 'default' : 'outline'}
                  onClick={() => set오늘작업구분(opt)}
                >
                  {opt}
                </Button>
              ))}
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

          {/* 다음 작업 일정 선택 */}
          <div>
            <Label>다음 작업 일정</Label>
            <div className="flex gap-2">
              {(['내일', '월요일'] as const).map(opt => (
                <Button
                  key={opt}
                  variant={다음작업일정 === opt ? 'default' : 'outline'}
                  onClick={() => set다음작업일정(opt)}
                >
                  {opt}
                </Button>
              ))}
            </div>
          </div>

          {/* 내일 공정 */}
          <div>
            <div className="bg-[#FFF9E6] border rounded-md p-3 mb-3 shadow-sm">
              <h3 className="text-[#222933] text-lg font-bold text-center">
                {다음작업일정 === '내일' ? '내일' : '월요일'} 작업 공정
              </h3>
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

          {/* 공사마감 임박 체크 */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="공사마감임박"
              checked={공사마감임박}
              onCheckedChange={(checked) => set공사마감임박(checked === true)}
            />
            <Label htmlFor="공사마감임박" className="font-medium cursor-pointer">
              공사마감 1주일 전 (남은 일정 안내 표시)
            </Label>
          </div>

          {/* 남은 일정 */}
          {공사마감임박 && (
            <div>
              <div className="bg-[#E6F9FF] border rounded-md p-3 mb-3 shadow-sm">
                <h3 className="text-[#222933] text-lg font-bold text-center">남은 일정 안내</h3>
                <p className="text-center text-sm mt-1 text-gray-500">
                  {남은일정.length === 0 ? '오늘' : '이전 일정'} 기준으로 날짜가 자동 생성됩니다 (날짜 직접 수정 가능)
                </p>
              </div>

              {/* 현장별 관리 */}
              <div className="mb-3 border rounded-md p-3 bg-gray-50">
                <h4 className="font-medium mb-2">현장별 관리</h4>
                <div className="flex gap-2 mb-2">
                  <Input value={현장명} onChange={e => set현장명(e.target.value)} placeholder="현장명" className="flex-1" disabled />
                  <Button variant="outline" onClick={템플릿저장} disabled={!현장명 || 남은일정.length === 0}>
                    현재 일정 저장
                  </Button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {Object.keys(템플릿목록).length === 0 ? (
                    <p className="text-sm text-gray-500 text-center">저장된 템플릿이 없습니다</p>
                  ) : (
                    Object.entries(템플릿목록).map(([이름, 일정]) => (
                      <div key={이름} className="flex justify-between items-center p-2 bg-white rounded-md border">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => 템플릿삭제(이름)}
                            className="text-white bg-red-500 hover:bg-red-600 text-xs px-2 py-1 rounded transition-colors"
                          >
                            삭제
                          </button>
                          <span className="font-medium">{이름}</span> ({일정.length}개 항목)
                        </div>
                        <button
                          onClick={() => 템플릿불러오기(이름)}
                          className="text-blue-500 hover:text-blue-700 text-sm px-2 py-1 rounded border"
                        >
                          불러오기
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* ✅ 수정: 날짜 직접 입력 가능 (건너뛰기 지원) */}
              <div className="flex gap-2 mb-2 items-center">
                <Input
                  value={임시날짜}
                  onChange={e => set임시날짜(e.target.value)}
                  placeholder="날짜 (예: 3/20)"
                  className="w-28 text-blue-600 font-medium text-center"
                />
                <Input
                  value={임시작업}
                  onChange={e => set임시작업(e.target.value)}
                  placeholder="작업 (예: 타일)"
                  className="flex-1"
                  onKeyDown={e => e.key === 'Enter' && handle남은일정추가()}
                />
                <Button onClick={handle남은일정추가}>추가</Button>
              </div>
              <p className="text-xs text-gray-400 mb-2">
                날짜를 직접 수정해서 건너뛸 수 있어요 (자동 계산: {get다음날짜()}→직접 변경 가능)
              </p>

              {/* ✅ 수정: 기존 일정 날짜/내용 개별 수정 가능 */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {남은일정.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center">남은 일정이 없습니다</p>
                ) : (
                  남은일정.map((일정, index) => (
                    <div key={index} className="flex gap-2 items-center p-2 bg-gray-50 rounded-md">
                      <Input
                        value={일정.날짜}
                        onChange={e => handle남은일정날짜수정(index, e.target.value)}
                        className="w-20 text-sm text-center font-medium text-blue-600"
                      />
                      <span className="text-gray-400 text-sm">
                        ({get요일(일정.날짜)})
                      </span>
                      <Input
                        value={일정.작업}
                        onChange={e => handle남은일정작업수정(index, e.target.value)}
                        className="flex-1 text-sm"
                      />
                      <button
                        onClick={() => handle남은일정삭제(index)}
                        className="text-white bg-red-500 hover:bg-red-600 text-xs px-2 py-1 rounded transition-colors whitespace-nowrap"
                      >
                        삭제
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <Button onClick={generate} className="w-full active:scale-[0.98] transition">
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
