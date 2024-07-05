import "./App.css";
import React, { useState } from "react";

function App() {
   // const [url, setUrl] = useState(
   //    "C:/Users/zek/Desktop/MyProjects/Web_Scrape/data/dummy.html"
   // );
   const [url, setUrl] = useState(
      "https://merchant.refurbed.com/orders/details/10204914?tableOptions={%22groupBy%22:[],%22groupDesc%22:[],%22itemsPerPage%22:25,%22multiSort%22:false,%22mustSort%22:true,%22page%22:1,%22sortBy%22:[{%22key%22:%22releasedAt%22,%22order%22:%22desc%22}],%22search%22:%22%22}&freeSearchOptions={}"
   );

   const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("URL submitted: ", url); // Debug log to see the URL value
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
         const blob = await response.blob();
         const pdfUrl = window.URL.createObjectURL(blob); // Avoid redeclaring 'url' here
         const a = document.createElement("a");
         a.href = pdfUrl;
         a.download = "address.pdf";
         document.body.appendChild(a);
         a.click();
         a.remove();
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
