export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // 로그인 요청 처리
  if (url.pathname === "/__login" && request.method === "POST") {
    const formData = await request.formData();
    const password = formData.get("password");

    if (password === env.SITE_PASSWORD) {
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/",
          "Set-Cookie":
            "choigang_auth=approved; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400"
        }
      });
    }

    return new Response(loginPage(true), {
      status: 401,
      headers: {
        "Content-Type": "text/html; charset=UTF-8",
        "Cache-Control": "no-store"
      }
    });
  }

  // 이미 인증된 사람은 원래 사이트 통과
  const cookie = request.headers.get("Cookie") || "";

  if (cookie.includes("choigang_auth=approved")) {
    return next();
  }

  // 인증되지 않은 사람에게 로그인 화면 표시
  return new Response(loginPage(false), {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "no-store"
    }
  });
}

function loginPage(error) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>초이강 | Prototype</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f7f9fc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                   "Noto Sans KR", sans-serif;
      color: #172033;
    }

    .card {
      width: calc(100% - 40px);
      max-width: 420px;
      padding: 48px 38px;
      background: white;
      border-radius: 22px;
      box-shadow: 0 15px 50px rgba(0,0,0,.08);
      text-align: center;
    }

    .badge {
      display: inline-block;
      padding: 7px 13px;
      margin-bottom: 20px;
      border-radius: 999px;
      background: #eef4ff;
      color: #3568d4;
      font-size: 13px;
      font-weight: 700;
    }

    h1 {
      margin: 0 0 10px;
      font-size: 30px;
    }

    .description {
      margin: 0 0 30px;
      color: #6b7280;
      font-size: 15px;
      line-height: 1.6;
    }

    input {
      width: 100%;
      height: 52px;
      padding: 0 16px;
      border: 1px solid #d8dee9;
      border-radius: 12px;
      font-size: 16px;
      outline: none;
    }

    input:focus {
      border-color: #3975ea;
      box-shadow: 0 0 0 3px rgba(57,117,234,.1);
    }

    button {
      width: 100%;
      height: 52px;
      margin-top: 12px;
      border: 0;
      border-radius: 12px;
      background: #3975ea;
      color: white;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
    }

    button:hover {
      background: #2f65ce;
    }

    .error {
      margin: 14px 0 0;
      color: #dc2626;
      font-size: 14px;
    }

    .footer {
      margin-top: 28px;
      color: #9ca3af;
      font-size: 12px;
    }
  </style>
</head>

<body>
  <div class="card">

    <div class="badge">PROTOTYPE</div>

    <h1>초이강</h1>

    <p class="description">
      정부지원금 맞춤 추천 서비스<br>
      프로토타입 접속을 위해 비밀번호를 입력해주세요.
    </p>

    <form method="POST" action="/__login">
      <input
        type="password"
        name="password"
        placeholder="비밀번호"
        autocomplete="current-password"
        required
        autofocus
      >

      <button type="submit">
        프로토타입 접속
      </button>
    </form>

    ${error ? '<p class="error">비밀번호가 올바르지 않습니다.</p>' : ''}

    <div class="footer">
      Choigang · Graduation Project
    </div>

  </div>
</body>
</html>`;
}
