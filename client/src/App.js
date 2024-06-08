import "./App.css";
import React, { useState } from "react";

function App() {
   // const [url, setUrl] = useState("https://clarusway.com/");
   // const [url, setUrl] = useState(
   //    "https://phet-dev.colorado.edu/html/build-an-atom/0.0.0-3/simple-text-only-test-page.html"
   // );

   const [url, setUrl] = useState(
      "C:/Users/zek/Desktop/MyProjects/Web_Scrape/data/dummy.html"
   );

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await fetch("http://localhost:7000", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
         });
         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Unknown error");
         }
         const data = await response.json();
         console.log(data);
      } catch (error) {
         console.error("Error:", error.message);
      }
   };

   const handleButtonClick = () => {
      console.log("Button Clicked");
      fetch("http://localhost:7000")
         .then((response) => response.text())
         .then((data) => console.log(data))
         .catch((error) => console.error("Error:", error.message));
   };

   return (
      <div className="App">
         <form onSubmit={handleSubmit}>
            <label>
               Web Site URL:
               <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="input-url"
               />
            </label>
            <button type="submit">Scrape&Create PDF</button>
         </form>
         <button onClick={handleButtonClick}>Get Request</button>
      </div>
   );
}

export default App;
