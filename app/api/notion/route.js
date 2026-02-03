export async function POST(request) {
  try {
    // 1. 클라이언트로부터 데이터 받기
    let { title, author, cover, publisher } = await request.json();

    // 2. 지은이 정보에서 '(지은이)', '(옮긴이)' 등 괄호 내용 제거
    if (author) {
      author = author.replace(/\s*\(.*?\)\s*/g, "").trim();
    }

    // 3. 환경 변수에서 설정값 불러오기
    const NOTION_TOKEN = process.env.NOTION_TOKEN;
    const DATABASE_ID = process.env.NOTION_DATABASE_ID;

    // 4. 노션 API 호출
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

    // 5. 응답 결과 확인
    if (!res.ok) {
      console.error("❌ 노션 에러 발생:", result);
      return Response.json({ error: result.message }, { status: res.status });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("❌ 서버 에러:", error);
    return Response.json({ error: "서버 내부 에러" }, { status: 500 });
  }
}