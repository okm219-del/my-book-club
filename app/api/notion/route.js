export async function POST(request) {
  try {
    // 1. 클라이언트로부터 도서 정보 받기
    let { title, author, cover, publisher } = await request.json();

    // 2. 지은이 이름에서 '(지은이)', '(옮긴이)' 등 괄호 문구와 앞뒤 공백 제거
    // 예: "김화진 (지은이)" -> "김화진"
    if (author) {
      author = author.replace(/\s*\(.*?\)\s*/g, "").trim();
    }

    // 3. Vercel 환경 변수에서 토큰과 ID 불러오기
    // ⛔ 직접 코드를 적지 않고 시스템 변수를 사용하여 보안을 유지합니다.
    const NOTION_TOKEN = process.env.NOTION_TOKEN;
    const DATABASE_ID = process.env.NOTION_DATABASE_ID;

    // 4. 노션 API 호출 (페이지 생성)
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties: {
          "제목": {
            title: [
              {
                text: { content: title || "제목 없음" },
              },
            ],
          },
          "지은이": {
            rich_text: [
              {
                text: { content: author || " " },
              },
            ],
          },
          "출판사": {
            rich_text: [
              {
                text: { content: publisher || " " },
              },
            ],
          },
          "표지": {
            files: [
              {
                name: "Cover",
                external: {
                  url: cover || "",
                },
              },
            ],
          },
        },
      }),
    });

    const result = await res.json();

    // 5. 노션 API 응답 확인
    if (!res.ok) {
      console.error("❌ 노션 API 에러:", result);
      return Response.json({ error: result.message }, { status: res.status });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("❌ 서버 내부 에러:", error);
    return Response.json({ error: "서버 에러가 발생했습니다." }, { status: 500 });
  }
}