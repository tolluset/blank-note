export default function PagesPage() {
  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 p-8">
        <div className="w-48 h-64 bg-white rounded-lg shadow-lg absolute top-20 left-20 p-4 cursor-move hover:shadow-xl transition-shadow">
          <div className="text-xs text-gray-400 mb-2">페이지 1</div>
          <div className="text-sm text-gray-600">
            찢어진 페이지 내용...
          </div>
          <button className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">
            ×
          </button>
        </div>
        
        <div className="w-48 h-64 bg-white rounded-lg shadow-lg absolute top-40 left-80 p-4 cursor-move hover:shadow-xl transition-shadow">
          <div className="text-xs text-gray-400 mb-2">페이지 2</div>
          <div className="text-sm text-gray-600">
            또 다른 찢어진 페이지...
          </div>
          <button className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">
            ×
          </button>
        </div>
        
        <div className="w-48 h-64 bg-white rounded-lg shadow-lg absolute top-60 left-40 p-4 cursor-move hover:shadow-xl transition-shadow">
          <div className="text-xs text-gray-400 mb-2">페이지 3</div>
          <div className="text-sm text-gray-600">
            세 번째 페이지 내용...
          </div>
          <button className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">
            ×
          </button>
        </div>
      </div>
      
      <nav className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
        <button className="px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-sm">
          노트
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:shadow-lg transition-shadow text-sm">
          페이지 리스트
        </button>
        <button className="px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-sm">
          휴지통
        </button>
      </nav>
    </div>
  );
}