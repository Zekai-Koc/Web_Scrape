// import "./App.css";

// import React, { useState } from "react";

// function App() {
//    const [url, setUrl] = useState("");
//    const [pdfLink, setPdfLink] = useState("");

//    const handleSubmit = async (e) => {
//       e.preventDefault();
//       const response = await fetch("http://localhost:3000/api/scrape", {
//          method: "POST",
//          headers: {
//             "Content-Type": "application/json",
//          },
//          body: JSON.stringify({ url }),
//       });
//       const data = await response.json();
//       setPdfLink(data.pdfLink);
//    };

//    return (
//       <div className="App">
//          <form onSubmit={handleSubmit}>
//             <label>
//                Web Sitesi URL'si:
//                <input
//                   type="text"
//                   value={url}
//                   onChange={(e) => setUrl(e.target.value)}
//                />
//             </label>
//             <button type="submit">Scrape ve PDF Oluştur</button>
//          </form>
//          {pdfLink && (
//             <a href={pdfLink} download>
//                PDF'yi İndir
//             </a>
//          )}
//       </div>
//    );
// }

// export default App;

import "./App.css";
import React, { useState } from "react";

function App() {
   const [url, setUrl] = useState("");
   const [pdfLink, setPdfLink] = useState("");

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await fetch("http://localhost:3000/api/scrape", {
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
         setPdfLink(data.pdfLink);
      } catch (error) {
         console.error("Error:", error.message);
      }
   };

   return (
      <div className="App">
         <form onSubmit={handleSubmit}>
            <label>
               Web Sitesi URL'si:
               <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
               />
            </label>
            <button type="submit">Scrape ve PDF Oluştur</button>
         </form>
         {pdfLink && (
            <a href={`http://localhost:3000${pdfLink}`} download>
               PDF'yi İndir
            </a>
         )}
      </div>
   );
}

export default App;
