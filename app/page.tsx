"use client";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchBooks = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("검색 에러:", error);
    }
    setLoading(false);
  };

  const addToNotion = async (book: any) => {
    const res = await fetch('/api/notion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    if (res.ok) alert('✅ 추가되었습니다.');
    else alert('❌ 실패');
  };

  return (
    // ✅ overflow-x-hidden으로 가로 스크롤 원천 봉쇄
    <div className="min-h-screen bg-white p-4 font-sans text-[#37352F] overflow-x-hidden">
      {/* ✅ max-w-md로 가로폭 고정 및 mx-auto로 중앙 정렬 */}
      <div className="max-w-md mx-auto w-full">
        
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
          <span className="text-xl">📚</span>
          <h1 className="text-lg font-semibold tracking-tight">독서 기록 도우미</h1>
        </div>

        <div className="relative mb-6">
          <input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchBooks()}
            className="w-full p-2.5 pl-4 pr-16 rounded-md border border-gray-200 bg-[#F7F6F3] focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm"
            placeholder="책 검색..."
          />
          <button 
            onClick={searchBooks} 
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#37352F] text-white px-3 rounded-md text-xs font-medium hover:bg-[#504f4a]"
          >
            {loading ? "..." : "검색"}
          </button>
        </div>

        <div className="grid gap-3">
          {results.map((book: any) => (
            <div 
              key={book.isbn} 
              // ✅ w-full과 flex-nowrap으로 내부 요소가 밖으로 나가지 않게 설정
              className="flex gap-3 p-3 rounded-lg border border-gray-100 hover:bg-[#F7F6F3] transition-all w-full overflow-hidden"
            >
              <img 
                src={book.cover} 
                alt="cover" 
                className="w-14 h-20 object-cover rounded-sm shadow-sm border border-gray-50 flex-shrink-0" 
              />
              <div className="flex-1 flex flex-col justify-between min-w-0"> {/* ✅ min-w-0이 있어야 truncate가 작동함 */}
                <div>
                  {/* ✅ truncate 클래스가 긴 제목을 '...'으로 바꿔줌 */}
                  <h3 className="font-semibold text-sm text-[#37352F] truncate mb-0.5" title={book.title}>
                    {book.title}
                  </h3>
                  <p className="text-[#787774] text-[11px] truncate">
                    {book.author?.replace(/\s*\(.*?\)\s*/g, "")} · {book.publisher}
                  </p>
                </div>
                
                <div className="flex justify-end mt-1">
                  <button 
                    onClick={() => addToNotion(book)}
                    className="text-[10px] border border-gray-300 px-2 py-1 rounded hover:bg-white text-[#37352F] font-medium active:bg-gray-100"
                  >
                    추가
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {results.length === 0 && !loading && (
            <div className="text-center py-10 text-[#9B9A97] text-xs font-light">
              책을 검색하면 여기에 표시됩니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}