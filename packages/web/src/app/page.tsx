export default function NotebookPage() {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="flex gap-2 bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="relative w-96 h-[600px] border-r border-gray-200">
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <button className="text-xs text-gray-500 hover:text-red-500">
              찢기
            </button>
          </div>
          <div className="p-8 pt-12 h-full">
            <div className="w-full h-full bg-white border border-gray-100 rounded p-4">
              <div className="text-gray-300 text-sm">
                왼쪽 페이지
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative w-96 h-[600px]">
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <button className="text-xs text-gray-500 hover:text-red-500">
              찢기
            </button>
          </div>
          <div className="p-8 pt-12 h-full">
            <div className="w-full h-full bg-white border border-gray-100 rounded p-4">
              <div className="text-gray-300 text-sm">
                오른쪽 페이지
              </div>
            </div>
          </div>
          
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-20 bg-transparent hover:bg-gray-100 hover:bg-opacity-50 cursor-pointer rounded-r flex items-center justify-center">
            <div className="text-gray-400 text-xs">›</div>
          </div>
        </div>
      </div>
      
      <nav className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button className="px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-sm">
          노트
        </button>
        <button className="px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-sm">
          페이지 리스트
        </button>
        <button className="px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-sm">
          휴지통
        </button>
      </nav>
    </div>
  );
}
