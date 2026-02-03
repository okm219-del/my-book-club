"use client";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
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

  const addToNotion = async (book) => {
    const res = await fetch('/api/notion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    if (res.ok) alert('✅ 노션에 추가되었습니다.');
    else alert('❌ 등록 실패');
  };

  return (
    // 배경을 노션 기본 배경색인 #FFFFFF 혹은 아주 연한 회색으로 설정
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-[#37352F]">
      <div className="max-w-2xl mx-auto">
        
        {/* 헤더: 폰트 크기를 줄이고 더 담백하게 */}
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
          <span className="text-2xl">📚</span>
          <h1 className="text-xl font-semibold tracking-tight text-[#37352F]">독서 기록 도우미</h1>
        </div>

        {/* 검색바: 노션의 검색창처럼 직사각형에 가까운 형태로 변경 */}
        <div className="relative mb-8">
          <input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchBooks()}
            className="w-full p-3 pl-4 pr-20 rounded-md border border-gray-200 bg-[#F7F6F3] focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all text-sm"
            placeholder="책 제목 또는 저자 검색..."
          />
          <button 
            onClick={searchBooks} 
            className="absolute right-2 top-1.5 bottom-1.5 bg-[#37352F] text-white px-4 rounded-md text-xs font-medium hover:bg-[#504f4a] transition-colors"
          >
            {loading ? "..." : "검색"}
          </button>
        </div>

        {/* 검색 결과 리스트 */}
        <div className="grid gap-3">
          {results.map((book) => (
            <div 
              key={book.isbn} 
              className="group flex gap-4 p-3 rounded-lg border border-gray-100 hover:bg-[#F7F6F3] transition-all"
            >
              <img 
                src={book.cover} 
                alt="cover" 
                className="w-16 h-24 object-cover rounded-sm shadow-sm border border-gray-50 flex-shrink-0" 
              />
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="font-semibold text-base text-[#37352F] truncate leading-tight mb-1">{book.title}</h3>
                  <p className="text-[#787774] text-xs truncate">
                    {book.author.replace(/\s*\(.*?\)\s*/g, "")} · {book.publisher}
                  </p>
                </div>
                
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={() => addToNotion(book)}
                    className="text-xs border border-gray-300 px-3 py-1 rounded hover:bg-white transition-all text-[#37352F] font-medium active:bg-gray-100"
                  >
                    데이터베이스에 추가
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {results.length === 0 && !loading && (
            <div className="text-center py-20 text-[#9B9A97] text-sm">
              추가하고 싶은 책을 검색해 보세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}