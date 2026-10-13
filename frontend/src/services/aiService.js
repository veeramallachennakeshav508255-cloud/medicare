import apiClient, { ENABLE_MOCK_FALLBACK } from './api';
import { getStoredDoctors } from './storage';

// Medical triage knowledge base for symptom parsing and specialty routing
const SYMPTOM_PATTERNS = [
  {
    keywords: ["fever", "cough", "sore throat", "throat", "chills", "runny nose", "cold", "flu", "phlegm", "congestion"],
    specialty: "General Medicine",
    secondarySpecialty: "ENT (Otolaryngology)",
    urgency: "Moderate",
    summary: "Your symptoms of fever, cough, and sore throat are commonly associated with upper respiratory tract conditions, such as viral pharyngitis, acute bronchitis, or seasonal influenza.",
    redFlags: [
      "Fever exceeding 103°F (39.4°C) or lasting longer than 3–4 days",
      "Difficulty breathing or persistent chest pressure",
      "Inability to swallow liquids or severe throat swelling",
      "Coughing up blood or dark rust-colored sputum"
    ],
    selfCareTips: [
      "Stay well hydrated with warm broths, honey-lemon water, and herbal teas",
      "Use warm saline gargles 3–4 times daily to soothe throat inflammation",
      "Rest and monitor temperature periodically"
    ],
    questionsForDoctor: [
      "Could this be a bacterial infection requiring antibiotics, or is it viral?",
      "Are there prescription decongestants or cough suppressants recommended?",
      "When should I schedule a follow-up if symptoms persist?"
    ]
  },
  {
    keywords: ["chest pain", "chest tightness", "shortness of breath", "heart", "palpitation", "left arm", "jaw pain", "angina"],
    specialty: "Cardiology",
    secondarySpecialty: "General Medicine",
    urgency: "HIGH_URGENCY",
    isEmergency: true,
    summary: "CRITICAL ALERT: Chest pain, shortness of breath, and pressure can indicate acute cardiovascular compromise (such as myocardial ischemia or angina) requiring immediate emergency medical evaluation.",
    redFlags: [
      "Crushing chest pressure radiating to arm, neck, jaw, or back",
      "Profuse sweating, sudden cold clamminess, nausea, or dizziness",
      "Sudden shortness of breath with bluish lips or fingertips"
    ],
    selfCareTips: [
      "DO NOT wait or attempt to drive yourself if experiencing severe crushing chest pain. Call emergency services (911) immediately."
    ],
    questionsForDoctor: [
      "Should I undergo an emergency 12-lead ECG and cardiac enzyme panel?",
      "What is my cardiovascular risk assessment profile?"
    ]
  },
  {
    keywords: ["headache", "migraine", "dizziness", "vertigo", "numbness", "tingling", "seizure", "memory", "blurry vision", "concussion"],
    specialty: "Neurology",
    secondarySpecialty: "General Medicine",
    urgency: "Moderate to High",
    summary: "Headache and neurological symptoms may relate to tension-type headaches, vascular migraines, cervical strain, or inner-ear vestibular balance issues.",
    redFlags: [
      "Sudden explosive 'thunderclap' headache reaching maximum intensity within seconds",
      "Headache accompanied by stiff neck, high fever, or confusion",
      "Weakness, facial drooping, or slurred speech on one side of the body"
    ],
    selfCareTips: [
      "Rest in a quiet, darkened room away from bright screens",
      "Maintain adequate hydration and record symptom onset triggers in a log",
      "Avoid excess caffeine or known dietary triggers"
    ],
    questionsForDoctor: [
      "Would brain imaging (MRI or CT) be appropriate for these symptoms?",
      "Are preventative migraine medications suitable for my frequency of attacks?"
    ]
  },
  {
    keywords: ["knee", "joint", "back pain", "spine", "bone", "fracture", "swelling", "stiffness", "arthritis", "sprain", "shoulder", "hip"],
    specialty: "Orthopedics",
    secondarySpecialty: "Physical Therapy",
    urgency: "Routine to Moderate",
    summary: "Musculoskeletal symptoms such as joint stiffness, knee pain, or lumbar discomfort frequently arise from ligament strain, meniscus wear, osteoarthritis, or spinal disc alignment.",
    redFlags: [
      "Inability to bear any weight on the affected limb",
      "Visible joint deformity or rapid, hot red swelling",
      "Loss of sensation or numbness radiating down into the foot or groin"
    ],
    selfCareTips: [
      "Apply the R.I.C.E protocol: Rest, Ice (15–20 min intervals), Compression, and Elevation",
      "Avoid high-impact jumping or heavy twisting movements until evaluated"
    ],
    questionsForDoctor: [
      "Do I need an X-ray or MRI scan to inspect the joint space and cartilage?",
      "Is physical therapy and joint support recommended before medication?"
    ]
  },
  {
    keywords: ["skin", "rash", "itching", "acne", "bumps", "eczema", "mole", "hives", "red spots", "dermatitis"],
    specialty: "Dermatology",
    secondarySpecialty: "Allergy & Immunology",
    urgency: "Routine",
    summary: "Dermal symptoms including rashes, itching, or inflammation may stem from allergic contact dermatitis, fungal causes, eczema flare-ups, or acne vulgaris.",
    redFlags: [
      "Rapidly spreading rash accompanied by facial or lip swelling and breathing difficulty",
      "Blistering over a wide area or fever concurrent with the rash",
      "Changing moles with irregular borders or bleeding"
    ],
    selfCareTips: [
      "Avoid scratching to prevent secondary bacterial infection",
      "Use mild, hypoallergenic fragrance-free cleansers and lukewarm water",
      "Apply pure petroleum jelly or soothing calamine lotion"
    ],
    questionsForDoctor: [
      "Could this rash be caused by an allergic reaction or an underlying dermatitis?",
      "Is a topical corticosteroid or prescription ointment appropriate?"
    ]
  },
  {
    keywords: ["stomach", "abdominal", "nausea", "vomiting", "diarrhea", "acid", "heartburn", "bloating", "indigestion", "constipation"],
    specialty: "Gastroenterology",
    secondarySpecialty: "General Medicine",
    urgency: "Moderate",
    summary: "Gastrointestinal discomfort such as abdominal pain, nausea, or acid reflux can arise from gastritis, gastroesophageal reflux (GERD), food intolerance, or irritable bowel syndrome.",
    redFlags: [
      "Severe, sharp abdominal pain localized to the lower right abdomen",
      "Vomiting blood or black coffee-ground material",
      "High fever, jaundice (yellowing of eyes/skin), or persistent dehydration"
    ],
    selfCareTips: [
      "Eat small, frequent bland meals (BRAT diet: bananas, rice, applesauce, toast)",
      "Avoid spicy, greasy, acidic, or caffeinated items",
      "Sip electrolyte-rich solutions to maintain hydration"
    ],
    questionsForDoctor: [
      "Is testing for H. pylori or an upper endoscopy recommended?",
      "Would acid suppression medications (e.g. PPIs) be beneficial for me?"
    ]
  },
  {
    keywords: ["child", "baby", "toddler", "pediatric", "infant", "vaccine", "teething"],
    specialty: "Pediatrics",
    secondarySpecialty: "General Medicine",
    urgency: "Moderate to High",
    summary: "Pediatric health concerns require tender age-tailored evaluation, as infants and children process infections differently than adults.",
    redFlags: [
      "Infant under 3 months with rectal temperature of 100.4°F (38°C) or higher",
      "Lethargy, unusual drowsiness, or refusal to take any fluids",
      "Stridor, wheezing, or chest retractions (skin sucking in around ribs when breathing)"
    ],
    selfCareTips: [
      "Ensure continuous fluid intake (breast milk, formula, or pediatric electrolyte)",
      "Never administer aspirin to children or teenagers due to Reye's syndrome risk"
    ],
    questionsForDoctor: [
      "Is the child's fever within an expected viral window?",
      "Are there prescription dosages calibrated specifically to my child's current weight?"
    ]
  }
];

export const aiService = {
  async triageSymptoms(userPrompt) {
    try {
      const response = await apiClient.post('/api/ai/triage', { prompt: userPrompt });
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK) {
        return this.localTriageEngine(userPrompt);
      }
      throw error;
    }
  },

  localTriageEngine(userPrompt) {
    const text = userPrompt.toLowerCase();
    const doctors = getStoredDoctors();

    // Check emergency chest pain keywords first
    const emergencyMatch = text.includes("chest pain") || text.includes("heart attack") || (text.includes("shortness of breath") && text.includes("chest"));
    
    // Find best match in knowledge base
    let bestMatch = null;
    let highestScore = 0;

    for (const pattern of SYMPTOM_PATTERNS) {
      let score = 0;
      for (const kw of pattern.keywords) {
        if (text.includes(kw)) {
          score += 2;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = pattern;
      }
    }

    if (!bestMatch || highestScore === 0) {
      // General fallback
      const generalDocs = doctors.filter(d => d.specialty === "General Medicine").slice(0, 2);
      return {
        isEmergency: false,
        summary: `Thank you for sharing your symptoms. Based on your description: "${userPrompt}", our clinical AI recommends consulting a General Physician for a holistic physical examination and laboratory workup.`,
        recommendedSpecialty: "General Medicine",
        secondarySpecialty: "Internal Medicine",
        urgency: "Routine",
        redFlags: [
          "High fever (>103°F) unyielding to over-the-counter antipyretics",
          "Persistent shortness of breath, dizziness, or fainting",
          "Sudden unbearable or unremitting pain"
        ],
        selfCareTips: [
          "Rest adequately and ensure steady hydration throughout the day",
          "Document any new symptoms, temperature readings, and when they began"
        ],
        questionsForDoctor: [
          "What diagnostic blood work or scans do you recommend to pinpoint the cause?",
          "Are there lifestyle or dietary modifications that could assist my recovery?"
        ],
        recommendedDoctors: generalDocs,
        disclaimer: "CareConnect AI does not provide medical diagnosis. Always seek the advice of a qualified healthcare provider for proper diagnosis and treatment."
      };
    }

    // Filter matching doctors
    const matchingDocs = doctors.filter(
      d => d.specialty === bestMatch.specialty || d.specialty === bestMatch.secondarySpecialty
    ).slice(0, 2);

    return {
      isEmergency: !!bestMatch.isEmergency || emergencyMatch,
      summary: bestMatch.summary,
      recommendedSpecialty: bestMatch.specialty,
      secondarySpecialty: bestMatch.secondarySpecialty,
      urgency: bestMatch.urgency,
      redFlags: bestMatch.redFlags,
      selfCareTips: bestMatch.selfCareTips,
      questionsForDoctor: bestMatch.questionsForDoctor,
      recommendedDoctors: matchingDocs,
      disclaimer: "CareConnect AI does not provide medical diagnosis. Always consult a licensed healthcare professional for medical emergencies and clinical evaluations."
    };
  }
};

export default aiService;
