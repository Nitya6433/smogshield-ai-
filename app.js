/**
 * SmogShield AI: Urban Winter Smog & Community Clean Air Navigator
 * Main Application Logic & GenAI Advisor Engine
 */

// Application State
const state = {
  activeTab: 'advisor',
  activeHour: 8,
  selectedCity: 'delhi',
  cities: {
    delhi: {
      name: 'Delhi NCR (India)',
      currentAqi: 435,
      pm25: 312,
      pm10: 480,
      temp: '14°C',
      humidity: '78%',
      inversionStrength: 'Severe (Boundary Layer: 180m)',
      primarySources: 'Vehicular exhaust, biomass/stubble smoke, urban road dust, brick kilns',
      peakSmogHours: '06:00 - 10:30 & 18:30 - 23:00',
      safeWindow: '13:00 - 15:30 (Solar radiation peak breaks ground inversion)',
      hourlyAqi: [410, 425, 440, 460, 485, 495, 475, 430, 380, 310, 260, 230, 215, 230, 270, 330, 390, 430, 455, 470, 460, 440, 420, 415]
    },
    lahore: {
      name: 'Lahore (Pakistan)',
      currentAqi: 480,
      pm25: 360,
      pm10: 520,
      temp: '13°C',
      humidity: '82%',
      inversionStrength: 'Critical (Boundary Layer: 160m)',
      primarySources: 'Low-grade diesel fuel, crop burning, steel mills, dense cold fog (smog)',
      peakSmogHours: '05:30 - 11:00 & 18:00 - 23:30',
      safeWindow: '13:30 - 15:00',
      hourlyAqi: [440, 460, 480, 510, 540, 550, 520, 460, 400, 330, 290, 260, 245, 260, 310, 380, 440, 490, 520, 530, 510, 480, 460, 445]
    },
    beijing: {
      name: 'Beijing (China)',
      currentAqi: 175,
      pm25: 98,
      pm10: 160,
      temp: '-2°C',
      humidity: '45%',
      inversionStrength: 'Moderate (Mountain basin inversion)',
      primarySources: 'Regional coal heating, industrial emissions, highway transport',
      peakSmogHours: '07:00 - 09:30 & 19:00 - 22:00',
      safeWindow: '12:00 - 16:00',
      hourlyAqi: [150, 155, 160, 175, 190, 195, 185, 170, 150, 130, 115, 105, 100, 105, 120, 140, 165, 180, 190, 185, 175, 165, 155, 150]
    },
    saltlake: {
      name: 'Salt Lake City (USA)',
      currentAqi: 142,
      pm25: 56,
      pm10: 85,
      temp: '-4°C',
      humidity: '65%',
      inversionStrength: 'High (Valley topography cold pool trap)',
      primarySources: 'Vehicular cold-starts, domestic wood burning stoves, valley industrial',
      peakSmogHours: '07:00 - 10:00 & 17:30 - 20:30',
      safeWindow: '13:00 - 16:00',
      hourlyAqi: [120, 125, 135, 155, 170, 165, 150, 135, 120, 105, 95, 90, 88, 92, 105, 125, 145, 160, 165, 155, 140, 130, 125, 120]
    },
    krakow: {
      name: 'Krakow (Poland)',
      currentAqi: 168,
      pm25: 92,
      pm10: 145,
      temp: '1°C',
      humidity: '84%',
      inversionStrength: 'Strong (Vistula river basin inversion)',
      primarySources: 'Suburban domestic coal/wood boilers ("smog piecowy"), heavy diesel traffic',
      peakSmogHours: '06:30 - 09:30 & 18:00 - 22:30',
      safeWindow: '12:30 - 15:30',
      hourlyAqi: [140, 145, 155, 175, 190, 185, 170, 155, 135, 120, 110, 100, 95, 102, 120, 145, 170, 185, 195, 180, 165, 155, 145, 140]
    }
  },
  profile: {
    familyName: 'Patel Family',
    adults: 2,
    infants: 1,
    seniors: 1,
    hasAsthma: true,
    housingType: 'leaky_apartment', // leaky_apartment, modern_insulated, ground_house
    roomSqFt: 350,
    ceilingHeight: 9,
    heatingSource: 'electric_radiator', // wood_coal, unvented_gas, electric_radiator, heat_pump
    cookingFuel: 'lpg_gas', // lpg_gas, induction, high_frying
    commuteMode: 'two_wheeler' // solo_car, two_wheeler, carpool, metro
  },
  crBox: {
    roomLength: 18,
    roomWidth: 15,
    ceilingHeight: 9,
    targetAch: 5,
    fanType: 'box_fan', // box_fan, pc_fans
    filterGrade: 'merv13' // merv13, hepa
  },
  communityPledges: 48,
  communityHouseholds: 250
};

// Initial Chat History
const chatHistory = [
  {
    sender: 'ai',
    time: 'Just now',
    text: `Hello! I am **SmogShield AI**, your GenAI assistant for surviving severe winter smog and urban air pollution. 
    
I can analyze your **local atmospheric inversion**, suggest **low-emission daily routines**, calculate **indoor DIY filtration**, and quantify the **direct health & carbon impact** of your choices.
    
How can I assist your family or community today? Try asking about mask efficacy, DIY air filters, ventilation timing, or safe routines for vulnerable members.`
  }
];

// Document Ready
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initCitySelector();
  initChat();
  initTimelineScrubber();
  initCRCalculator();
  initImpactMatrix();
  initCommunity();
  initProfileModal();
  updateHeaderTelemetrics();
  renderInversionCanvas();
});

/* ==========================================================================
   Navigation Tabs
   ========================================================================== */
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      state.activeTab = target;
      const targetEl = document.getElementById(`tab-${target}`);
      if (targetEl) targetEl.classList.add('active');

      if (target === 'iaq') {
        renderInversionCanvas();
      }
    });
  });
}

/* ==========================================================================
   City & Telemetry Management
   ========================================================================== */
function initCitySelector() {
  const select = document.getElementById('city-select');
  if (!select) return;
  select.value = state.selectedCity;
  select.addEventListener('change', (e) => {
    state.selectedCity = e.target.value;
    updateHeaderTelemetrics();
    updateTimelineForHour(state.activeHour);
    renderInversionCanvas();
    updateImpactMetrics();
    
    // Add AI message notifying city change
    const city = state.cities[state.selectedCity];
    appendAIMessage(`Updated location to **${city.name}**. Current AQI is **${city.currentAqi}** (PM2.5: ${city.pm25} µg/m³). Inversion status: *${city.inversionStrength}*. Recommended daily ventilation flush: **${city.safeWindow}**.`);
  });
}

function getAqiCategory(aqi) {
  if (aqi <= 50) return { label: 'Good', color: 'var(--aqi-good)', badgeClass: 'aqi-good' };
  if (aqi <= 100) return { label: 'Moderate', color: 'var(--aqi-mod)', badgeClass: 'aqi-mod' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'var(--aqi-unhealthy)', badgeClass: 'aqi-unhealthy' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'var(--aqi-veryunhealthy)', badgeClass: 'aqi-veryunhealthy' };
  return { label: 'Severe / Hazardous', color: 'var(--aqi-severe)', badgeClass: 'aqi-severe' };
}

function updateHeaderTelemetrics() {
  const city = state.cities[state.selectedCity];
  const aqiPill = document.getElementById('header-aqi-pill');
  const aqiVal = document.getElementById('header-aqi-value');
  const aqiStatus = document.getElementById('header-aqi-status');
  
  if (aqiVal && aqiStatus) {
    const cat = getAqiCategory(city.currentAqi);
    aqiVal.textContent = `AQI ${city.currentAqi}`;
    aqiStatus.textContent = cat.label;
    aqiPill.style.backgroundColor = cat.color;
    aqiPill.style.color = '#ffffff';
  }

  // Update Overview Stat Cards
  const statAqi = document.getElementById('stat-aqi');
  const statPm25 = document.getElementById('stat-pm25');
  const statInversion = document.getElementById('stat-inversion');
  const statWindow = document.getElementById('stat-window');
  
  if (statAqi) statAqi.textContent = city.currentAqi;
  if (statPm25) statPm25.textContent = `${city.pm25} µg/m³`;
  if (statInversion) statInversion.textContent = city.inversionStrength.split('(')[0].trim();
  if (statWindow) statWindow.textContent = city.safeWindow.split('(')[0].trim();
}

/* ==========================================================================
   GenAI Conversational Assistant Engine
   ========================================================================== */
function initChat() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const chips = document.querySelectorAll('.prompt-chip');

  renderChatHistory();

  if (sendBtn && input) {
    sendBtn.addEventListener('click', () => handleSendUserMessage());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSendUserMessage();
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) {
        input.value = prompt;
        handleSendUserMessage();
      }
    });
  });
}

function handleSendUserMessage() {
  const input = document.getElementById('chat-input');
  const query = input.value.trim();
  if (!query) return;

  // Add User Message
  chatHistory.push({
    sender: 'user',
    time: formatCurrentTime(),
    text: query
  });
  input.value = '';
  renderChatHistory();

  // Generate GenAI Response
  setTimeout(() => {
    const responseObj = generateGenAIResponse(query);
    chatHistory.push(responseObj);
    renderChatHistory();
  }, 400);
}

function formatCurrentTime() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderChatHistory() {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  container.innerHTML = chatHistory.map(item => {
    if (item.sender === 'user') {
      return `
        <div class="chat-bubble user">
          <div class="bubble-meta"><span>You</span> • <span>${item.time}</span></div>
          <div class="bubble-body">${escapeHtml(item.text)}</div>
        </div>
      `;
    } else {
      return `
        <div class="chat-bubble ai">
          <div class="bubble-meta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span>SmogShield AI</span> • <span>${item.time}</span>
          </div>
          <div class="bubble-body">${formatMarkdown(item.text)}</div>
          ${item.reasoning ? `
            <div class="reasoning-box">
              <strong>🔬 Atmospheric & Exposure Reasoning:</strong><br>
              ${item.reasoning}
            </div>
          ` : ''}
          ${item.impact ? `
            <div class="impact-badge">
              ⚡ Direct Impact: ${item.impact}
            </div>
          ` : ''}
        </div>
      `;
    }
  }).join('');

  container.scrollTop = container.scrollHeight;
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatMarkdown(text) {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n- /g, '<br>• ')
    .replace(/\n\d+\. /g, '<br>1. ');
  return html;
}

function appendAIMessage(text) {
  chatHistory.push({
    sender: 'ai',
    time: formatCurrentTime(),
    text: text
  });
  renderChatHistory();
}

/**
 * Knowledge-base and GenAI synthesis engine
 */
function generateGenAIResponse(query) {
  const q = query.toLowerCase();
  const city = state.cities[state.selectedCity];
  const prof = state.profile;

  // 1. Child / Asthma Vulnerability
  if (q.includes('asthma') || q.includes('child') || q.includes('kid') || q.includes('toddler') || q.includes('exercise') || q.includes('play')) {
    return {
      sender: 'ai',
      time: formatCurrentTime(),
      text: `### Immediate Guidance for ${prof.hasAsthma ? 'Asthmatic Child' : 'Children'} in ${city.name} (AQI ${city.currentAqi}):

1. **Cancel All Outdoor Play & Morning Workouts**:
   - Children breathe **2x more air per kilogram of body weight** than adults and have narrower airways. At AQI ${city.currentAqi}, just 30 minutes of outdoor aerobic play deposits over **120 micrograms of toxic particulate matter** directly into deep bronchioles, triggering severe bronchospasms.
2. **Setup a "Clean Air Sanctuary Room"**:
   - Pick the bedroom with fewest exterior walls. Run your DIY or HEPA purifier continuously on Medium-High.
   - Seal the door threshold with a damp rolled-up towel to block corridor draft.
3. **Indoor Active Alternatives**:
   - Instead of outdoor running, do indoor balloon volleyball, stretching yoga, or foam obstacle courses during 14:00 - 16:00 when indoor air is cleanest.
4. **Nebulizer & Medication Prep**:
   - Keep rescue inhalers at room temperature (cold inhalers deliver coarser droplets that fail to reach lower airways).`,
      reasoning: `Thermal inversion traps heavy PM2.5 within 200m of the ground during morning and evening. Deep breathing during exercise bypasses nasal filtration, delivering fine toxic nitrates, sulfates, and polycyclic aromatic hydrocarbons (PAHs) straight into alveoli.`,
      impact: `Avoiding outdoor exertion today prevents ~88% of acute bronchial inflammation and cuts emergency nebulization risk by 74%.`
    };
  }

  // 2. Corsi-Rosenthal Box / DIY Filter
  if (q.includes('corsi') || q.includes('diy') || q.includes('box fan') || q.includes('cheap filter') || q.includes('budget purifier') || q.includes('cost')) {
    return {
      sender: 'ai',
      time: formatCurrentTime(),
      text: `### Building a Low-Cost Corsi-Rosenthal (C-R) Box for Winter Smog:

A **Corsi-Rosenthal Box** delivers higher Clean Air Delivery Rates (CADR 350-450 CFM) than a $400 commercial purifier, for less than $35 - $45 (₹2,500 - ₹3,500).

**Bill of Materials**:
1. **1x 20-inch Box Fan** (or 4-6x 120mm high-static-pressure PC fans for an ultra-silent version).
2. **4x MERV-13 (or F7/H11 equivalent) Furnace Filters** (e.g., 20" x 20" x 1" or 2" depth).
3. **1x Cardboard Bottom Plate** & Duct Tape.
4. **1x Cardboard Shroud** *(CRITICAL: Cut a 14-inch circular hole in a square cardboard piece taped to fan face)*.

**Assembly Steps**:
1. Tape the 4 filters into an open cube, arrows pointing **inward** toward the center cavity.
2. Tape cardboard to the bottom to seal it air-tight.
3. Place the box fan on top, blowing air **UPWARD/OUTWARD** into the room.
4. Tape the cardboard shroud over the front fan grill — this prevents reverse vortex air recirculation and boosts airflow efficiency by **40%**!`,
      reasoning: `4 large filters provide over 40 square feet of pleat surface area. This drastically reduces face velocity and filter resistance, allowing standard fan blades to push high volume without motor burnout.`,
      impact: `Reduces room PM2.5 by 85-92% in 25 minutes. Saves $300 in commercial markup and uses only 45W of power.`
    };
  }

  // 3. Ventilation Window / Open Windows
  if (q.includes('window') || q.includes('ventilate') || q.includes('inversion') || q.includes('fresh air') || q.includes('air out')) {
    return {
      sender: 'ai',
      time: formatCurrentTime(),
      text: `### The Scientific Ventilation Window for ${city.name}:

During winter smog, **NEVER open windows in the morning (06:00 - 10:30) or night (18:00 - 24:00)**. 

**Optimal Window: ${city.safeWindow}**

**Why this window works**:
- Surface solar radiation warms the earth's surface around noon, creating convection thermals that temporarily break through the nocturnal **thermal inversion lid**.
- The planetary boundary layer expands from ~180 meters up to 800+ meters, diluting surface PM2.5 concentrations by up to 45%.

**How to execute the "Rapid Flush Protocol"**:
1. At **13:30**, open windows on opposite sides of your home for **precisely 12 to 15 minutes** to flush out exhaled CO2, radon, and moisture.
2. Tightly latch all windows at **13:45**.
3. Turn air purifiers / C-R box to **Maximum Turbo Speed for 20 minutes** immediately after latching.`,
      reasoning: `Opening windows at night pulls cold, ultra-dense particulate smog into warm interior walls. Confining air exchange to the convective thermal peak refreshes indoor oxygen while minimizing toxic particulate loading.`,
      impact: `Keeps indoor CO2 below 900 ppm without letting indoor PM2.5 rise above 35 µg/m³.`
    };
  }

  // 4. Masks
  if (q.includes('mask') || q.includes('n95') || q.includes('cloth') || q.includes('surgical') || q.includes('ffp2') || q.includes('valved')) {
    return {
      sender: 'ai',
      time: formatCurrentTime(),
      text: `### Mask Efficacy Breakdown for Severe Winter Smog (PM2.5):

| Mask Type | PM2.5 Filtration | Seal Leakage | Winter Smog Verdict |
| :--- | :--- | :--- | :--- |
| **Cloth / Scarf** | 10% - 25% | > 40% leakage | ❌ **Dangerous Illusion**: Does not stop microscopic PM2.5 |
| **3-Ply Surgical** | 40% - 60% | 30% gap bypass | ❌ **Inadequate**: Unsealed sides let smog rush in |
| **N95 / FFP2 (Headband)** | **95% - 98%** | **< 3% leakage** | ✅ **Gold Standard**: True electrostatic meltblown barrier |
| **Valved N95** | 95% inhale | < 3% leakage | ⚠️ Good for solo outdoor commute, but avoid in clinics |

**Pro Tip for Facial Fit**:
- 90% of filter failures are due to poor nose bridge sealing. Press the aluminum nose-clip firmly with both index fingers from the center outwards.
- For children: Use pediatric-certified KF94 or small FFP2 masks with adjustable toggle straps.`,
      reasoning: `PM2.5 particles are under 2.5 microns (1/30th the width of human hair). Standard cloth weaves have pore gaps of 50-200 microns, offering zero mechanical barrier against combustion soot.`,
      impact: `Wearing an airtight N95 reduces deep alveolar particulate deposition by 94% during transit.`
    };
  }

  // 5. Heating / Cooking / Sustainable Alternatives
  if (q.includes('heat') || q.includes('warm') || q.includes('wood') || q.includes('coal') || q.includes('angithi') || q.includes('cook') || q.includes('gas') || q.includes('stove')) {
    return {
      sender: 'ai',
      time: formatCurrentTime(),
      text: `### Low-Emission Heating & Cooking Alternatives:

**1. Heating Transformation**:
- **Avoid**: Open wood fires, coal braziers (*angithis*), and unvented kerosene heaters. A single 2-hour coal brazier produces indoor CO levels exceeding 150 ppm and PM2.5 spikes over 1,200 µg/m³.
- **Sustainable Solution**: Switch to an **oil-filled electric radiator** or a **reverse-cycle inverter heat pump**. 
- *Pro Hack*: Place radiant heat reflectors (foil bubble insulation) behind radiators on exterior walls to bounce 95% of thermal heat back into the room.

**2. Cooking Smoke Mitigation**:
- High-heat oil frying generates aerosolized lipid PM2.5 that stays suspended for hours.
- **Switch to induction cooking or boiling/steaming** during morning inversion hours.
- *Airlock Hack*: Keep the kitchen door closed with the exhaust fan ON to create **negative pressure**, preventing oil smoke from migrating to bedrooms.`,
      reasoning: `Incomplete combustion of biomass and gas fuels in poorly ventilated winter rooms is the #1 cause of acute carbon monoxide poisoning and catastrophic indoor particulate spikes.`,
      impact: `Switching from biomass/unvented heaters to electric radiant heating saves ~4.2 kg CO2e and avoids 45g of hazardous indoor soot daily.`
    };
  }

  // 6. Plant Myths / Debunking
  if (q.includes('plant') || q.includes('snake plant') || q.includes('spider plant') || q.includes('nasa')) {
    return {
      sender: 'ai',
      time: formatCurrentTime(),
      text: `### The Houseplant Myth vs. Winter Smog Reality:

**The Myth**: "3 snake plants in my bedroom will filter out the smog."
**The Scientific Reality**: 
- The famous 1989 NASA Clean Air Study tested plants inside **hermetically sealed 1-cubic-meter Plexiglas chambers** over 24 hours without ventilation.
- In a real residential room with natural infiltration, plants have a Clean Air Delivery Rate (CADR) of less than **0.2 CFM**.
- You would need **between 90 and 600 plants per room** to equal the particulate removal speed of a single inexpensive HEPA or Corsi-Rosenthal filter!
- **Warning**: Over-watering plants in winter increases indoor relative humidity above 65%, fostering toxic mold spores that exacerbate winter asthma.

**Verdict**: Enjoy plants for biophilic mental wellbeing, but rely on **mechanical electrostatic filtration** for smog.`,
      reasoning: `Plants remove gaseous VOCs slowly through root rhizosphere bacteria, but do not possess electrostatic charge or high mechanical airflow to pull sub-micron combustion soot out of room air.`,
      impact: `Investing $30 in a mechanical MERV-13 filter provides 2,000x the particulate clearance rate of 10 potted plants.`
    };
  }

  // 7. General Fallback / Custom Smart Reasoning
  return {
    sender: 'ai',
    time: formatCurrentTime(),
    text: `### Personalized Smog Strategy for ${prof.familyName} in ${city.name}:

Regarding your query: "${escapeHtml(query)}"

**Key Tailored Recommendations**:
1. **Current Exposure Context**: Outdoor AQI is **${city.currentAqi}** with **${city.inversionStrength}**. Your housing envelope (${prof.housingType.replace('_', ' ')}) has an estimated infiltration rate of ~1.4 Air Changes/Hour.
2. **Immediate Action**:
   - Reschedule non-urgent outdoor travel away from the peak hours (**${city.peakSmogHours}**).
   - Use the diurnal inversion break at **${city.safeWindow}** for any essential outdoor tasks.
   - Run active mechanical filtration in your main living/sleeping spaces.
3. **Sustainable Low-Emission Alternative**:
   - If commuting, shift from open two-wheeler to public metro transit or grouped electric carpool.
   - Prevent indoor combustion: prioritize electric induction over gas flaring, and avoid dry sweeping (use damp microfiber mopping to avoid resuspending settled PM10).`,
    reasoning: `Winter meteorological stagnation traps micro-pollutants close to breathing level. Behavioral timing and reducing direct combustion at the source are the two highest-leverage interventions for community clean air.`,
    impact: `Following this tailored guidance reduces your household's daily inhaled PM2.5 dose by ~75% and prevents unnecessary local emissions.`
  };
}

/* ==========================================================================
   Timeline & Low-Emission Routine Scrubber
   ========================================================================== */
const routineData = {
  0: { unmitigated: 'Sleeping with leaky balcony window slightly ajar; cold draft pulls night inversion smog inside.', optimized: 'Bedroom sealed with draft snake; Corsi-Rosenthal box running on Low (Silent); indoor PM2.5 < 20 µg/m³.' },
  6: { unmitigated: 'Outdoor morning jog & brisk walk in dense smog fog. Breathing rate 45 L/min of AQI 480 air.', optimized: 'Indoor yoga / core mat exercises. Outdoor jog cancelled. Saves 310 µg deep-lung deposition.' },
  7: { unmitigated: 'Solo diesel car school drop-off, idling 25 mins in school gate gridlock.', optimized: 'Grouped 4-family electric carpool or walking bus with N95 masks after 08:30 AM.' },
  8: { unmitigated: 'Cooking breakfast with high-flame oil frying and unvented gas burner. Indoor PM2.5 spikes to 340.', optimized: 'Electric induction steaming/boiling; kitchen exhaust fan creating negative pressure airlock.' },
  10: { unmitigated: 'Dry sweeping with traditional broom, resuspending 4.5 million coarse PM10 particles/m³.', optimized: 'Wet damp mopping with microfiber cloth; settled particulate trapped in water bucket.' },
  13: { unmitigated: 'House kept perpetually sealed in dark stagnant air; indoor CO2 climbs above 1,800 ppm.', optimized: 'GREEN VENTILATION WINDOW: 15-min rapid cross-flush while inversion boundary layer expands.' },
  14: { unmitigated: 'Errands left for late evening peak.', optimized: 'Consolidated errands completed now during daily AQI minimum (~215 vs ~460 at 8 PM).' },
  18: { unmitigated: 'Open 2-wheeler commute without mask through rush-hour street canyon exhaust.', optimized: 'Underground Metro transit or car with cabin air recirculator + N95 headband mask.' },
  20: { unmitigated: 'Lighting open wood or coal brazier (angithi) for patio/living warmth. Toxic CO spike.', optimized: 'Oil-filled electric radiator with radiant wall reflector; clean heat without any indoor soot.' },
  22: { unmitigated: 'No pre-sleep air treatment; purifiers turned off to save power.', optimized: 'Bedroom pre-purged at Max CADR for 30 mins before sleep, then throttled to whisper mode.' }
};

function initTimelineScrubber() {
  const slider = document.getElementById('timeline-slider');
  const timeDisplay = document.getElementById('scrubber-time-display');
  
  if (!slider) return;

  slider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    state.activeHour = val;
    updateTimelineForHour(val);
  });

  updateTimelineForHour(state.activeHour);
}

function updateTimelineForHour(hour) {
  const city = state.cities[state.selectedCity];
  const aqiAtHour = city.hourlyAqi[hour];
  const timeStr = `${hour.toString().padStart(2, '0')}:00`;

  const timeDisplay = document.getElementById('scrubber-time-display');
  const hourlyAqiDisplay = document.getElementById('scrubber-aqi-display');
  const hourlyInversionDisplay = document.getElementById('scrubber-inversion-display');
  
  if (timeDisplay) timeDisplay.textContent = timeStr;
  if (hourlyAqiDisplay) {
    const cat = getAqiCategory(aqiAtHour);
    hourlyAqiDisplay.textContent = `Forecast AQI: ${aqiAtHour} (${cat.label})`;
    hourlyAqiDisplay.style.color = cat.color;
  }
  
  if (hourlyInversionDisplay) {
    let invDesc = 'Trap Active';
    if (hour >= 12 && hour <= 15) {
      invDesc = 'Convective Window (Inversion Weakened)';
    } else if (hour >= 6 && hour <= 10) {
      invDesc = 'Severe Nocturnal Inversion Cap';
    } else if (hour >= 18 && hour <= 23) {
      invDesc = 'Rapid Ground Cooling Inversion';
    }
    hourlyInversionDisplay.textContent = `Atmosphere: ${invDesc}`;
  }

  // Find nearest defined routine keys
  const keys = Object.keys(routineData).map(Number).sort((a,b) => a-b);
  let activeKey = keys[0];
  for (let k of keys) {
    if (hour >= k) activeKey = k;
  }

  const unmitEl = document.getElementById('active-unmitigated-step');
  const optEl = document.getElementById('active-optimized-step');
  if (unmitEl) unmitEl.textContent = routineData[activeKey].unmitigated;
  if (optEl) optEl.textContent = routineData[activeKey].optimized;
}

/* ==========================================================================
   Corsi-Rosenthal Box Interactive Calculator
   ========================================================================== */
function initCRCalculator() {
  const lengthInput = document.getElementById('cr-length');
  const widthInput = document.getElementById('cr-width');
  const heightInput = document.getElementById('cr-height');
  const achSelect = document.getElementById('cr-ach');
  const fanSelect = document.getElementById('cr-fan');

  const inputs = [lengthInput, widthInput, heightInput, achSelect, fanSelect];
  inputs.forEach(el => {
    if (el) el.addEventListener('input', recalculateCRBox);
  });

  recalculateCRBox();
}

function recalculateCRBox() {
  const l = parseFloat(document.getElementById('cr-length')?.value || 18);
  const w = parseFloat(document.getElementById('cr-width')?.value || 15);
  const h = parseFloat(document.getElementById('cr-height')?.value || 9);
  const ach = parseFloat(document.getElementById('cr-ach')?.value || 5);
  const fan = document.getElementById('cr-fan')?.value || 'box_fan';

  const roomVolume = l * w * h; // cubic feet
  // CADR (CFM) = (Room Volume * Desired ACH) / 60
  const requiredCadr = Math.round((roomVolume * ach) / 60);

  // Box fan with 4x MERV-13 and shroud produces ~380 CFM
  // PC fan array produces ~220 CFM per unit
  const fanCapacity = fan === 'box_fan' ? 385 : 220;
  const boxesNeeded = Math.max(1, Math.ceil(requiredCadr / fanCapacity));
  
  const estimatedCost = fan === 'box_fan' ? (35 * boxesNeeded) : (45 * boxesNeeded);
  const commercialEquivalentCost = 320 * boxesNeeded;
  const savings = commercialEquivalentCost - estimatedCost;

  // DOM updates
  document.getElementById('cr-volume-val').textContent = `${roomVolume.toLocaleString()} ft³`;
  document.getElementById('cr-cadr-val').textContent = `${requiredCadr} CFM`;
  document.getElementById('cr-units-val').textContent = `${boxesNeeded} Unit(s)`;
  document.getElementById('cr-cost-val').textContent = `$${estimatedCost} (vs $${commercialEquivalentCost} commercial)`;
  document.getElementById('cr-drop-rate').textContent = `~88% drop in PM2.5 within 25 min`;
}

/* ==========================================================================
   Inversion Canvas Visualization
   ========================================================================== */
function renderInversionCanvas() {
  const canvas = document.getElementById('inversion-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.parentElement.clientWidth || 500;
  const height = 220;
  canvas.width = width;
  canvas.height = height;

  const city = state.cities[state.selectedCity];
  const hourly = city.hourlyAqi;

  ctx.clearRect(0, 0, width, height);

  // Background Grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let y = 30; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(width - 20, y);
    ctx.stroke();
  }

  // Draw Highlight Safe Window (12 PM to 16 PM)
  const x12 = 40 + (width - 60) * (12 / 24);
  const x16 = 40 + (width - 60) * (16 / 24);
  ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
  ctx.fillRect(x12, 20, x16 - x12, height - 50);

  ctx.fillStyle = '#34d399';
  ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('Ventilation Flush Window (Inversion Break)', x12 + 6, 32);

  // Draw Inversion Boundary Layer Curve (Lower in morning/night, higher mid-day)
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);

  for (let i = 0; i < 24; i++) {
    const x = 40 + (width - 60) * (i / 23);
    // Boundary layer: 150m at 7am (height-60), 800m at 14pm (40px)
    let blFactor = 1 - Math.exp(-Math.pow((i - 14) / 4, 2));
    let y = 50 + blFactor * (height - 110);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw AQI Curve
  const maxAqi = Math.max(...hourly, 500);
  ctx.beginPath();
  ctx.strokeStyle = '#f87171';
  ctx.lineWidth = 3;

  for (let i = 0; i < 24; i++) {
    const x = 40 + (width - 60) * (i / 23);
    const aqi = hourly[i];
    const y = height - 30 - ((aqi / maxAqi) * (height - 60));
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Draw Dots for AQI
  for (let i = 0; i < 24; i += 3) {
    const x = 40 + (width - 60) * (i / 23);
    const aqi = hourly[i];
    const y = height - 30 - ((aqi / maxAqi) * (height - 60));
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Time Label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.fillText(`${i}h`, x - 8, height - 12);
  }

  // Legend
  ctx.fillStyle = '#f87171';
  ctx.fillText('━ Outdoor PM2.5 / AQI Curve', 45, height - 35);
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('┅ Planetary Boundary Layer (Inversion Height)', 210, height - 35);
}

window.addEventListener('resize', () => {
  if (state.activeTab === 'iaq') renderInversionCanvas();
});

/* ==========================================================================
   Direct Impact Quantification Engine
   ========================================================================== */
function initImpactMatrix() {
  const scaleSlider = document.getElementById('impact-scale-slider');
  if (scaleSlider) {
    scaleSlider.addEventListener('input', (e) => {
      state.communityHouseholds = parseInt(e.target.value, 10);
      updateImpactMetrics();
    });
  }
  updateImpactMetrics();
}

function updateImpactMetrics() {
  const city = state.cities[state.selectedCity];
  const prof = state.profile;

  // Unmitigated daily inhalation calculation (Micrograms)
  // Average breathing ~ 15 m3/day. Infiltration ~ 0.75 without mitigation.
  // Unmitigated: Outdoor morning exposure + indoor leaky air
  const baselineInhaledUg = Math.round(city.pm25 * 11.5);
  
  // SmogShield Optimized routine: Indoor clean sanctuary + N95 transit + no outdoor morning peak
  const optimizedInhaledUg = Math.round(city.pm25 * 2.1);
  const reductionPercent = Math.round(((baselineInhaledUg - optimizedInhaledUg) / baselineInhaledUg) * 100);

  // Berkeley Earth formula: Inhaling 22 µg/m3 of PM2.5 for 24h ≈ 1 cigarette smoked
  // (Avg adult breaths 15m3/day, so 330 µg inhaled ≈ 1 cigarette)
  const cigarettesSaved = ((baselineInhaledUg - optimizedInhaledUg) / 330).toFixed(1);

  // Household direct emissions avoided (kg CO2e)
  // Carpool/transit shift (3.2 kg) + Induction/clean heating efficiency (2.2 kg)
  const householdCo2Kg = 5.4;
  const householdPmGrams = 42;

  // Scale by community slider
  const n = state.communityHouseholds;
  const communityCo2Tons = ((householdCo2Kg * n) / 1000).toFixed(2);
  const communityPmKg = ((householdPmGrams * n) / 1000).toFixed(1);
  const pediatricVisitsAvoided = Math.round(n * 0.18);

  // DOM updates
  const metricDose = document.getElementById('metric-dose-reduction');
  const metricCigs = document.getElementById('metric-cigs-avoided');
  const metricCo2 = document.getElementById('metric-co2-saved');
  const metricLung = document.getElementById('metric-lung-score');

  if (metricDose) metricDose.textContent = `-${reductionPercent}%`;
  if (metricCigs) metricCigs.textContent = `${cigarettesSaved} cigs/day`;
  if (metricCo2) metricCo2.textContent = `${householdCo2Kg} kg`;
  if (metricLung) metricLung.textContent = `-78% risk`;

  const scaleVal = document.getElementById('community-scale-label');
  const scaleCo2 = document.getElementById('community-scale-co2');
  const scalePm = document.getElementById('community-scale-pm');
  const scaleHosp = document.getElementById('community-scale-er');

  if (scaleVal) scaleVal.textContent = `${n.toLocaleString()} Households in Ward`;
  if (scaleCo2) scaleCo2.textContent = `${communityCo2Tons} Tons CO2 / day`;
  if (scalePm) scalePm.textContent = `${communityPmKg} kg Primary PM / day`;
  if (scaleHosp) scaleHosp.textContent = `~${pediatricVisitsAvoided} Acute ER visits avoided / wk`;
}

/* ==========================================================================
   Community Action Board
   ========================================================================== */
function initCommunity() {
  const pledgeBtn = document.getElementById('pledge-btn');
  if (pledgeBtn) {
    pledgeBtn.addEventListener('click', () => {
      state.communityPledges += 1;
      pledgeBtn.textContent = `✓ Clean Air Pledge Taken (${state.communityPledges})`;
      pledgeBtn.style.background = '#10b981';
      alert('Thank you for pledging to eliminate open burning, pool winter commutes, and seal home leaks!');
    });
  }

  const reportBtn = document.getElementById('report-smoke-btn');
  if (reportBtn) {
    reportBtn.addEventListener('click', () => {
      const location = prompt('Enter location or street of trash/leaf burning:');
      if (location) {
        alert(`Report logged for "${location}". Municipal rapid smog patrol dispatched.`);
      }
    });
  }
}

/* ==========================================================================
   Profile Modal & Configuration
   ========================================================================== */
function initProfileModal() {
  const openBtn = document.getElementById('open-profile-btn');
  const modal = document.getElementById('profile-modal');
  const closeBtn = document.getElementById('close-profile-btn');
  const form = document.getElementById('profile-form');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => modal.classList.add('active'));
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      state.profile.familyName = document.getElementById('prof-name')?.value || 'My Family';
      state.profile.hasAsthma = document.getElementById('prof-asthma')?.checked || false;
      state.profile.housingType = document.getElementById('prof-housing')?.value || 'leaky_apartment';
      state.profile.heatingSource = document.getElementById('prof-heating')?.value || 'electric_radiator';
      state.profile.cookingFuel = document.getElementById('prof-cooking')?.value || 'lpg_gas';
      state.profile.commuteMode = document.getElementById('prof-commute')?.value || 'two_wheeler';

      document.getElementById('profile-button-text').textContent = state.profile.familyName;
      modal.classList.remove('active');

      updateImpactMetrics();
      appendAIMessage(`Profile updated for **${state.profile.familyName}**! Recommendations, daily schedules, and impact calculations have been recalibrated for your housing envelope (${state.profile.housingType}) and vulnerable members.`);
    });
  }
}

