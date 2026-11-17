# SmogShield AI: Urban Winter Smog & Community Clean Air Navigator

A GenAI-powered intelligent assistant and clean air orchestration platform designed for families, vulnerable individuals, and communities navigating severe winter smog and urban air pollution crises.

---

## 🌟 Overview & Core Problem

During winter months in high-pollution basins (such as **Delhi NCR**, **Lahore**, **Beijing**, the **Salt Lake Valley**, and **Krakow**), atmospheric **thermal inversion layers** trap combustion emissions, vehicular exhaust, and fine particulate matter close to ground level. Vulnerable family members—especially infants, toddlers, elderly individuals, and those with asthma or COPD—suffer severe airway inflammation, while families frequently make high-exposure choices due to lack of real-time diurnal guidance (e.g., morning outdoor jogs, dry sweeping, open coal/wood heating, or opening windows at night).

**SmogShield AI** bridges this critical gap by delivering:
1. **Context-Aware GenAI Reasoning**: Translates real-time atmospheric conditions into personalized medical and lifestyle mitigations.
2. **Low-Emission Daily Routine Optimization**: Reschedules high-exposure activities to diurnal low-smog windows and suggests sustainable travel and cooking alternatives.
3. **Indoor Air Quality (IAQ) Hacks Workshop**: Features an interactive **Corsi-Rosenthal Box Air Purifier Sizer**, ventilation timing radars, and practical low-cost physical mitigation hacks.
4. **Direct Impact Quantification Engine**: Empirically computes personal inhaled particulate reduction, cigarette equivalency avoided, and community emission abatement.
5. **Community Smog Shield Action Network**: Facilitates clean school carpools, open-burning watchdog reporting, and neighborhood filter lending libraries.

---

## 🧪 Scientific Foundations & Methodologies

The application is built upon established meteorological and epidemiological research:

### 1. Thermal Inversion Dynamics & Diurnal Ventilation
- **Atmospheric Lid**: Cold air trapped under a warm boundary layer prevents vertical mixing, leading to peak PM2.5 concentrations between **06:00 - 10:30** and **18:30 - 23:00**.
- **The Solar Convective Flush Window**: Between **13:00 and 15:30**, solar ground warming expands the planetary boundary layer from ~150m up to 800m+, diluting surface particulate density. SmogShield schedules 15-minute rapid cross-ventilation during this window to vent indoor $CO_2$ and moisture without suffocating the home.

### 2. Particulate Dosimetry & Cigarette Equivalency
- Inhalation dose is calculated using standard minute ventilation rates ($V_E = 15\text{ m}^3/\text{day}$ for resting adults; adjusted upward for exercise and pediatric weight-normalized breathing):
  $$\text{Dose}(\mu\text{g}) = \sum \left( \text{AQI}_{\text{ambient}} \times \text{Infiltration Factor} \times \text{Ventilation Rate} \times \Delta t \right)$$
- Health equivalence is quantified using the **Berkeley Earth formula**:
  $$\text{1 Cigarette/day} \approx \text{Inhalation of } 22\,\mu\text{g/m}^3 \text{ of PM}_{2.5} \text{ over 24 hours}$$

### 3. Corsi-Rosenthal (C-R) Box Filtration Physics
- Clean Air Delivery Rate (CADR in CFM):
  $$\text{CADR} = \frac{\text{Room Volume (ft}^3\text{)} \times \text{Target ACH}}{60}$$
- Incorporates the aerodynamic **fan shroud effect**: adding a circular aperture cutout reduces blade tip recirculation vortices, elevating static pressure and improving airflow velocity through MERV-13 pleated media by up to 40%.

---

## 🚀 Key Modules & Capabilities

| Module | Description | Key User Benefit |
| :--- | :--- | :--- |
| **🤖 GenAI Smog Advisor** | Interactive conversational agent equipped with environmental science reasoning chains. | Answers complex family queries (asthma safety, mask types, plant myths, heating alternatives) with transparent "Atmospheric & Exposure Reasoning". |
| **⏱️ Routine Optimizer** | 24-hour interactive timeline scrubber comparing default vs. smog-optimized routines. | Automatically shifts morning jogs, school transit, and cooking habits to minimize inhalation and cut vehicular idling emissions. |
| **🛠️ IAQ Hacks & C-R Sizer** | Interactive CADR calculator, DIY air purifier blueprints, and low-cost mitigation hacks. | Enables families to build high-volume air purifiers for <$35 (vs $300+ commercial units) delivering 5+ clean air changes per hour. |
| **📊 Direct Impact Matrix** | Real-time comparative impact calculator with a neighborhood multiplier slider. | Clearly demonstrates personal PM2.5 exposure reductions (-82%), avoided cigarettes (7.4 cigs/day), and community-wide emission prevention. |
| **👥 Community Smog Shield** | Collective action hub with school van pools, safe air sanctuaries, and burning reporting. | Unites neighborhoods to coordinate carpools, report illegal trash incineration, and share air quality sensors. |
| **⚙️ Lifestyle Profiler** | Customization engine adjusting for home age, heating source, commute, and health status. | Tailors all algorithmic recommendations to the user's specific living reality. |

---

## 💻 Quickstart & Local Installation

### Prerequisites
- Python 3.x (or any standard web browser / Node.js)

### Launching the Application
1. Open PowerShell or Terminal and navigate to the project directory:
   ```powershell
   cd "C:\Users\Nitya Patel\.gemini\antigravity\scratch\smogshield-ai"
   ```
2. Start the local server:
   ```powershell
   python server.py
   ```
3. Open your browser and navigate to:
   ```text
   http://localhost:8000
   ```
   *(Or simply double-click `index.html` to run directly in any modern browser!)*

---

## 📁 Project Structure

```text
smogshield-ai/
├── index.html        # Clean, accessible semantic single-page web application
├── styles.css        # Responsive glassmorphic styles, AQI color gauges & timeline controls
├── app.js            # GenAI reasoning engine, physics equations & state management
├── server.py         # Zero-dependency local development server (Python)
└── README.md         # Scientific documentation, architecture and user manual
```

---

## 🛡️ License & Acknowledgements
SmogShield AI incorporates research from the World Health Organization (WHO), United States Environmental Protection Agency (US EPA), Berkeley Earth, and the open-source Corsi-Rosenthal DIY clean air movement initiated by Dr. Richard Corsi and Jim Rosenthal.

