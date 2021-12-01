import { FC, useState } from "react";

const emojis = [
  "🦄",
  "🚀",
  "🔥",
  "💩",
  "🏝",
  "🎃",
  "🎄",
  "🎁",
  "🎈",
  "👻",
  "🐳",
];

const Buildspace: FC = () => {
  const [index, setIndex] = useState(0);

  // function to increment index
  const incrementIndex = () => {
    setIndex((index + 1) % emojis.length);
  };

  const decrementIndex = () => {
    setIndex((index - 1 + emojis.length) % emojis.length);
  };

  return (
    <div className="flex flex-col justify-center h-screen bg-snow">
      <nav className="z-10 flex items-center justify-between w-full h-16 px-6 shadow-sm">
        <div className="flex items-center">
          <span className="pr-3 text-3xl">🦄</span>
          <span className="text-xl font-bold text-dark">buildspace</span>
        </div>
        <i className="text-2xl cursor-pointer text-dark ri-shopping-bag-3-line transition-transform ease-in-out duration-300 transform hover:scale-110"></i>
      </nav>
      <div className="flex flex-wrap  w-full h-full">
        <div className="flex items-center justify-between w-full h-full lg:w-2/3 bg-gradient-to-br from-buildspaceFrom to-buildspaceTo">
          <span
            className="p-4 text-4xl cursor-pointer"
            onClick={decrementIndex}
          >
            &larr;
          </span>
          <span className="cursor-pointer text-9xl transform scale-150">
            {emojis[index]}
          </span>
          <span
            className="p-4 text-4xl cursor-pointer"
            onClick={incrementIndex}
          >
            &rarr;
          </span>
        </div>
        <div className="flex flex-col items-center w-full px-8 py-16 text-dark lg:w-1/3 bg-snow">
          <span className="text-xl font-bold text-dark">
            Buildspace OG sticker
          </span>
          <ul className="my-8 text-lg">
            <li>
              🧑‍💻 Decorate and personalize laptops, windows, and more...
            </li>
            <li>
              💦 Removable, kiss-cut vinyl stickers Super durable and
              water-resistant
            </li>
            <li>🖼 1/8 inch (3.2mm) white border around each design</li>
            <li>✨ Premium matte finish</li>
          </ul>
          <div className="flex items-center justify-center w-64 py-4 mt-auto font-bold cursor-pointer text-snow rounded-3xl bg-gradient-to-br from-buildspaceFrom to-buildspaceTo transition-transform ease-in-out duration-300 transform hover:scale-105">
            ADD TO CART
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buildspace;
