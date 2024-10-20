import { Grid } from "./Grid";

export const GameBoard: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-2 gap-24">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4 drop-shadow-lg">User</h2>
          <Grid owner="User" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4 drop-shadow-lg">Browser</h2>
          <Grid owner="Browser" />
        </div>
      </div>
    </>
  );
};
