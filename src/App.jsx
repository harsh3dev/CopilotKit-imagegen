import { useState, useEffect } from "react";
// import openai from "openai";
import OpenAI from "openai";
import "./App.css";
import { FaImage } from "react-icons/fa6";

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState(
    "Enter your prompt"
  );
  useEffect(() => {
    const items = localStorage.getItem('img');
    if (items) {
      setResult(items);
      console.log("getitem", items);
    }
  }, []);
  const generateImage = async () => {
    setPlaceholder(`Search ${prompt}..`);
    setLoading(true);

    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_Open_AI_Key,
      dangerouslyAllowBrowser: true,
    });

    try {
      const res = await openai.images.generate({
        prompt: prompt,
        n: 1,
        size: "256x256",
      });
      console.log(res.data[0].url);
      setResult(res.data[0].url);
      localStorage.setItem('img', res.data[0].url);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };


  // useEffect(() => {
  //   localStorage.setItem('img', JSON.stringify(result));
  //   console.log("setitem", result);
  // }, [result]);

  
  return (
    <div className="w-screen min-h-screen text-white flex items-center justify-between ">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      {/* <div className="w-1/2 flex flex-col justify-center items-baseline gap-4"> */}
      <div className="w-1/2 flex flex-col justify-center items-baseline md:p-20 gap-4" >
      {/* <form onSubmit={generateImage} className="w-full flex flex-col justify-center items-baseline md:p-20 gap-4" > */}
        <h2>Generate an Image using Open AI API</h2>

        <textarea
          className="block p-2.5 w-[70%] text-sm bg-gray-800 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={placeholder}
          onChange={(e) => setPrompt(e.target.value)}
          rows="4"
          cols="4"
          required
          />
        <button onClick={generateImage} >Generate an Image</button>
          {/* </form> */}
      </div>

      <div className=" w-1/2 min-h-screen border-l-2 border-gray-500 flex flex-col justify-center items-center gap-5 ">
            { !result && <FaImage />}
            {loading && (<>
            <h2>Generating Image...</h2>
            <div className="lds-ripple">
              <div></div>
              <div></div>
            </div>
            </>
          )
        }
          {result.length > 0 ? (<div className="min-w-[80%] flex flex-col justify-center items-center gap-10 rounded-lg p-10 ">
          <img className="result-image shadow-lg rounded-lg" src={result} alt="result" />
          <button>
            <a href={result} download="image.jpeg" type="download" className="text-white" >
            Download Image
            </a>
            </button>
          </div>
        ):<></>}

        </div>
    </div>
  );
}

export default App;
