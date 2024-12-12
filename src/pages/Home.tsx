import { useUser } from "../contexts/UserContexts";

import Events from "./Events";

const HomePage = () => {
  const { user } = useUser();
  return (
    <div className="h-full bg-slate-200">
      <Events />
    </div>
  );
};

export default HomePage;
