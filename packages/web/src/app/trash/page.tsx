export default function TrashPage() {
  return (
    <div className="min-h-screen bg-red-50 relative overflow-hidden">
      <div className="absolute top-8 left-8 text-2xl font-light text-red-600">
        휴지통
      </div>
      
      <div className="absolute inset-0 p-8 pt-20">
        <div className="w-48 h-64 bg-white rounded-lg shadow-lg absolute top-20 left-32 p-4 cursor-move hover:shadow-xl transition-shadow opacity-80">
          <div className="text-xs text-gray-400 mb-2">버려진 페이지 1</div>
          <div className="text-sm text-gray-600">
            삭제된 내용...
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            <button className="text-blue-400 hover:text-blue-600 text-xs">
              복원
            </button>
            <button className="text-red-500 hover:text-red-700 text-xs">
              완전삭제
            </button>
          </div>
        </div>
        
        <div className="w-48 h-64 bg-white rounded-lg shadow-lg absolute top-60 left-72 p-4 cursor-move hover:shadow-xl transition-shadow opacity-80">
          <div className="text-xs text-gray-400 mb-2">버려진 페이지 2</div>
          <div className="text-sm text-gray-600">
            삭제된 내용...
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            <button className="text-blue-400 hover:text-blue-600 text-xs">
              복원
            </button>
            <button className="text-red-500 hover:text-red-700 text-xs">
              완전삭제
            </button>
          </div>
        </div>
      </div>
      
      <nav className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
        <button className="px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-sm">
          노트
        </button>
        <button className="px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-sm">
          페이지 리스트
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded-full shadow-md hover:shadow-lg transition-shadow text-sm">
          휴지통
        </button>
      </nav>
    </div>
  );
}