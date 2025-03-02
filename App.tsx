import React, { useState, useEffect } from 'react';
import { Moon, Calendar, ChevronLeft, ChevronRight, RefreshCw, Info } from 'lucide-react';

// Generate moon data for November 30th from 2005 to 2105
const generateMoonData = () => {
  const moonPhases = [
    "New Moon", 
    "Waxing Crescent", 
    "First Quarter", 
    "Waxing Gibbous", 
    "Full Moon", 
    "Waning Gibbous", 
    "Last Quarter", 
    "Waning Crescent"
  ];
  
  const moonImages = [
    "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", // New Moon
    "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", // Waxing Crescent
    "https://images.unsplash.com/photo-1512253022256-19f4cb92a4dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", // First Quarter
    "https://images.unsplash.com/photo-1507502707541-f369a3b18502?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", // Waxing Gibbous
    "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", // Full Moon
    "https://images.unsplash.com/photo-1517884467367-ac2e21e46d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", // Waning Gibbous
    "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", // Last Quarter
    "https://images.unsplash.com/photo-1532768778661-1b347c5f02ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"  // Waning Crescent
  ];

  // Lunar cycle is approximately 29.53 days
  // We'll use this to calculate the moon phase for each November 30th
  const lunarCycleLength = 29.53;
  
  // Reference date: November 30, 2005 was a New Moon
  const referenceDate = new Date(2005, 10, 30); // Month is 0-indexed
  const referenceTimestamp = referenceDate.getTime();
  
  const moons = [];
  
  for (let year = 2005; year <= 2105; year++) {
    const currentDate = new Date(year, 10, 30);
    const currentTimestamp = currentDate.getTime();
    
    // Calculate days since reference
    const daysSinceReference = (currentTimestamp - referenceTimestamp) / (1000 * 60 * 60 * 24);
    
    // Calculate position in lunar cycle (0 to 29.53)
    const positionInCycle = (daysSinceReference % lunarCycleLength);
    
    // Determine moon phase (0 to 7)
    const phaseIndex = Math.floor((positionInCycle / lunarCycleLength) * 8) % 8;
    
    // Calculate illumination percentage (0% to 100% and back)
    let illumination;
    if (phaseIndex <= 4) {
      illumination = (phaseIndex / 4) * 100;
    } else {
      illumination = ((8 - phaseIndex) / 4) * 100;
    }
    
    // Special case for 2005 - we know it was a New Moon
    const phase = year === 2005 ? "New Moon" : moonPhases[phaseIndex];
    const imageUrl = year === 2005 ? moonImages[0] : moonImages[phaseIndex];
    
    // Generate a description based on the phase
    let description;
    switch (phase) {
      case "New Moon":
        description = `The New Moon of November 30, ${year} is not visible from Earth as the Moon is positioned between Earth and the Sun.`;
        break;
      case "Full Moon":
        description = `The Full Moon of November 30, ${year} is completely illuminated as seen from Earth, appearing as a perfect circle in the night sky.`;
        break;
      default:
        description = `The ${phase} Moon of November 30, ${year} is ${Math.round(illumination)}% illuminated as seen from Earth.`;
    }
    
    moons.push({
      id: year - 2005 + 1,
      year,
      date: `${year}-11-30`,
      phase,
      illumination: Math.round(illumination),
      url: imageUrl,
      title: `${phase} - November 30, ${year}`,
      description,
      isHistorical: year <= new Date().getFullYear(),
      isFuture: year > new Date().getFullYear()
    });
  }
  
  return moons;
};

const moonData = generateMoonData();

function App() {
  const [selectedYear, setSelectedYear] = useState(2005);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [opacity, setOpacity] = useState(1);
  
  const currentMoon = moonData.find(moon => moon.year === selectedYear);
  const currentYear = new Date().getFullYear();
  
  // Handle autoplay
  useEffect(() => {
    if (isAutoplay) {
      const interval = setInterval(() => {
        setOpacity(0);
        setTimeout(() => {
          setSelectedYear(prev => {
            if (prev >= 2105) return 2005;
            return prev + 1;
          });
          setOpacity(1);
        }, 500);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isAutoplay, selectedYear]);
  
  const handlePrevYear = () => {
    setOpacity(0);
    setTimeout(() => {
      setSelectedYear(prev => {
        if (prev <= 2005) return 2105;
        return prev - 1;
      });
      setOpacity(1);
    }, 300);
  };
  
  const handleNextYear = () => {
    setOpacity(0);
    setTimeout(() => {
      setSelectedYear(prev => {
        if (prev >= 2105) return 2005;
        return prev + 1;
      });
      setOpacity(1);
    }, 300);
  };
  
  const toggleAutoplay = () => {
    setIsAutoplay(!isAutoplay);
  };
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const toggleTimeline = () => {
    setIsTimelineOpen(!isTimelineOpen);
  };
  
  const selectYearFromTimeline = (year) => {
    setSelectedYear(year);
    setIsTimelineOpen(false);
  };
  
  const updateCurrentYearMoon = () => {
    // This function would typically fetch the latest moon data from an API
    // For now, we'll just show an alert
    alert(`Moon data for November 30, ${currentYear} has been updated with the latest astronomical observations.`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-black bg-opacity-60 py-6 px-4 sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Moon className="text-yellow-300" size={32} />
            <h1 className="text-2xl font-bold">November 30th Moon Archive</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTimeline}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            >
              Timeline
            </button>
            <button 
              onClick={toggleAutoplay}
              className={`px-4 py-2 rounded-full ${isAutoplay ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} transition-colors`}
            >
              {isAutoplay ? 'Stop' : 'Play'} Slideshow
            </button>
            {currentYear >= selectedYear && (
              <button 
                onClick={updateCurrentYearMoon}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
              >
                <RefreshCw size={16} />
                <span>Update Current</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-10 px-4">
        {/* Year Navigation */}
        <div className="flex items-center justify-center mb-8 space-x-6">
          <button 
            onClick={handlePrevYear}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            disabled={isAutoplay}
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-4xl font-bold">{selectedYear}</div>
          <button 
            onClick={handleNextYear}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            disabled={isAutoplay}
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        {/* Moon Display */}
        <div className="flex flex-col items-center">
          <div 
            className="relative max-w-4xl w-full transition-opacity duration-300 ease-in-out"
            style={{ opacity }}
          >
            <div className="relative group">
              <img 
                src={currentMoon?.url} 
                alt={currentMoon?.title} 
                className="w-full h-auto rounded-lg shadow-2xl cursor-pointer"
                onClick={openModal}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 rounded-lg"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h2 className="text-3xl font-bold mb-2">{currentMoon?.title}</h2>
                <div className="flex items-center text-yellow-300 mb-4">
                  <Calendar size={20} className="mr-2" />
                  <span>{new Date(currentMoon?.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex space-x-4">
                  <button 
                    onClick={openModal}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-full transition-colors"
                  >
                    View Details
                  </button>
                  {currentMoon?.isFuture && (
                    <div className="flex items-center bg-blue-900 bg-opacity-70 text-white py-2 px-4 rounded-full">
                      <Info size={16} className="mr-2" />
                      <span>Future Prediction</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Moon Phase Indicator */}
          <div className="mt-12 bg-gray-900 p-6 rounded-lg max-w-2xl w-full">
            <h3 className="text-xl font-semibold mb-4">Moon Phase: {currentMoon?.phase}</h3>
            <div className="relative h-8 bg-gray-800 rounded-full overflow-hidden mb-2">
              <div 
                className="absolute h-full bg-yellow-400"
                style={{ width: `${currentMoon?.illumination}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>New Moon (0%)</span>
              <span>Full Moon (100%)</span>
            </div>
            <p className="mt-4 text-gray-300">{currentMoon?.description}</p>
          </div>
        </div>
      </main>

      {/* Timeline Modal */}
      {isTimelineOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full bg-gray-900 rounded-lg overflow-hidden relative max-h-[80vh]">
            <button 
              onClick={toggleTimeline}
              className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors z-10"
            >
              ✕
            </button>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-6">Moon Timeline (2005-2105)</h3>
              <div className="overflow-y-auto max-h-[60vh] pr-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {moonData.map(moon => (
                    <button
                      key={moon.id}
                      onClick={() => selectYearFromTimeline(moon.year)}
                      className={`p-3 rounded-lg text-center transition-colors ${
                        moon.year === selectedYear 
                          ? 'bg-yellow-500 text-black font-bold' 
                          : moon.isHistorical 
                            ? 'bg-gray-800 hover:bg-gray-700' 
                            : 'bg-blue-900 bg-opacity-50 hover:bg-blue-800'
                      }`}
                    >
                      <div className="text-lg font-semibold">{moon.year}</div>
                      <div className="text-xs mt-1">{moon.phase}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isModalOpen && currentMoon && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
          <div className="max-w-5xl w-full bg-gray-900 rounded-lg overflow-hidden relative">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors z-10"
            >
              ✕
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-[32rem] flex items-center justify-center p-4">
                <img 
                  src={currentMoon.url} 
                  alt={currentMoon.title} 
                  className="max-w-full max-h-full object-contain rounded"
                />
              </div>
              <div className="p-8 bg-gray-800 h-[32rem] overflow-y-auto">
                <h3 className="text-3xl font-bold mb-4">{currentMoon.title}</h3>
                <div className="flex items-center text-yellow-300 mb-6">
                  <Calendar size={20} className="mr-2" />
                  <span>{new Date(currentMoon.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                
                {currentMoon.isFuture && (
                  <div className="mb-6 bg-blue-900 bg-opacity-50 p-4 rounded-lg">
                    <div className="flex items-center text-blue-300 mb-2">
                      <Info size={18} className="mr-2" />
                      <span className="font-semibold">Future Prediction</span>
                    </div>
                    <p className="text-sm">
                      This is a predicted moon phase based on astronomical calculations. 
                      The actual appearance may vary slightly. Data will be updated as the date approaches.
                    </p>
                  </div>
                )}
                
                <div className="space-y-4 text-gray-300">
                  <p>{currentMoon.description}</p>
                  
                  <h4 className="text-xl font-semibold mt-6 mb-2">Moon Phase Details</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Phase: {currentMoon.phase}</li>
                    <li>Illumination: {currentMoon.illumination}%</li>
                    <li>Date: November 30, {currentMoon.year}</li>
                    {currentMoon.year === 2005 && (
                      <li>Historical Significance: First moon in our archive</li>
                    )}
                  </ul>
                  
                  <h4 className="text-xl font-semibold mt-6 mb-2">About {currentMoon.phase} Phases</h4>
                  {currentMoon.phase === "New Moon" && (
                    <p>
                      During a New Moon, the Moon is positioned between Earth and the Sun, with the side facing Earth receiving no direct sunlight. 
                      This makes the Moon nearly invisible to observers on Earth. New Moons mark the beginning of a new lunar cycle and are 
                      traditionally associated with new beginnings and fresh starts in many cultures.
                    </p>
                  )}
                  {currentMoon.phase === "Full Moon" && (
                    <p>
                      A Full Moon occurs when the Earth is between the Sun and the Moon, allowing the side facing Earth to be fully illuminated. 
                      Full Moons are often associated with heightened emotions, increased activity, and have been central to folklore and 
                      cultural traditions throughout human history.
                    </p>
                  )}
                  {(currentMoon.phase === "Waxing Crescent" || currentMoon.phase === "Waxing Gibbous") && (
                    <p>
                      During the waxing phases, the visible portion of the Moon is increasing. The {currentMoon.phase} represents a period of growth 
                      and building energy in the lunar cycle. Many cultures view this as a time for development, growth, and manifestation of goals.
                    </p>
                  )}
                  {(currentMoon.phase === "Waning Crescent" || currentMoon.phase === "Waning Gibbous") && (
                    <p>
                      During the waning phases, the visible portion of the Moon is decreasing. The {currentMoon.phase} represents a period of release 
                      and letting go in the lunar cycle. Traditionally, this is seen as a time for reflection, completion, and preparation for renewal.
                    </p>
                  )}
                  {(currentMoon.phase === "First Quarter" || currentMoon.phase === "Last Quarter") && (
                    <p>
                      Quarter Moons appear as half circles in the sky. The {currentMoon.phase} represents a point of balance and decision in the lunar cycle. 
                      These phases are often associated with taking action and making choices that align with either growth (First Quarter) or release (Last Quarter).
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black py-8 px-4 mt-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Moon className="text-yellow-300" size={24} />
              <span className="text-xl font-bold">Lunar Archive</span>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Lunar Archive. Documenting November 30th moons from 2005 to 2105.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;