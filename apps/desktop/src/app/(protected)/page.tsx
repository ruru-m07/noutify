import { auth } from "@/auth";
import Inbox from "@/components/pages/inbox";

const HomePage = async () => {
  const session = await auth();

  console.log({
    session,
  });

  return <Inbox />;
};

export default HomePage;
