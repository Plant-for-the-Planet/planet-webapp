import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../src/features/common/Layout';
import LeaderBoard from '../src/tenants/planet/LeaderBoard'
import tenantConfig from '../tenant.config';
import { getRequest } from '../src/utils/apiRequests/api';
import GetLeaderboardMeta from './../src/utils/getMetaTags/GetLeaderboardMeta'
const config = tenantConfig();

export default function Home() {
  const router = useRouter();

  const [leaderboard, setLeaderboard] = React.useState(null);
  console.log(leaderboard);

  React.useEffect(() => {
    async function loadLeaderboard() {
      const newLeaderboard = await getRequest('/app/leaderboard');
      setLeaderboard(newLeaderboard);
    }
    loadLeaderboard();
  }, []);

  let AllPage;
  function getAllPage() {
    switch (process.env.TENANT) {
      case 'planet':
        AllPage = <LeaderBoard leaderboard={leaderboard} />;
        return AllPage;
      default:
        AllPage = null;
        return AllPage;
    }
  }

  return (
    <>
      <GetLeaderboardMeta/>
      <Layout>{getAllPage()}</Layout>
    </>
  );
}