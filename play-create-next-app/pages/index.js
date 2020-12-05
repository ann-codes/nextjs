import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home({ launches }) {
  // console.log("DATA", launches);
  const listLaunches = launches.map((launch) => (
    <a
      key={launch.id}
      href={launch.links.video_link}
      className={styles.card}
      target="_blank"
      rel="noreferrer"
    >
      <h3>{launch.mission_name}</h3>
      <ul>
        <li>
          <strong>Date: </strong>
          {new Date(launch.launch_date_local).toDateString("en-US")}
        </li>
        <li>
          <strong>Rocket: </strong>
          {launch.rocket.rocket_name}
        </li>
        <li>
          <strong>Site: </strong>
          {launch.launch_site.site_name_long}
        </li>
      </ul>
      <p>{}</p>
    </a>
  ));

  return (
    <div className={styles.container}>
      <Head>
        <title>SpaceX Launches</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>SpaceX Launches</h1>
        <p className={styles.description}>The latest launches:</p>
        <div className={styles.grid}>{listLaunches}</div>
      </main>
      <footer className={styles.footer}>This is a footer, yay!</footer>
    </div>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://api.spacex.land/graphql/",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 20) {
          id
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
          }
        }
      }
    `,
  });

  return {
    props: {
      launches: data.launchesPast,
    },
  };
}
