import {
  Card,
  Center,
  Container,
  Footer,
  Grid,
  Header,
  Hero,
  Navbar,
  Page,
  Progress,
  Responsive,
} from "decentraland-ui";
import "decentraland-ui/lib/styles.css";
import React, { useEffect, useState } from "react";

import { Line } from "react-chartjs-2";

function niceNumber(n: number): string {
  const parts = [];
  while (n > 1) {
    const what = Math.floor(n % 1000).toFixed(0);
    parts.push(what.padStart(3, "0"));
    n = n / 1000;
  }
  parts.reverse();
  parts[0] = parts[0].replace(/^0+/g, "");
  return parts.join(",");
}

function App() {
  const [timeSummary, setTimeSummary] = useState(
    [] as { burned: string; timestamp: string }[]
  );
  const [latest, setLatest] = useState({
    burned: "607967028124150287041826048",
    supply: "2197919365034152513924741837",
  });
  useEffect(() => {
    fetch("https://api.thegraph.com/subgraphs/name/eordano/manaboard", {
      headers: {
        "content-type": "application/json",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
      body:
        '{"query":"{\\n  timeSummaries(first: 500\\n) {\\n    id\\n    timestamp\\n    burned\\n  }\\n  latests(first: 5) {\\n    id\\n    supply\\n    burned\\n  }\\n}\\n","variables":null}',
      method: "POST",
      mode: "cors",
      credentials: "omit",
    })
      .then((res) => res.json())
      .then((res) => {
        setLatest((res as any).data.latests[0]);
        setTimeSummary((res as any).data.timeSummaries);
      });
  }, []);
  const { burned, supply } = latest;
  const total = +burned / 1e18 + +supply / 1e18;
  const percent = (+burned * 100) / 1e18 / total;
  const minTablet = 650;
  const minDesktop = 920;
  return (
    <div className="container">
      <Navbar isFullscreen />
      <Page isFullscreen>
        <Hero>
          <div style={{ height: "400px" }}>&nbsp;</div>
          <Center>
            <Header size="huge">{niceNumber(+burned / 1e18)}</Header>
            <p>
              MANA was Burned out of the original {niceNumber(total)} supply
              <Progress
                precision={2}
                value={percent}
                total={100}
                style={{ marginTop: "20px" }}
                indicating={true}
                success={true}
              />
            </p>
            <Header size="huge">{niceNumber(1370172956)}</Header>
            <p>
              Circulating out of the {niceNumber(+supply / 1e18)} current total
              supply
              <Progress
                precision={2}
                value={1370172956}
                total={+supply / 1e18}
                style={{ marginTop: "20px" }}
                indicating={true}
                success={true}
              />
            </p>
          </Center>
        </Hero>
        <Container>
          <Responsive maxWidth={minTablet}>
            <Grid columns="1" centered>
              {MakeCard("MANA Burned", percent)}
              {Content(timeSummary)}
            </Grid>
          </Responsive>
          <Responsive minWidth={minTablet + 1} maxWidth={minDesktop - 1}>
            <Grid columns="2" centered>
              {Content(timeSummary)}
            </Grid>
          </Responsive>
          <Responsive minWidth={minDesktop}>
            <Grid columns="3" centered>
              {Content(timeSummary)}
            </Grid>
          </Responsive>
        </Container>
        <div style={{ height: "100px" }}>&nbsp;</div>
      </Page>
      <Footer isFullscreen />
    </div>
  );
}

function Content(latest: any) {
  if (!latest.length) {
    console.log('asdas')
    latest = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((_, index) => ({burned: '' + Math.random() * 100000000000000, timestamp: index * 15456456000}));
  }
  const graphValues = latest
    // .filter(
    //   (_: any) => now - new Date(+_.timestamp * 1000).getTime() < TWO_WEEKS
    // )
    .sort((_: any, $: any) => +_.timestamp - +$.timestamp)
    .map((_: any) => [
      +_.burned / 1e18,
      new Date(+_.timestamp * 1000).toISOString().slice(0, 10),
    ]);
  const data = {
    labels: graphValues.map((_: any) => _[1]),
    datasets: [
      {
        label: "Marketplace Volume (MANA)",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: graphValues.map((_: any) => _[0]),
      },
    ],
  };
  return (
    <>
      {MakeCard(
        "What does this mean?",
        "MANA was initially created to be deflationary. Initially, the supply of 2,805,886,393 was burned in the Terraform event, the second auction, and the DAO creation. But there are other ways in which MANA gets burned."
      )}
      {MakeCard(
        "How does MANA get burn?",
        "Any activity on the marketplace charges a 2.5% fee on the sale (payed by the seller). This means that the amount of MANA burned is directly tied to the activity of the platform."
      )}
      {MakeCard(
        "What happens with the MANA burned?",
        "It gets taken out of circulation, and nobody can use it"
      )}
      <Grid.Column width={16}>
        <Card fluid>
          <Card.Content>
            <Card.Header>
              <h3>Graphs</h3>
            </Card.Header>
            <Card.Meta>
              <form>
                <select>
                  <option>All assets</option>
                  <option>LAND + Estates</option>
                  <option>Wearables</option>
                  <option>Names</option>
                  <option>Other assets</option>
                </select>
                <select>
                  <option>Per day</option>
                  <option>Per week</option>
                  <option>Per month</option>
                </select>
                <select>
                  <option>Options</option>
                  <option>Show marketplace volume value</option>
                  <option>Show burned MANA value</option>
                  <option>Show values in USD</option>
                </select>
              </form>
              <Line data={data} />
            </Card.Meta>
          </Card.Content>
        </Card>
      </Grid.Column>
    </>
  );
}

function MakeCard(title: string, content: any) {
  return (
    <Grid.Column>
      <Card fluid>
        <Card.Content>
          <Card.Header>
            <h3>{title}</h3>
          </Card.Header>
          <Card.Meta>
            {typeof content === "string" ? <p>{content}</p> : content}
          </Card.Meta>
        </Card.Content>
      </Card>
    </Grid.Column>
  );
}
export default App;
