"use client";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBooks = async () => {
    if (!query) return;
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  const addToNotion = async (book: any) => {
    const res = await fetch('/api/notion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    if (res.ok) alert('✅ 노션에 성공적으로 담았습니다!');
    else alert('❌ 등록 실패!');
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] p-6 font-sans text-[#37352F]">
      <div className="max-w-xl mx-auto">
        {/* 헤더 부분 */}
        <div className="flex items-center gap-3 mb-8 ml-1">
          <span className="text-4xl">📚</span>
          <h1 className="text-2xl font-bold tracking-tight">북클럽 책 등록 위젯</h1>
        </div>

        {/* 검색바 디자인 */}
        <div className="relative mb-10 shadow-sm group">
          <input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchBooks()}
            className="w-full p-4 pl-5 pr-24 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-lg"
            placeholder="책 제목을 입력 후 엔터..."
          />
          <button 
            onClick={searchBooks} 
            className="absolute right-2 top-2 bottom-2 bg-[#2383E2] text-white px-6 rounded-full font-bold hover:bg-[#1A63AD] transition-colors"
          >
            {loading ? "..." : "검색"}
          </button>
        </div>

        {/* 검색 결과 리스트 */}
        <div className="space-y-4">
          {results.map((book: any) => (
            <div 
              key={book.isbn} 
              className="bg-white p-5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 flex gap-5 items-center transition-transform hover:scale-[1.01]"
            >
              <img 
                src={book.cover} 
                alt="cover" 
                className="w-24 h-36 object-cover rounded-lg shadow-md flex-shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl truncate mb-1 text-[#2B3674]">{book.title}</h3>
                <p className="text-[#707EAE] text-sm mb-1">{book.author} (지은이)</p>
                <p className="text-[#05CD99] font-medium text-sm mb-4">〈{book.publisher}〉</p>
                
                <div className="flex justify-end">
                  <button 
                    onClick={() => addToNotion(book)}
                    className="bg-[#42BA61] text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-[#369B50] transition-all shadow-md active:scale-95"
                  >
                    노션에 추가
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {results.length === 0 && !loading && (
            <div className="text-center py-20 text-gray-400">
              검색 결과가 여기에 표시됩니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}