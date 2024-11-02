import React from "react";

export const Copyright: React.FC = React.memo(() => {
  // console.log("Copyright");
  return (
    <p className="fixed bottom-0 right-0 m-4 text-sm text-blue-200">
      Tsunami Fleet &copy; 2024 by Vytautas Abramikas
    </p>
  );
});
