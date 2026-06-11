# 인스타그램 성향 분석 웹서비스

인스타그램 아이디를 검색하면 해시태그, 음악, 팔로잉, 활동 패턴을 분석하고 AI 성향 리포트를 제공합니다.

## 기능

- 해시태그 빈도 분석 (TOP 20, 워드클라우드)
- 릴스 음악 사용 분석 (TOP 10, 오리지널 오디오 비율)
- 팔로잉 분석 (카테고리 분포, 바이오 키워드, 주요 팔로잉, 네트워크 유형)
- 게시 시간대 히트맵
- 참여율 통계 (좋아요, 댓글, 주간 게시 빈도)
- AI 성향 리포트 (관심사 카테고리, 키워드, 페르소나 요약)
- 콘텐츠 유형 분석 (릴스/피드 비율, 유형별 참여율, 캡션 길이 인사이트)
- 캡션 톤 분석 (단어·이모지, 한영 비율, 말투)
- 리포트보내기 (공유 링크 7일, PDF 저장)
- 24시간 결과 캐싱

## 시작하기

```bash
npm install
cp .env.example .env.local
npm run dev
```

http://localhost:3000 에서 확인

## 환경 변수

| 변수 | 설명 | 필수 |
|------|------|------|
| `APIFY_TOKEN` | Apify API 토큰 | 실데이터 시 |
| `OPENAI_API_KEY` | OpenAI API 키 | AI 리포트 시 (없으면 규칙 기반) |
| `USE_MOCK_DATA` | `true`면 목 데이터 사용 | 개발용 |
| `ANALYSIS_LIMIT` | 분석 게시물 수 (기본 50) | |
| `FOLLOWING_LIMIT` | 분석 팔로잉 수 (기본 100) | |
| `CACHE_TTL_HOURS` | 캐시 유효 시간 (기본 24) | |

## 기술 스택

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Apify (인스타그램 데이터 수집)
- OpenAI (AI 성향 분석)
- SQLite + Drizzle ORM (캐싱)
- Recharts (차트)

## 프로젝트 구조

```
src/
  app/           # 페이지 및 API 라우트
  components/    # UI 컴포넌트
  lib/           # 비즈니스 로직
    apify.ts     # Apify 연동
    analyze.ts           # 게시물 통계 분석
    analyze-following.ts # 팔로잉 분석
    ai.ts                # AI 리포트
    cache.ts     # SQLite 캐싱
    db/          # Drizzle 스키마
```
