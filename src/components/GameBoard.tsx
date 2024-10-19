import { Grid } from "./Grid";

export const GameBoard: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-2 gap-36">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-4">User</h2>
          <Grid owner="User" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-4">Browser</h2>
          <Grid owner="Browser" />
        </div>
      </div>
    </>
  );
};
