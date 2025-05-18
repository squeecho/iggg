'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Checkbox } from '@/components/ui/checkbox'

const 카테고리공정 = {
  '기초': ['철거', '자재 입고', '가설', '보양', '폐기물처리'],
  '본공사1': ['목공', '전기', '금속', '설비', '방수', '양생', '도장', '필름', '타일', '덕트', '잔마무리', '준공 청소'],
  '본공사2': ['도배', '데코타일', '바닥마루', '아트미장'],
  '외주': ['에어컨', '간판', '주방 입고', '가스', '온수기 설치', '의탁자 입고', 'CCTV', '소방']
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
  
  // 공사마감 관련 상태 추가
  const [공사마감임박, set공사마감임박] = useState(false)
  const [현장별남은일정, set현장별남은일정] = useState<{[key: string]: { 날짜: string; 작업: string }[]}>({})
  const [남은일정, set남은일정] = useState<{ 날짜: string; 작업: string }[]>([])
  const [임시작업, set임시작업] = useState('')
  
  // 템플릿 관련 상태 추가
  const [템플릿목록, set템플릿목록] = useState<{[key: string]: { 날짜: string; 작업: string }[]}>({})
  const [템플릿명, set템플릿명] = useState('')
  
  // useRef로 현재 남은일정 상태를 추적
  const 남은일정Ref = useRef(남은일정)
  // 일정 변경 출처 추적
  const isLocalUpdate = useRef(false)

  useEffect(() => {
    남은일정Ref.current = 남은일정
    // 로컬 업데이트가 아닌 경우(현장 변경으로 인한 업데이트)는 무시
    if (!isLocalUpdate.current && 현장명) {
      // 현재 현장의 일정이 변경되면 현장별 일정에도 반영
      const 업데이트된현장별일정 = {
        ...현장별남은일정,
        [현장명]: 남은일정
      }
      set현장별남은일정(업데이트된현장별일정)
      localStorage.setItem('현장별남은일정', JSON.stringify(업데이트된현장별일정))
    }
    isLocalUpdate.current = false
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
      // 현재 선택된 현장의 일정 불러오기
      if (sn && 저장된일정[sn]) {
        isLocalUpdate.current = true // 초기 로딩은 로컬 업데이트로 표시
        set남은일정(저장된일정[sn])
      }
    }
    if (tp) {
      set템플릿목록(JSON.parse(tp))
    }
  }, [])

  useEffect(() => {
    if (현장명) {
      isLocalUpdate.current = true // 현장 변경에 의한 업데이트
      if (현장별남은일정[현장명]) {
        set남은일정(현장별남은일정[현장명])
      } else {
        set남은일정([])
      }
      
      // 현장명이 변경되면 템플릿명도 같은 값으로 설정
      set템플릿명(현장명)
    }
  }, [현장명])

  useEffect(() => {
    localStorage.setItem('현장명', 현장명)
  }, [현장명])

  useEffect(() => {
    localStorage.setItem('현장목록', JSON.stringify(현장목록))
  }, [현장목록])
  
  useEffect(() => {
    localStorage.setItem('공사마감임박', JSON.stringify(공사마감임박))
  }, [공사마감임박])

  useEffect(() => {
    localStorage.setItem('템플릿목록', JSON.stringify(템플릿목록))
  }, [템플릿목록])
  
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
    // 현장을 삭제할 때 해당 현장의 일정도 함께 삭제
    const 업데이트된현장별일정 = {...현장별남은일정}
    delete 업데이트된현장별일정[h]
    set현장별남은일정(업데이트된현장별일정)
    localStorage.setItem('현장별남은일정', JSON.stringify(업데이트된현장별일정))
    
    set현장목록(현장목록.filter(x => x !== h))
    if (현장명 === h) set현장명('')
    show('현장명이 삭제되었습니다.')
  }
  
  // 다음 날짜 계산 함수
  const get다음날짜 = () => {
    if (남은일정.length === 0) {
      // 첫 일정은 내일 날짜
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}`
    } else {
      // 이후 일정은 이전 일정 날짜 + 1일
      const 마지막일정 = 남은일정[남은일정.length - 1]
      const [월, 일] = 마지막일정.날짜.split('/').map(Number)
      
      const 다음날짜 = new Date()
      다음날짜.setMonth(월 - 1) // JavaScript에서 월은 0부터 시작하므로 -1
      다음날짜.setDate(일)
      다음날짜.setDate(다음날짜.getDate() + 1) // 하루 추가
      
      return `${다음날짜.getMonth() + 1}/${다음날짜.getDate()}`
    }
  }
  
  // 요일 구하기 함수
  const get요일 = (날짜문자열: string) => {
    const [월, 일] = 날짜문자열.split('/').map(Number)
    const date = new Date()
    date.setMonth(월 - 1)
    date.setDate(일)
    
    const 요일 = ['일', '월', '화', '수', '목', '금', '토']
    return 요일[date.getDay()]
  }
  
  const handle남은일정추가 = () => {
    if (!임시작업) {
      show('작업 내용을 입력해주세요.')
      return
    }
    
    if (!현장명) {
      show('현장을 먼저 선택해주세요.')
      return
    }
    
    const 다음날짜 = get다음날짜()
    const 새일정 = [...남은일정, { 날짜: 다음날짜, 작업: 임시작업 }]
    
    // 로컬 업데이트 플래그 설정
    isLocalUpdate.current = false
    set남은일정(새일정)
    
    // 현장별 일정에도 직접 저장
    const 업데이트된현장별일정 = {
      ...현장별남은일정,
      [현장명]: 새일정
    }
    set현장별남은일정(업데이트된현장별일정)
    localStorage.setItem('현장별남은일정', JSON.stringify(업데이트된현장별일정))
    
    set임시작업('')
    show('남은 일정이 추가되었습니다.')
  }
  
  const handle남은일정삭제 = (index: number) => {
    const 새일정 = 남은일정.filter((_, i) => i !== index)
    
    // 로컬 업데이트 플래그 설정
    isLocalUpdate.current = false
    set남은일정(새일정)
    
    // 현장별 일정에도 직접 저장
    if (현장명) {
      const 업데이트된현장별일정 = {
        ...현장별남은일정,
        [현장명]: 새일정
      }
      set현장별남은일정(업데이트된현장별일정)
      localStorage.setItem('현장별남은일정', JSON.stringify(업데이트된현장별일정))
    }
    
    show('일정이 삭제되었습니다.')
  }
  
  // 템플릿 저장 함수
  const 템플릿저장 = () => {
    if (!현장명) {
      show('현장을 먼저 선택해주세요.')
      return
    }
    
    if (남은일정.length === 0) {
      show('저장할 일정이 없습니다.')
      return
    }
    
    const 업데이트된템플릿목록 = {
      ...템플릿목록,
      [현장명]: [...남은일정]
    }
    
    set템플릿목록(업데이트된템플릿목록)
    localStorage.setItem('템플릿목록', JSON.stringify(업데이트된템플릿목록))
    show(`"${현장명}" 템플릿이 저장되었습니다.`)
  }
  
  // 템플릿 불러오기 함수
  const 템플릿불러오기 = (이름: string) => {
    if (!현장명) {
      show('현장을 먼저 선택해주세요.')
      return
    }
    
    if (!템플릿목록[이름]) {
      show('템플릿을 찾을 수 없습니다.')
      return
    }
    
    // 오늘 날짜 기준으로 일정 날짜 재계산
    const today = new Date()
    const 재계산된일정 = 템플릿목록[이름].map((일정, index) => {
      const newDate = new Date(today)
      newDate.setDate(today.getDate() + index)
      return {
        날짜: `${newDate.getMonth() + 1}/${newDate.getDate()}`,
        작업: 일정.작업
      }
    })
    
    // 남은 일정 업데이트
    isLocalUpdate.current = false
    set남은일정(재계산된일정)
    
    // 현장별 일정에도 저장
    const 업데이트된현장별일정 = {
      ...현장별남은일정,
      [현장명]: 재계산된일정
    }
    set현장별남은일정(업데이트된현장별일정)
    localStorage.setItem('현장별남은일정', JSON.stringify(업데이트된현장별일정))
    
    show(`"${이름}" 템플릿을 불러왔습니다.`)
  }
  
  // 템플릿 삭제 함수
  const 템플릿삭제 = (이름: string) => {
    const 업데이트된템플릿목록 = {...템플릿목록}
    delete 업데이트된템플릿목록[이름]
    
    set템플릿목록(업데이트된템플릿목록)
    localStorage.setItem('템플릿목록', JSON.stringify(업데이트된템플릿목록))
    show(`"${이름}" 템플릿이 삭제되었습니다.`)
  }
  
  // 다른 현장의 일정 가져오기
  const 다른현장일정가져오기 = (소스현장: string) => {
    if (!현장명) {
      show('현재 현장을 먼저 선택해주세요.')
      return
    }
    
    if (!현장별남은일정[소스현장]) {
      show('해당 현장의 일정이 없습니다.')
      return
    }
    
    const 소스일정 = 현장별남은일정[소스현장]
    
    // 오늘 날짜 기준으로 일정 날짜 재계산
    const today = new Date()
    const 재계산된일정 = 소스일정.map((일정, index) => {
      const newDate = new Date(today)
      newDate.setDate(today.getDate() + index)
      return {
        날짜: `${newDate.getMonth() + 1}/${newDate.getDate()}`,
        작업: 일정.작업
      }
    })
    
    // 남은 일정 업데이트
    isLocalUpdate.current = false
    set남은일정(재계산된일정)
    
    // 현장별 일정에도 저장
    const 업데이트된현장별일정 = {
      ...현장별남은일정,
      [현장명]: 재계산된일정
    }
    set현장별남은일정(업데이트된현장별일정)
    localStorage.setItem('현장별남은일정', JSON.stringify(업데이트된현장별일정))
    
    show(`"${소스현장}" 현장의 일정을 가져왔습니다.`)
  }

  const generate = () => {
    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '.')
    
    let txt = `안녕하세요! 
[${dateStr}] 
[${현장명}] 공사 보고드립니다.🙂

■ 오늘 작업: ${오늘공정.join(', ')}  
■ ${다음작업일정} 작업: ${내일공정.join(', ')} 예정

* ${특이사항}`

    // 남은 일정 안내 추가
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
          
          {/* 공사마감 임박 */}
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
                  {남은일정.length === 0 ? '오늘' : '이전 일정'} 기준으로 자동으로 날짜가 생성됩니다
                </p>
              </div>
              
              {/* 현장별 관리 */}
              <div className="mb-3 border rounded-md p-3 bg-gray-50">
                <h4 className="font-medium mb-2">현장별 관리</h4>
                
                <div className="flex gap-2 mb-2">
                  <Input
                    value={현장명}
                    onChange={e => set현장명(e.target.value)}
                    placeholder="현장명"
                    className="flex-1"
                    disabled
                  />
                  <Button 
                    variant="outline" 
                    onClick={템플릿저장}
                    disabled={!현장명 || 남은일정.length === 0}
                  >
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
                            title="템플릿 삭제"
                          >
                            삭제
                          </button>
                          <span className="font-medium">{이름}</span> ({일정.length}개 항목)
                        </div>
                        <div>
                          <button 
                            onClick={() => 템플릿불러오기(이름)} 
                            className="text-blue-500 hover:text-blue-700 text-sm px-2 py-1 rounded border"
                          >
                            불러오기
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* 일정 추가 */}
              <div className="flex gap-2 mb-2 items-center">
                {남은일정.length === 0 ? (
                  <div className="text-blue-600 font-medium min-w-[90px] text-center">
                    {(() => {
                      const tomorrow = new Date()
                      tomorrow.setDate(tomorrow.getDate() + 1)
                      const month = tomorrow.getMonth() + 1
                      const date = tomorrow.getDate()
                      const 요일 = ['일', '월', '화', '수', '목', '금', '토'][tomorrow.getDay()]
                      return `${month}/${date}(${요일})`
                    })()}
                  </div>
                ) : (
                  <div className="text-blue-600 font-medium min-w-[90px] text-center">
                    {(() => {
                      const 마지막일정 = 남은일정[남은일정.length - 1]
                      const [월, 일] = 마지막일정.날짜.split('/').map(Number)
                      const 다음날짜 = new Date()
                      다음날짜.setMonth(월 - 1)
                      다음날짜.setDate(일)
                      다음날짜.setDate(다음날짜.getDate() + 1)
                      const 요일 = ['일', '월', '화', '수', '목', '금', '토'][다음날짜.getDay()]
                      return `${다음날짜.getMonth() + 1}/${다음날짜.getDate()}(${요일})`
                    })()}
                  </div>
                )}
                <Input
                  value={임시작업}
                  onChange={e => set임시작업(e.target.value)}
                  placeholder="작업 (예: 타일)"
                  className="flex-1"
                />
                <Button onClick={handle남은일정추가}>추가</Button>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {남은일정.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center">남은 일정이 없습니다</p>
                ) : (
                  남은일정.map((일정, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                      <div>
                        <span className="font-medium">{일정.날짜}{get요일(일정.날짜) && `(${get요일(일정.날짜)})`}</span> - {일정.작업}
                      </div>
                      <button 
                        onClick={() => handle남은일정삭제(index)} 
                        className="text-white bg-red-500 hover:bg-red-600 text-xs px-2 py-1 rounded transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

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