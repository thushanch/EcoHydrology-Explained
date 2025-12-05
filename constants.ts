import { Module, GlossaryItem } from './types';

export const SYSTEM_INSTRUCTION = `
You are the **EcoHydro Visualizer**, an advanced interactive educational tool.
Your goal is to teach ecohydrology through a cycle of: **Theory -> Visual Simulation -> Prediction -> Verification.**

**CORE RULES:**
1.  **Visual First:** Concepts must be visualized. When you need to generate an image, append a tag like \`<DRAW>...image prompt description...</DRAW>\` to the end of your response.
2.  **Theory Assessment:** Do not just lecture. Explain, then pause and ask the user to PREDICT.
3.  **Image Style:** All image prompts inside <DRAW> tags must end with: "Educational scientific illustration, high resolution, schematic cross-section, white background, distinct colors, vector art style, clear labels."

**SESSION WORKFLOW:**

**Phase 1: Concept & Baseline**
*   Explain the concept briefly.
*   Generate the baseline visual prompt in \`<DRAW>\` tags.
*   **CRITICAL STEP:** After showing the image, ask the user to describe what they see in their own words to confirm they understand the baseline state before moving on.
*   **STOP** and wait for user input.

**Phase 2: The Challenge**
*   Acknowledge the user's description and provide gentle correction if needed.
*   Introduce a variable change (e.g., "Summer approaches", "Flood pulse begins").
*   Ask the user to PREDICT the outcome.
*   **STOP** and wait for user input.

**Phase 3: Assessment & Result**
*   Assess the user's prediction. Correct misconceptions gently.
*   Generate the result visual prompt in \`<DRAW>\` tags representing the new state.
*   Compare the two states.

**TONE:**
Scientific, encouraging, clear, and structured.

**IMPORTANT:**
You are communicating with a web app that parses \`<DRAW>\` tags. Ensure the content inside \`<DRAW>\` is a descriptive prompt for an image generator.
Do not output markdown images (e.g., ![...]), only the \`<DRAW>\` tag.
`;

export const MODULES: Module[] = [
  {
    id: 'river-meander',
    title: 'River Meander & Oxbows',
    icon: '🌊',
    description: 'Explore how flow velocity and erosion create winding rivers and oxbow lakes.',
    initialPrompt: 'Start the "River Meander Evolution" module. Explain the basic mechanics of a straight river channel beginning to curve, and generate a baseline image of a slightly meandering river with velocity vectors indicated.'
  },
  {
    id: 'lake-stratification',
    title: 'Lake Stratification',
    icon: '🌡️',
    description: 'Understand thermal layers (Epilimnion, Thermocline, Hypolimnion) in lakes.',
    initialPrompt: 'Start the "Lake Stratification" module. Explain the state of a deep lake in early spring (uniform temperature) and generate a baseline cross-section image of this state.'
  },
  {
    id: 'groundwater-plume',
    title: 'Groundwater Plume',
    icon: '🛢️',
    description: 'Track contamination movement through aquifers based on hydraulic gradients.',
    initialPrompt: 'Start the "Groundwater Contamination Plume" module. Show a cross-section of an aquifer with a new surface spill (source), but no plume yet. Explain the hydrogeological setting.'
  },
  {
    id: 'wetland-hydro',
    title: 'Wetland Hydro-patterning',
    icon: '🌾',
    description: 'Visualize vegetation zonation changes during flood pulses and drawdowns.',
    initialPrompt: 'Start the "Wetland Hydroperiod" module. Explain the "Flood Pulse" concept and generate a cross-section of a wetland in a high-water state with submerged vegetation.'
  }
];

export const GLOSSARY_TERMS: GlossaryItem[] = [
  // River Morphology
  { term: "Oxbow Lake", definition: "A U-shaped lake that forms when a wide meander of a river is cut off, creating a free-standing body of water.", category: "River Morphology" },
  { term: "Thalweg", definition: "The line of lowest elevation within a valley or watercourse, where the current is usually fastest and deepest.", category: "River Morphology" },
  { term: "Point Bar", definition: "An alluvial deposit that forms by accretion on the inner side of an expanding loop of a river.", category: "River Morphology" },
  { term: "Cut Bank", definition: "The outside bank of a water channel (stream), which is continually undergoing erosion.", category: "River Morphology" },

  // Lake Stratification
  { term: "Epilimnion", definition: "The upper layer of water in a stratified lake, characterized by warmer water, higher dissolved oxygen, and mixing by wind.", category: "Lake Stratification" },
  { term: "Thermocline", definition: "A distinct layer in a large body of water in which temperature changes more rapidly with depth than it does in the layers above or below.", category: "Lake Stratification" },
  { term: "Hypolimnion", definition: "The lower layer of water in a stratified lake, typically cooler, denser, and often lower in dissolved oxygen.", category: "Lake Stratification" },
  { term: "Turnover", definition: "The seasonal mixing of the entire water column in a lake, usually in spring and fall.", category: "Lake Stratification" },

  // Groundwater
  { term: "Hydraulic Gradient", definition: "The slope of the water table or potentiometric surface that drives groundwater movement from high head to low head.", category: "Groundwater" },
  { term: "Vadose Zone", definition: "The unsaturated zone between the land surface and the water table where soil pores contain both air and water.", category: "Groundwater" },
  { term: "Aquifer", definition: "A body of permeable rock that can contain or transmit groundwater.", category: "Groundwater" },
  { term: "Plume", definition: "A body of one fluid moving through another, such as contaminated groundwater moving through an aquifer.", category: "Groundwater" },

  // Wetlands
  { term: "Hydroperiod", definition: "The seasonal pattern of the water level in a wetland, defining how long it is inundated each year.", category: "Wetlands" },
  { term: "Flood Pulse", definition: "The periodic rise and fall of river waters that inundates the floodplain, exchanging nutrients and organisms.", category: "Wetlands" },
  { term: "Riparian Zone", definition: "The interface between land and a river or stream.", category: "Wetlands" },
  { term: "Evapotranspiration", definition: "The sum of evaporation from the land surface plus transpiration from plants.", category: "Wetlands" }
];