export const App: React.FC = () => {
  return (
    <>
      <main className="bg-gradient-to-r from-purple-500 to-blue-900 text-white flex flex-col items-center justify-center min-h-screen overflow-hidden">
        <h1 className="text-4xl font-bold mb-8 text-yellow-300">A message</h1>
        <div className="grid grid-cols-2 gap-36">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold mb-4">User</h2>
            <div id="user-grid" className="grid grid-cols-10 gap-1"></div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold mb-4">Browser</h2>
            <div id="browser-grid" className="grid grid-cols-10 gap-1"></div>
          </div>
        </div>
      </main>
    </>
  );
};
