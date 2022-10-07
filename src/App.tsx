import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Offline, Online } from "react-detect-offline";
import { QueueStore } from "workbox-background-sync";
import { QueueStoreEntry } from "workbox-background-sync/lib/QueueDb";

function App() {
  const [data, setData] = useState([]);
  const [postData, setPostData] = useState();
  const [queueData, setQueueData] = useState<QueueStoreEntry[]>([]);

  const queue = new QueueStore("POST-Queue");

  const fetchData = () => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setData(data);
      });
  };

  const postFetchData = () => {
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        title: "test",
        body: "bar",
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => setPostData(json));
  };

  const getQueueData = async () => {
    const queueItems = await queue.getAll()
    setQueueData(queueItems);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={fetchData}>Fetch Data</button>
        <button onClick={postFetchData}>Post Data</button>
      </header>
      <div style={{ marginTop: "10px" }}>
        <strong>GET API Response:</strong>
        <code>{data && JSON.stringify(data)}</code>
      </div>
      <div style={{ marginTop: "10px" }}>
        <strong>POST API Response:</strong>
        <code>{data && JSON.stringify(postData)}</code>
      </div>
      <div style={{ marginTop: "10px" }}>
        <Offline polling={false}>You are offline!</Offline>
        <Online polling={false}>You are online!</Online>
      </div>
      <div style={{ marginTop: "10px" }}>
        <strong>Items in Queue:</strong>
        <button onClick={getQueueData}>Fetch Queue</button>
        <ul>
          {queueData?.map((queueEntry) => (
            <li key={queueEntry.id}>
              {JSON.stringify(queueEntry)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
