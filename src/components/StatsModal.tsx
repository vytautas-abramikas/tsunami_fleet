import { useGameContext } from "../hooks/useGameContext";

const getEmojiRepresentation = (afloat: number, sunk: number) => {
  return (
    <>
      {"✅".repeat(afloat)}
      {"❌".repeat(sunk)}
    </>
  );
};

export const StatsModal: React.FC<{}> = () => {
  const { isStatsModalVisible, stats, setIsStatsModalVisible } =
    useGameContext();
  if (!isStatsModalVisible) return null;

  const onClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsStatsModalVisible(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Battle Statistics</h2>
          <button onClick={onClose} className="text-red-500 hover:text-red-700">
            &times;
          </button>
        </div>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Player</th>
              <th className="px-4 py-2 border">Browser</th>
            </tr>
          </thead>
          <tbody>
            {stats.player.map((stat, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">{stat.name}</td>
                <td className="px-4 py-2 border">
                  {getEmojiRepresentation(stat.afloat, stat.sunk)}
                </td>
                <td className="px-4 py-2 border">
                  {getEmojiRepresentation(
                    stats.browser[index].afloat,
                    stats.browser[index].sunk
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></button>
    </div>
  );
};
