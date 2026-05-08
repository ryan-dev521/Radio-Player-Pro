import { useState, useEffect, useRef } from 'react'
import { RadioBrowserApi } from 'radio-browser-api'
import { saveAs } from 'file-saver'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import danceStations from './assets/danceStations.json'
import houseStations from './assets/houseStations.json'
import popStations from './assets/popStations.json'
import Draggable from "react-draggable";

import './App.css'

// --- Shared Components ---

const SidebarLink = ({ to, label, icon, isAero }) => (
  <Link to={to} className={`group flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 mb-1 ${isAero ? 'text-white hover:bg-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'text-slate-300 hover:bg-indigo-600 hover:text-white'}`}>
    <span className="text-xl">{icon}</span>
    <span className="font-medium text-lg">{label}</span>
  </Link>
)

const RadioCard = ({ station, setCurrStation, favorites, setFavorites, isAero }) => {
  return (
    <div 
      onClick={() => setCurrStation(station)} 
      className={`group relative rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer shadow-lg h-40
        ${isAero 
          ? 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/25 hover:border-white/40 hover:shadow-[0_0_20px_rgba(0,194,255,0.4)]' 
          : 'bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-indigo-500/50'
        }`}
    >
      <div className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-2 transition-colors
        ${isAero 
          ? 'bg-black/20 border-white/30 group-hover:border-cyan-300' 
          : 'bg-slate-900 border-slate-600 group-hover:border-indigo-400'
        }`}>
        {station.favicon ? (
          <img className="w-full h-full object-contain p-1" src={station.favicon} alt={station.name} />
        ) : (
          <span className={`text-2xl ${isAero ? 'text-white/70' : 'text-slate-500'}`}>📻</span>
        )}
      </div>
      <div className={`font-medium text-center truncate w-full px-2 ${isAero ? 'text-white drop-shadow-md' : 'text-slate-200'}`} title={station.name}>
        {station.name}
      </div>
      <button className={`hover:cursor-pointer transition-colors ${isAero ? 'text-cyan-200 hover:text-yellow-300 hover:bg-white/20' : 'text-white hover:bg-yellow-300'}`} onClick={(e) => { e.stopPropagation(); setFavorites(prev => [...prev, station]); console.log(favorites);}}>
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.2691 4.41115C11.5006 3.89177 11.6164 3.63208 11.7776 3.55211C11.9176 3.48263 12.082 3.48263 12.222 3.55211C12.3832 3.63208 12.499 3.89177 12.7305 4.41115L14.5745 8.54808C14.643 8.70162 14.6772 8.77839 14.7302 8.83718C14.777 8.8892 14.8343 8.93081 14.8982 8.95929C14.9705 8.99149 15.0541 9.00031 15.2213 9.01795L19.7256 9.49336C20.2911 9.55304 20.5738 9.58288 20.6997 9.71147C20.809 9.82316 20.8598 9.97956 20.837 10.1342C20.8108 10.3122 20.5996 10.5025 20.1772 10.8832L16.8125 13.9154C16.6877 14.0279 16.6252 14.0842 16.5857 14.1527C16.5507 14.2134 16.5288 14.2807 16.5215 14.3503C16.5132 14.429 16.5306 14.5112 16.5655 14.6757L17.5053 19.1064C17.6233 19.6627 17.6823 19.9408 17.5989 20.1002C17.5264 20.2388 17.3934 20.3354 17.2393 20.3615C17.0619 20.3915 16.8156 20.2495 16.323 19.9654L12.3995 17.7024C12.2539 17.6184 12.1811 17.5765 12.1037 17.56C12.0352 17.5455 11.9644 17.5455 11.8959 17.56C11.8185 17.5765 11.7457 17.6184 11.6001 17.7024L7.67662 19.9654C7.18404 20.2495 6.93775 20.3915 6.76034 20.3615C6.60623 20.3354 6.47319 20.2388 6.40075 20.1002C6.31736 19.9408 6.37635 19.6627 6.49434 19.1064L7.4341 14.6757C7.46898 14.5112 7.48642 14.429 7.47814 14.3503C7.47081 14.2807 7.44894 14.2134 7.41394 14.1527C7.37439 14.0842 7.31195 14.0279 7.18708 13.9154L3.82246 10.8832C3.40005 10.5025 3.18884 10.3122 3.16258 10.1342C3.13978 9.97956 3.19059 9.82316 3.29993 9.71147C3.42581 9.58288 3.70856 9.55304 4.27406 9.49336L8.77835 9.01795C8.94553 9.00031 9.02911 8.99149 9.10139 8.95929C9.16534 8.93081 9.2226 8.8892 9.26946 8.83718C9.32241 8.77839 9.35663 8.70162 9.42508 8.54808L11.2691 4.41115Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className={`absolute inset-0 rounded-xl ring-2 opacity-0 group-hover:opacity-100 transition-pointer pointer-events-none ${isAero ? 'ring-cyan-300 shadow-[0_0_15px_rgba(0,255,255,0.6)]' : 'ring-indigo-500'}`} />
    </div>
  )
}

const PlayerBar = ({ currStation, isPlaying, setIsPlaying, showPlayerWindow, setShowPlayerWindow, isAero, barMessage }) => {
  if (!currStation.name) return null

  return (
    <div className={`fixed bottom-0 left-0 right-0 h-20 z-50 flex items-center justify-between px-6 shadow-2xl transition-all duration-300
      ${isAero 
        ? 'bg-gradient-to-t from-black/70 to-white/10 backdrop-blur-md border-t border-white/20 text-white' 
        : 'bg-slate-900/95 backdrop-blur-md border-t border-slate-700 text-slate-200'
      }`}>
      <div className="flex items-center gap-4 w-1/3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden border 
          ${isAero ? 'bg-black/20 border-white/30' : 'bg-slate-800 border-slate-700'}`}>
          {currStation.favicon ? (
            <img className="w-full h-full object-contain p-1" src={currStation.favicon} alt="" />
          ) : (
            <span className="text-xl">📻</span>
          )}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className={`text-xs uppercase tracking-wider font-bold ${isAero ? 'text-cyan-200' : 'text-slate-400'}`}>Now Playing</span>
          <span className={`font-semibold truncate ${isAero ? 'text-white drop-shadow-md' : 'text-white'}`}>{currStation.name}</span>
        </div>
      </div>

      <div className="flex items-center justify-center w-1/3">
        <button 
          onClick={() => setIsPlaying(curr => !curr)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-200 active:scale-95
            ${isAero 
              ? 'bg-gradient-to-b from-white/80 to-white/20 text-blue-900 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] border border-white' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/30'
            }`}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
      </div>

      <div className={`w-16 p-2 font-semibold text-sm ${isAero ? 'text-white drop-shadow-md' : 'text-white'}`}>
        {barMessage}
      </div>

      <div className="w-1/3 flex justify-end">
        <div className="flex gap-1 items-end h-6">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`w-1 rounded-full ${isPlaying ? 'animate-pulse' : 'opacity-50'}`} 
              style={{ 
                height: `${Math.random() * 100}%`, 
                animationDelay: `${i * 0.1}s`,
                backgroundColor: isAero ? '#00ffff' : '#6366f1'
              }} 
            />
          ))}
        </div>
      </div>

      <div className={`text-2xl ps-4 ms-4 rounded-md transition-colors cursor-pointer ${isAero ? 'hover:bg-white/20' : 'hover:bg-gray-400'}`} onClick={() => setShowPlayerWindow(true)}> 
        Open Window
      </div>
    </div>
  )
}

const CategoryPage = ({ stations, currStation, setCurrStation, isPlaying, setIsPlaying, showPlayerWindow, setShowPlayerWindow, favorites, setFavorites, isAero, barMessage }) => {
  const [searchterm, setSearchTerm] = useState("")

  const filteredStations = stations.filter(station => 
    station.name.toLowerCase().includes(searchterm.toLowerCase())
  )

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto pb-24">
      <div className="w-full max-w-2xl mb-8 relative">
        <input 
          type="text" 
          placeholder="Search stations..." 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className={`w-full h-14 rounded-xl px-5 pl-12 focus:outline-none transition-all shadow-md placeholder-slate-500
            ${isAero 
              ? 'bg-white/10 border border-white/20 text-white backdrop-blur-sm focus:border-cyan-300 focus:ring-cyan-300/50 focus:bg-white/20' 
              : 'bg-slate-800 text-slate-200 border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
            }`}
        />
        <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl ${isAero ? 'text-white/70' : 'text-slate-500'}`}>🔍</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full px-4">
        {filteredStations.map((station, id) => (
          <RadioCard key={id} station={station} setCurrStation={setCurrStation} favorites={favorites} setFavorites={setFavorites} isAero={isAero} />
        ))}
        {filteredStations.length === 0 && (
          <div className={`col-span-full text-center py-12 text-xl ${isAero ? 'text-white/70' : 'text-slate-500'}`}>
            No stations found matching "{searchterm}"
          </div>
        )}
      </div>

      <PlayerBar currStation={currStation} isPlaying={isPlaying} setIsPlaying={setIsPlaying} setShowPlayerWindow={setShowPlayerWindow} isAero={isAero} barMessage={barMessage} />
    </div>
  )
}

// --- Page Components ---

const Home = ({ currStation, setCurrStation, isPlaying, setIsPlaying, isAero }) => { 
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <h1 className={`text-5xl font-bold mb-6 transition-all
        ${isAero 
          ? 'text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]' 
          : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400'
        }`}
      >
        Welcome to Radio App
      </h1>
      <p className={`text-lg max-w-md mb-8 ${isAero ? 'text-white/90 drop-shadow-md' : 'text-slate-400'}`}>
        Select a category from the sidebar to start exploring stations. 
        Your music continues playing as you navigate.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
        <Link to="/categories/dance" className={`p-6 rounded-xl transition-all group border
          ${isAero 
            ? 'bg-white/10 hover:bg-white/30 border-white/20 hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]' 
            : 'bg-slate-800 hover:bg-indigo-600/20 border-slate-700 hover:border-indigo-500'
          }`}>
          <div className="text-3xl mb-2">💃</div>
          <div className={`font-bold ${isAero ? 'text-white group-hover:text-cyan-200' : 'text-slate-200 group-hover:text-indigo-400'}`}>Dance</div>
        </Link>
        <Link to="/categories/house" className={`p-6 rounded-xl transition-all group border
          ${isAero 
            ? 'bg-white/10 hover:bg-white/30 border-white/20 hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]' 
            : 'bg-slate-800 hover:bg-indigo-600/20 border-slate-700 hover:border-indigo-500'
          }`}>
          <div className="text-3xl mb-2">🏠</div>
          <div className={`font-bold ${isAero ? 'text-white group-hover:text-cyan-200' : 'text-slate-200 group-hover:text-indigo-400'}`}>House</div>
        </Link>
        <Link to="/categories/pop" className={`p-6 rounded-xl transition-all group border
          ${isAero 
            ? 'bg-white/10 hover:bg-white/30 border-white/20 hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]' 
            : 'bg-slate-800 hover:bg-indigo-600/20 border-slate-700 hover:border-indigo-500'
          }`}>
          <div className="text-3xl mb-2">🎤</div>
          <div className={`font-bold ${isAero ? 'text-white group-hover:text-cyan-200' : 'text-slate-200 group-hover:text-indigo-400'}`}>Pop</div>
        </Link>
      </div>
      <PlayerBar currStation={currStation} isPlaying={isPlaying} setIsPlaying={setIsPlaying} isAero={isAero} />
    </div>
  )
}

// --- Main App Component ---

function App() {
  const [count, setCount] = useState(0)
  const [stationsList, setStationsList] = useState([])
  const [currStation, setCurrStation] = useState({})
  const [isPlaying, setIsPlaying] = useState(true)
  const [searchterm, setSearchTerm] = useState("")
  const [showPlayerWindow, setShowPlayerWindow] = useState(false)
  const [maximized, setMaximized] = useState(false);
  const [favorites, setFavorites] = useState([])
  const [hydrated, setHydrated] = useState(false);
  const [isAero, setIsAero] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [barMessage, setBarMessage] = useState("")


  const nodeRef = useRef(null)
  const audioref = useRef(null)

  const api = new RadioBrowserApi("My radio")

  const downloadStations = async () => {
    let stations = await api.searchStations({
      countryCode: 'US',
      limit: 100,
      tag: 'dance',
      reverse: true,
      order: 'votes'
    })

    let filename = 'danceStations.json'
    let jsonStr = JSON.stringify(stations, null, 2);
    let blob = new Blob([jsonStr], { type: 'application/json' });
    saveAs(blob, filename)

    stations = await api.searchStations({
      countryCode: 'US',
      limit: 100,
      tag: 'house',
      reverse: true,
      order: 'votes'
    })

    filename = 'houseStations.json'
    jsonStr = JSON.stringify(stations, null, 2);
    blob = new Blob([jsonStr], { type: 'application/json' });
    saveAs(blob, filename)

    stations = await api.searchStations({
      countryCode: 'US',
      limit: 100,
      tag: 'pop',
      reverse: true,
      order: 'votes'
    })

    filename = 'popStations.json'
    jsonStr = JSON.stringify(stations, null, 2);
    blob = new Blob([jsonStr], { type: 'application/json' });
    saveAs(blob, filename)

    stations = await api.searchStations({
      countryCode: 'US',
      limit: 100,
      tag: '2010s',
      reverse: true,
      order: 'votes'
    })

    filename = '2010sStations.json'
    jsonStr = JSON.stringify(stations, null, 2);
    blob = new Blob([jsonStr], { type: 'application/json' });
    saveAs(blob, filename)
  }

  useEffect(() => {
    if (audioref.current) 
      audioref.current.pause()

    if (currStation.urlResolved) {
      audioref.current = new Audio(currStation.urlResolved)
      
      console.log("useEffect currstation")
      setBarMessage("Loading...")

      let resolved = false

      const timeout = setTimeout(() => {
        if (!resolved) {
          setBarMessage("Unavailable")
        }
      }, 5000)


      audioref.current.addEventListener("canplay", () => {
        resolved = true
        clearTimeout(timeout)

        setBarMessage("")
      })

      audioref.current.addEventListener("error", () => {
        clearTimeout(timeout)
        resolved = true
        setBarMessage("Unavailable")
      })

      if (isPlaying && audioref.current) {
        audioref.current.play()
        console.log(currStation.name + " is playing")
      }
    }

  }, [currStation])

  useEffect(() => {
    if (audioref.current && !isPlaying) 
      audioref.current.pause()
    else if (audioref.current && isPlaying)
      audioref.current.play()

  }, [isPlaying])

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
      localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites, hydrated]);



  // useEffect(() => {
  //   if (!favorites) return;


  //     const deduped = [
  //   ...new Map(favorites.map(item => [item.url, item])).values()
  // ];

  //   if (deduped.length !== favorites.length) {
  //     setFavorites(deduped);}

      
  // }, [favorites]) 


  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-none duration-700 ease-in-out
      ${isAero 
        ? 'bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] text-white' // Dark Aero-ish theme
        : 'bg-slate-900 text-slate-200'
      }`}>
      {/* Sidebar */}
      <div className={`w-64 border-r flex flex-col items-center py-6 shadow-xl z-20 transition-all duration-300
        ${isAero 
          ? 'bg-white/10 backdrop-blur-lg border-white/20' 
          : 'bg-slate-800 border-slate-700'
        }`}>
        <div className={`text-2xl font-bold mb-8 tracking-tight ${isAero ? 'text-cyan-100 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]' : 'text-indigo-400'}`}>
          🎵 RadioApp
        </div>
        
        <nav className="w-full px-4 flex-1">
          <SidebarLink to="/" label="Home" icon="🏠" isAero={isAero} />
          <SidebarLink to="/categories/dance" label="Dance" icon="💃" isAero={isAero} />
          <SidebarLink to="/categories/house" label="House" icon="🏠" isAero={isAero} />
          <SidebarLink to="/categories/pop" label="Pop" icon="🎤" isAero={isAero} />
          
          <div className={`flex flex-col p-2 justify-center items-center mt-4 rounded-xl ${isAero ? 'bg-black/20' : 'bg-slate-700/30'}`}>
            <div className={`m-2 font-bold ${isAero ? 'text-cyan-200' : 'text-slate-400'}`}>Favorites</div>
            {favorites.map((favorite, idx) => (
              <div className={`flex items-center gap-2 hover:cursor-pointer rounded-2xl mb-2 w-full px-2 transition-colors
                ${isAero ? 'hover:bg-white/20' : 'hover:bg-gray-400'}`} 
                onClick={() => setCurrStation(favorite)}>
                <img src={favorite.favicon} className="w-12 h-12 p-2 rounded-md object-contain" alt={favorite.name}></img>
                <div className={`overflow-hidden text-sm ${isAero ? 'text-white' : 'text-slate-200'}`}>{favorite.name}</div>
                <button className={`hover:cursor-pointer hover:bg-red-500 p-4 rounded-full transition-colors
                  ${isAero ? 'text-white/70' : 'text-slate-500'}`} 
                  onClick={(e) => {e.stopPropagation(); e.preventDefault(); setFavorites(prev => prev.filter(item => item.name !== favorite.name));}}>X</button>
              </div>
            ))}
          </div>
        </nav>

        <div className="w-full px-4 mt-auto flex flex-col gap-2 mb-16">
           <button 
            onClick={() => setIsAero(!isAero)}
            className={`w-full py-3 rounded-lg font-bold transition-all duration-700 border
              ${isAero 
                ? 'bg-white/20 hover:bg-white/30 border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white border-transparent'
              }`}
           >
             {isAero ? 'Switch to Original' : 'Switch to Aero'}
           </button>
        </div>
      </div>

      {showDisclaimer && (
        <div className="fixed bottom-24 right-1/3 z-[20] w-1/3 rounded-xl bg-gray-900 text-gray-300 border-2 border-gray-700 shadow-xl">
          
          <div
            className="absolute top-2 right-2 hover:cursor-pointer hover:bg-red-500 rounded-full px-2 py-1 transition-colors"
            onClick={() => setShowDisclaimer(false)}
          >
            ✕
          </div>

          <div className="p-4 text-sm leading-relaxed">
            <div className="font-semibold mb-2 text-white">
              Disclaimer
            </div>

            <p className="mb-3">
              This is a personal portfolio project.
            </p>

            <p className="mb-3">
              Radio stations and stream URLs are sourced from the public
              Radio Browser directory. All station names, logos, and audio
              content belong to their respective owners.
            </p>

            <p>
              This application does not host, own, or actively moderate
              streamed content.
            </p>
          </div>

        </div>
      )}

      {showPlayerWindow && (
      <Draggable
        nodeRef={nodeRef}
        handle=".header"
        disabled={maximized}
      >
        <div
          ref={nodeRef}
          className={`
            flex flex-col overflow-hidden shadow-lg rounded-xl
            ${maximized
              ? "fixed top-0 left-0 w-screen h-screen z-[100]"
              : "fixed top-20 left-80 w-1/2 h-1/2 z-[100]"
            }
            ${isAero ? 'bg-[#2C5364]/90 backdrop-blur-xl border border-white/40 shadow-[0_0_30px_rgba(0,0,0,0.5)]' : 'bg-white'}
          `}
        >

          {/* Header */}
          <div className={`header p-2 cursor-move relative flex items-center justify-between
            ${isAero ? 'bg-gradient-to-b from-white/30 to-white/10 border-b border-white/20 text-white' : 'bg-blue-500 text-white'}`}>
            <div className="font-bold">{currStation.name}</div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Close */}
              <div
                className="hover:cursor-pointer hover:bg-red-500 px-2 py-1 rounded transition-colors"
                onClick={() => setShowPlayerWindow(false)}
              >
                X
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={`flex-1 flex items-center justify-center p-4
            ${isAero ? 'bg-black/20 text-white' : 'bg-gray-800 text-gray-300'}`}>
            <div className="flex flex-col items-center justify-center">

              <div className="p-4 m-2 text-center text-lg font-semibold">
                {currStation?.name || "No Station Selected"}
              </div>

              <div className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 mb-4
                ${isAero ? 'bg-black/20 border-white/30' : 'bg-slate-800 border-slate-700'}`}>
                {currStation?.favicon ? (
                  <img
                    className="w-full h-full object-contain p-1"
                    src={currStation.favicon}
                    alt=""
                  />
                ) : (
                  <span className="text-3xl">📻</span>
                )}
              </div>

              <button
                onClick={() => setIsPlaying(curr => !curr)}
                className={`w-14 h-14 m-4 rounded-full flex items-center justify-center text-2xl shadow-lg active:scale-95 transition-all
                  ${isAero 
                    ? 'bg-gradient-to-b from-white/80 to-white/20 text-blue-900 border border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
              >
                {isPlaying ? "⏸️" : "▶️"}
              </button>

              <div className="flex gap-1 items-end h-6 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full ${
                      isPlaying ? "animate-pulse" : "opacity-50"
                    }`}
                    style={{
                      height: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.1}s`,
                      backgroundColor: isAero ? '#00ffff' : '#6366f1',
                    }}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>
      </Draggable>
      )}



      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className={`flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent transition-all duration-500
          ${isAero ? 'bg-transparent' : 'bg-slate-900'}`}>
          <Routes>
            <Route path="/" element={<Home currStation={currStation} setCurrStation={setCurrStation} isPlaying={isPlaying} setIsPlaying={setIsPlaying} isAero={isAero} />} />
            <Route path="/categories/dance" element={<CategoryPage stations={danceStations} currStation={currStation} setCurrStation={setCurrStation} isPlaying={isPlaying} setIsPlaying={setIsPlaying} showPlayerWindow={showPlayerWindow} setShowPlayerWindow={setShowPlayerWindow} favorites={favorites} setFavorites={setFavorites} isAero={isAero} barMessage={barMessage} />} />
            <Route path="/categories/house" element={<CategoryPage stations={houseStations} currStation={currStation} setCurrStation={setCurrStation} isPlaying={isPlaying} setIsPlaying={setIsPlaying} showPlayerWindow={showPlayerWindow} setShowPlayerWindow={setShowPlayerWindow} favorites={favorites} setFavorites={setFavorites} isAero={isAero} barMessage={barMessage} />} />
            <Route path="/categories/pop" element={<CategoryPage stations={popStations} currStation={currStation} setCurrStation={setCurrStation} isPlaying={isPlaying} setIsPlaying={setIsPlaying} showPlayerWindow={showPlayerWindow} setShowPlayerWindow={setShowPlayerWindow} favorites={favorites} setFavorites={setFavorites} isAero={isAero} barMessage={barMessage} />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App















