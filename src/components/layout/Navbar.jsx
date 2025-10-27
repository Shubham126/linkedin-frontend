export default function Navbar({ onMenuClick }) {
  return (
    <div className="sticky top-0 z-10 flex h-16 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <button
        onClick={onMenuClick}
        className="lg:hidden -ml-2 mr-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
      >
        <span className="text-2xl">☰</span>
      </button>

      <div className="flex flex-1 items-center justify-between">
        <div className="flex-1" />
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
              U
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
