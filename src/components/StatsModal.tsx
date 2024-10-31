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

  const onClose = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsStatsModalVisible(false);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="relative z-40">
          <div className="bg-blue-500 p-6 shadow-lg">
            <div className="flex justify-center items-center mb-4">
              <h2 className="text-xl font-bold">Fleet Comparison</h2>
            </div>
            <table className="table-auto">
              <thead>
                <tr>
                  <th className="px-2 py-2 text-center">Ship size</th>
                  <th className="px-2 py-2 text-center">Player</th>
                  <th className="px-2 py-2 text-center">Browser</th>
                </tr>
              </thead>
              <tbody>
                {stats.player.map((stat, index) => (
                  <tr key={index}>
                    <td className="px-2 py-2 text-center">{stat.size}</td>
                    <td className="px-2 py-2 text-center">
                      {getEmojiRepresentation(stat.afloat, stat.sunk)}
                    </td>
                    <td className="px-2 py-2 text-center">
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
        </div>
        <div
          className="fixed inset-0 bg-black opacity-30 z-30"
          onClick={onClose}
        ></div>
      </div>
    </>
  );
};
