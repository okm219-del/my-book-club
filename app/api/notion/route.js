export async function POST(request) {
  try {
    const { title, author, cover, publisher } = await request.json();

    // ⛔ 절대 토큰을 직접 적지 마세요! 아래처럼 process.env를 사용해야 합니다.
    const NOTION_TOKEN = process.env.NOTION_TOKEN;
    const DATABASE_ID = process.env.NOTION_DATABASE_ID;

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
          "제목": { title: [{ text: { content: title || "제목 없음" } }] },
          "지은이": { rich_text: [{ text: { content: author || " " } }] },
          "출판사": { rich_text: [{ text: { content: publisher || " " } }] },
          "표지": { files: [{ name: "Cover", external: { url: cover || "" } }] },
        },
      }),
    });

    const result = await res.json();
    
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