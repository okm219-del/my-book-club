// src/app/api/search/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const TTB_KEY = 'ttbokm2191436001'; // 아까 만드신 키

  if (!query) return Response.json([]);

  try {
    const res = await fetch(
      `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${TTB_KEY}&Query=${encodeURIComponent(query)}&Output=js&Version=20131101&MaxResults=5`
    );
    const data = await res.json();
    return Response.json(data.item || []);
  } catch (error) {
    return Response.json({ error: "검색 실패" }, { status: 500 });
  }
}