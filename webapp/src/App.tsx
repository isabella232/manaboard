import {
  Center,
  Footer,
  Header,
  Navbar,
  Page,
  Progress,
} from "decentraland-ui";
import "decentraland-ui/lib/styles.css";
import React, { useEffect, useState } from "react";

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
  const [latest, setLatest] = useState(
    null as { burned: number; supply: number } | null
  );
  useEffect(() => {
    fetch(
      "https://api.thegraph.com/subgraphs/id/Qmf3fC4798hjXmTZFnbvaPVeBWcZbQ6Dd3EMPUbwLCcewk",
      {
        headers: {
          "content-type": "application/json",
        },
        body:
          '{"query":"{\\n  latest(id:\\"0x01\\") {\\n    id\\n    supply\\n    burned\\n  }\\n}\\n","variables":null}',
        method: "POST",
        mode: "cors",
        credentials: "omit",
      }
    )
      .then((res) => res.json())
      .then((res) => setLatest((res as any).data.latest));
  }, []);
  if (!latest) {
    return (
      <div className="container">
        <Navbar isFullscreen />
        <Page isFullscreen>
          <Center>Loading...</Center>
        </Page>
      </div>
    );
  }
  const { burned, supply } = latest!;
  const total = burned / 1e18 + supply / 1e18;
  const percent = (burned * 100) / 1e18 / total;
  return (
    <div className="container">
      <Navbar isFullscreen />
      <Page isFullscreen>
        <Center>
          <Header size="huge">{niceNumber(burned / 1e18)}</Header>
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
        </Center>
      </Page>
      <Footer isFullscreen />
    </div>
  );
}

export default App;
