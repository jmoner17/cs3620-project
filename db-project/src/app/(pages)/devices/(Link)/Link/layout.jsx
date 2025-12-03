export default function Layout({ children }) {
  
    return (
      <div className="min-h-screen flex flex-col">
        {/* Main content area */}
        <div className="flex-grow container mx-auto px-4 py-12">
          {children}
        </div>
      </div>
    )
  }