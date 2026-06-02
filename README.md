# 🚢 CSR 바로가기 - 배포 가이드

회사 동료들이 **로그인 없이** 사용할 수 있는 사이트로 배포하는 방법입니다.

---

## 📋 사전 준비

- 이메일 계정 (Gmail, 네이버 등 무관)
- 1시간 정도 시간
- **비용: 전부 무료** ✨

---

## 1️⃣ Supabase 가입 및 프로젝트 만들기 (5분)

Supabase는 데이터를 저장하는 클라우드 데이터베이스입니다.

### 가입
1. https://supabase.com 접속
2. 우상단 **Start your project** 클릭
3. GitHub 또는 이메일로 가입

### 새 프로젝트 만들기
1. **New Project** 클릭
2. 입력:
   - **Name**: `csr-bookmarks` (원하는 이름)
   - **Database Password**: 강력한 비밀번호 (꼭 저장!)
   - **Region**: `Northeast Asia (Seoul)` 선택
3. **Create new project** 클릭
4. 약 2분 기다리기

---

## 2️⃣ 데이터베이스 테이블 만들기 (5분)

### 테이블 생성
1. Supabase 프로젝트 화면 왼쪽 메뉴에서 **SQL Editor** 클릭
2. 아래 SQL을 그대로 복사해서 붙여넣기:

```sql
-- 북마크 테이블 생성
create table bookmarks (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

-- 누구나 읽기/쓰기 가능하게 (로그인 불필요)
alter table bookmarks enable row level security;

create policy "Allow public read"
  on bookmarks for select
  to anon
  using (true);

create policy "Allow public insert"
  on bookmarks for insert
  to anon
  with check (true);

create policy "Allow public update"
  on bookmarks for update
  to anon
  using (true);

-- Realtime 활성화 (실시간 동기화용)
alter publication supabase_realtime add table bookmarks;
```

3. 우측 하단 **RUN** 버튼 클릭
4. ✅ "Success" 표시되면 성공!

### API 키 복사하기
1. 왼쪽 메뉴 **Project Settings** (⚙️ 아이콘) → **API**
2. 다음 두 가지를 메모장에 복사해 두세요:
   - **Project URL** (예: `https://abcdefgh.supabase.co`)
   - **anon public** 키 (긴 문자열)

---

## 3️⃣ GitHub에 코드 올리기 (10분)

### GitHub 가입 (이미 있으면 건너뛰기)
1. https://github.com 가입

### 저장소 만들기
1. 우상단 **+** → **New repository**
2. **Repository name**: `csr-bookmarks`
3. **Public** 선택 (Private도 가능하지만 Netlify 무료 연동에는 Public 추천)
4. **Create repository**

### 코드 업로드
가장 쉬운 방법은 **드래그 앤 드롭**:

1. 빈 저장소 화면에서 **uploading an existing file** 링크 클릭
2. `csr-bookmarks-app` 폴더의 **모든 파일과 폴더**를 드래그 앤 드롭
   - `package.json`, `vite.config.js`, `index.html`, `netlify.toml`, `.gitignore`, `.env.example`
   - `src/` 폴더 (App.jsx, main.jsx, supabase.js 포함)
3. **Commit changes** 클릭

⚠️ **`.env` 파일은 절대 올리지 마세요!** (API 키가 노출됨)

---

## 4️⃣ Netlify에 배포 (10분)

### 가입
1. https://netlify.com 접속
2. **Sign up** → **GitHub로 가입** 선택

### 사이트 만들기
1. 대시보드에서 **Add new site** → **Import an existing project**
2. **Deploy with GitHub** 선택
3. GitHub 권한 승인
4. `csr-bookmarks` 저장소 선택
5. 빌드 설정 (자동 인식됨):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### 환경변수 등록 (중요!)
배포 전에 환경변수를 먼저 설정합니다:

1. **Site configuration** → **Environment variables** → **Add a variable**
2. 두 개를 등록:

| Key | Value |
|---|---|
| `VITE_SUPABASE_URL` | Supabase에서 복사한 Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase에서 복사한 anon public 키 |

3. **Save** 클릭

### 배포 실행
1. **Deploys** 탭 → **Trigger deploy** → **Deploy site**
2. 약 1~2분 기다리기
3. ✅ Published 상태가 되면 배포 완료!

### 사이트 주소 확인
- 화면 상단에 `https://랜덤이름.netlify.app` 형태의 주소가 표시됩니다
- 이게 동료들에게 공유할 **최종 링크**입니다!

---

## 5️⃣ 사이트 이름 바꾸기 (선택)

기본 주소는 무작위 이름인데, 원하는 이름으로 바꿀 수 있습니다:

1. **Site configuration** → **Change site name**
2. 예: `csr-bookmarks` → 최종 주소: `https://csr-bookmarks.netlify.app`

---

## 6️⃣ 회사 도메인 연결 (선택, 10분)

회사 도메인이 있다면 `bookmarks.회사명.com` 같은 주소로 변경 가능:

1. Netlify **Domain management** → **Add a domain**
2. 도메인 입력 후 안내에 따라 DNS 설정
3. SSL 인증서 자동 발급

---

## ✅ 완료 체크리스트

- [ ] Supabase 프로젝트 생성됨
- [ ] `bookmarks` 테이블 생성 및 정책 설정됨
- [ ] API URL, anon key 복사해 둠
- [ ] GitHub에 코드 업로드됨
- [ ] Netlify에 환경변수 등록됨
- [ ] 배포 완료, 사이트 접속 가능
- [ ] 동료에게 링크 공유 후 데이터 동기화 테스트

---

## 🆘 문제 해결

### "Failed to fetch" 또는 빈 화면이 뜨면
- Netlify 환경변수가 제대로 등록됐는지 확인
- 환경변수 변경 후 **Trigger deploy → Deploy site**로 재배포 필요

### 데이터가 저장 안 되면
- Supabase SQL Editor에서 다음 실행으로 테이블 확인:
  ```sql
  select * from bookmarks;
  ```
- 정책(Policy) 설정이 제대로 됐는지 확인

### 실시간 동기화가 안 되면
- 마지막 SQL `alter publication supabase_realtime add table bookmarks;` 실행 확인

---

## 🎉 사용 방법

배포 완료 후:

1. **누구나** Netlify 링크로 접속 (로그인 불필요)
2. 사이트 추가/편집/삭제 → **자동 저장**
3. 다른 사람도 같은 링크 보면 **실시간 반영**
4. 휴대폰에서도 동일하게 동작

축하합니다! 🎊 이제 진짜 회사 사내 도구로 사용 가능합니다.
