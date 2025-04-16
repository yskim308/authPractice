import { auth } from "../../auth";

async function Username() {
  const session = await auth();

  if (!session?.user) return null;
  console.log(session);

  return (
    <div>
      <h1>email: {session.user.email}</h1>
      <h1>id?: {session.user.id}</h1>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div>
      <h1>hello from the dashboard</h1>
      <Username />
    </div>
  );
}
