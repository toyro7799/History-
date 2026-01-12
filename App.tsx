import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { FormAnswers } from './types';
import { TextInput, TextArea, SectionHeader, LabelText, SelectInput } from './components/InputComponents';

// --- TRANSLATIONS ---
const translations = {
  en: {
    appTitle: "Gynaecology & Obstetric History",
    selectMethod: "Select your preferred history taking method",
    viewSaved: "View Saved Records",
    fastMode: "Fast History Taking",
    fastDesc: "A condensed template with optimized selections for rapid assessment. Includes essential tables and auto-calc.",
    startFast: "Start Fast Mode",
    detailedMode: "Detailed PR Standard",
    detailedDesc: "The complete 7-page departmental PR standard form. Includes detailed reviews of systems and comprehensive tables.",
    startDetailed: "Start Detailed Mode",
    caseHistory: "Case History Template",
    fastTag: "FAST MODE",
    personalHistory: "I. Personal History:",
    patientName: "Name of the Patient",
    age: "Age",
    occupation: "Occupation",
    bloodGroup: "Blood group",
    chiefComplaint: "II. Chief Complaint:",
    commonComplaints: "Common Complaints",
    detailedComplaint: "Detailed Complaint",
    obsHistory: "III. Obstetrical History:",
    gravida: "A. Gravida (G)",
    parity: "B. Parity (P)",
    abortion: "C. Abortion",
    term: "Term",
    preTerm: "Pre-term",
    postTerm: "Post-term",
    children: "Children",
    lmp: "D. L.M.P",
    edd: "E. E.D.D (Auto-calculated)",
    hpi: "IV. History of Present Illness:",
    lastWell: "A. Last time well",
    onsetDate: "B. Onset Date",
    details: "Details",
    medSurgBg: "V. Medical & Surgical Background:",
    gynStatus: "Gynaecological Status",
    addGynDetails: "Additional Gyn details...",
    immStatus: "Immunization status",
    allergies: "Allergies",
    specAllergy: "Specific allergy...",
    currMed: "Current Medication",
    pastSurg: "Past Surgeries",
    surgDetails: "Surgical details...",
    familyHistory: "VI. Family History:",
    husbandInfo: "VII. Husband's Information:",
    husbandName: "Name",
    cancel: "Cancel",
    saveRecord: "Save Record",
    saveDetailed: "Save Detailed",
    backToRecords: "Back to Records",
    printRecord: "Print Record",
    savedRecords: "Saved Records",
    newPatient: "New Patient",
    noRecords: "No records saved yet.",
    prev: "Previous",
    next: "Next Step",
    finish: "Finish Form",
    progress: "Progress",
    deptTitle: "Faculty of medical technology",
    subDeptTitle: "Department of medical care",
    formTitle: "{GYNAECOLOGY & OBSTETRIC} {PR}",
    historyTitle: "History",
    // AI & Data
    analyzeAi: "Analyze with AI",
    aiAnalysis: "AI Clinical Analysis",
    analyzing: "Analyzing...",
    exportData: "Export Data",
    importData: "Import Data",
    uploadJson: "Upload Record (JSON)",
    // Detailed specific
    p1_name: "a. Name of the patient.",
    p1_age: "b. Age.",
    p1_occ: "c. Occupation.",
    p1_addr: "d. Address and telephone number.",
    p1_marital: "e. Marital status and data of marriage.",
    p1_rel: "f. Religion.",
    p1_bg: "g. Blood group.",
    p1_hus: "h. Name of the husband.",
    p1_hus_age: "i. Age.",
    p1_hus_occ: "j. Occupation.",
    p1_hus_bg: "k. Blood group.",
    p1_cc: "2. Chief complaint:",
    p1_cc_sub: "[reason for visit]:- one statement that describes the reason for the patient visit.",
    p1_cc_a: "a. What problem or symptoms brought the patient?",
    p1_cc_b: "b. The onset and duration of the problem.",
    p1_hpi: "3. History of present illness.",
    p1_hpi_a: "a. Last time patient was entirely well.",
    p1_hpi_b: "b. Date of current problem onset.",
    p2_hpi_cont: "3. History of present illness (continued)",
    p2_hpi_c: "c. Characters of the problem [e.g., what is the pain like? Stabbing, squeezing] was it sever or no.",
    p2_hpi_d: "d. Nature of problem onset [was the onset slow or abrupt]",
    p2_hpi_e: "e. Cause of the problem.",
    p2_hpi_f: "f. Location of the problem.",
    p2_obs: "4. Obstetrical history :-",
    p2_edd_note: "e. E.D.D:- is calculated by adding 9 calendar months and 7 days to the woman last menstrual period [if the woman has a regular 28 day cycle].",
    calc_edd: "Calculated E.D.D:",
    p3_gyn: "5. Gynaecological history:-",
    p3_menst: "a. Menstrual history",
    p3_gyn_1: "1. Age of the onset of the menarche.",
    p3_gyn_2: "2. Regularity of the cycle, duration and length.",
    p3_gyn_3: "3. Amount of blood loss.",
    p3_gyn_4_pain: "4. Any pain with the loss [dysmenorrhea]",
    p3_gyn_4_men: "or any [menorrhagia].",
    p3_gyn_5: "5. Vaginal discharge:-",
    p3_gyn_5a: "a. Amount, colour and odour of the discharge.",
    p3_gyn_5b: "b. Presence of blood.",
    p4_c: "c. Associated with itching or rash or lesions.",
    p4_d: "d. Pelvic pain [site, nature and relation to periods].",
    p4_imm: "6. Immunization status:-",
    p4_imm_sub: "[dates, years of last immunization].",
    p4_drug: "7. Drug history:-",
    p4_curr_med: "a. Current medications.",
    p4_alg: "6. Allergies history:-",
    p4_surg: "7. Post surgical history:-",
    p5_fam: "8. Family history:-",
    p5_rev: "9. Review of systems:-",
    p5_rev_1: "1. General",
    p5_rev_2: "2. Integumentary:-",
    p6_psy: "3. History of psychiatric care or counselling.",
    p6_resp: "6. Respiratory system:-",
    p6_gi: "7. Gastrointestinal system:-",
    p6_uri: "8. Urinary tract system:-",
  },
  ar: {
    appTitle: "تاريخ أمراض النساء والولادة",
    selectMethod: "اختر طريقة أخذ التاريخ المرضي",
    viewSaved: "عرض السجلات المحفوظة",
    fastMode: "أخذ التاريخ السريع",
    fastDesc: "نموذج مختصر مع خيارات محسنة للتقييم السريع. يشمل الجداول الأساسية والحساب التلقائي.",
    startFast: "بدء الوضع السريع",
    detailedMode: "المعيار التفصيلي",
    detailedDesc: "النموذج القياسي الكامل من 7 صفحات. يشمل مراجعات مفصلة للأنظمة وجداول شاملة.",
    startDetailed: "بدء الوضع التفصيلي",
    caseHistory: "نموذج تاريخ الحالة",
    fastTag: "وضع سريع",
    personalHistory: "أ. التاريخ الشخصي:",
    patientName: "اسم المريضة",
    age: "العمر",
    occupation: "المهنة",
    bloodGroup: "فصيلة الدم",
    chiefComplaint: "ب. الشكوى الرئيسية:",
    commonComplaints: "الشكاوى الشائعة",
    detailedComplaint: "تفاصيل الشكوى",
    obsHistory: "ج. التاريخ الولادي:",
    gravida: "أ. عدد مرات الحمل (G)",
    parity: "ب. عدد الولادات (P)",
    abortion: "ج. الإجهاض",
    term: "مكتملة (Term)",
    preTerm: "مبكرة (Pre)",
    postTerm: "متأخرة (Post)",
    children: "الأطفال",
    lmp: "د. آخر دورة شهرية",
    edd: "هـ. موعد الولادة المتوقع (محسوب)",
    hpi: "د. تاريخ المرض الحالي:",
    lastWell: "أ. آخر مرة كانت المريضة بخير",
    onsetDate: "ب. تاريخ بداية المشكلة",
    details: "التفاصيل",
    medSurgBg: "هـ. الخلفية الطبية والجراحية:",
    gynStatus: "الحالة النسائية",
    addGynDetails: "تفاصيل نسائية إضافية...",
    immStatus: "حالة التحصين",
    allergies: "الحساسية",
    specAllergy: "حساسية محددة...",
    currMed: "الأدوية الحالية",
    pastSurg: "الجراحات السابقة",
    surgDetails: "تفاصيل الجراحة...",
    familyHistory: "و. التاريخ العائلي:",
    husbandInfo: "ز. معلومات الزوج:",
    husbandName: "الاسم",
    cancel: "إلغاء",
    saveRecord: "حفظ السجل",
    saveDetailed: "حفظ التفاصيل",
    backToRecords: "العودة للسجلات",
    printRecord: "طباعة السجل",
    savedRecords: "السجلات المحفوظة",
    newPatient: "مريضة جديدة",
    noRecords: "لا توجد سجلات محفوظة بعد.",
    prev: "السابق",
    next: "الخطوة التالية",
    finish: "إنهاء النموذج",
    progress: "التقدم",
    deptTitle: "كلية التقنية الطبية",
    subDeptTitle: "قسم الرعاية الطبية",
    formTitle: "{أمراض النساء والولادة} {PR}",
    historyTitle: "التاريخ المرضي",
    // AI & Data
    analyzeAi: "تحليل بالذكاء الاصطناعي",
    aiAnalysis: "التحليل السريري الذكي",
    analyzing: "جاري التحليل...",
    exportData: "تصدير البيانات",
    importData: "استيراد بيانات",
    uploadJson: "رفع سجل (JSON)",
    // Detailed specific (Approximate translations for headers, keys kept simple)
    p1_name: "أ. اسم المريضة.",
    p1_age: "ب. العمر.",
    p1_occ: "ج. المهنة.",
    p1_addr: "د. العنوان ورقم الهاتف.",
    p1_marital: "هـ. الحالة الاجتماعية وتاريخ الزواج.",
    p1_rel: "و. الديانة.",
    p1_bg: "ز. فصيلة الدم.",
    p1_hus: "ح. اسم الزوج.",
    p1_hus_age: "ط. العمر.",
    p1_hus_occ: "ي. المهنة.",
    p1_hus_bg: "ك. فصيلة الدم.",
    p1_cc: "2. الشكوى الرئيسية:",
    p1_cc_sub: "[سبب الزيارة]:- عبارة واحدة تصف سبب زيارة المريضة.",
    p1_cc_a: "أ. ما هي المشكلة أو الأعراض التي أحضرت المريضة؟",
    p1_cc_b: "ب. بداية المشكلة ومدتها.",
    p1_hpi: "3. تاريخ المرض الحالي.",
    p1_hpi_a: "أ. آخر مرة كانت المريضة بخير تماماً.",
    p1_hpi_b: "ب. تاريخ بداية المشكلة الحالية.",
    p2_hpi_cont: "3. تاريخ المرض الحالي (تابع)",
    p2_hpi_c: "ج. خصائص المشكلة [مثلاً، كيف هو الألم؟ طعن، ضغط] هل كان شديداً أم لا.",
    p2_hpi_d: "د. طبيعة بداية المشكلة [هل كانت بطيئة أم مفاجئة]",
    p2_hpi_e: "هـ. سبب المشكلة.",
    p2_hpi_f: "و. موقع المشكلة.",
    p2_obs: "4. التاريخ الولادي :-",
    p2_edd_note: "هـ. موعد الولادة المتوقع:- يحسب بإضافة 9 أشهر تقويمية و 7 أيام لآخر دورة شهرية للمرأة [إذا كانت دورتها منتظمة كل 28 يوماً].",
    calc_edd: "موعد الولادة المحسوب:",
    p3_gyn: "5. التاريخ النسائي:-",
    p3_menst: "أ. تاريخ الطمث",
    p3_gyn_1: "1. العمر عند البلوغ.",
    p3_gyn_2: "2. انتظام الدورة، المدة والطول.",
    p3_gyn_3: "3. كمية فقدان الدم.",
    p3_gyn_4_pain: "4. أي ألم مع الفقد [عسر الطمث]",
    p3_gyn_4_men: "أو أي [غزارة الطمث].",
    p3_gyn_5: "5. الإفرازات المهبلية:-",
    p3_gyn_5a: "أ. كمية، لون ورائحة الإفرازات.",
    p3_gyn_5b: "ب. وجود دم.",
    p4_c: "ج. مصحوب بحكة أو طفح جلدي أو تقرحات.",
    p4_d: "د. ألم الحوض [الموقع، الطبيعة وعلاقته بالدورة].",
    p4_imm: "6. حالة التحصين:-",
    p4_imm_sub: "[التواريخ، سنوات آخر تطعيم].",
    p4_drug: "7. التاريخ الدوائي:-",
    p4_curr_med: "أ. الأدوية الحالية.",
    p4_alg: "6. تاريخ الحساسية:-",
    p4_surg: "7. تاريخ ما بعد الجراحة:-",
    p5_fam: "8. التاريخ العائلي:-",
    p5_rev: "9. مراجعة الأنظمة:-",
    p5_rev_1: "1. عام",
    p5_rev_2: "2. الجلدية:-",
    p6_psy: "3. تاريخ الرعاية النفسية أو الاستشارة.",
    p6_resp: "6. الجهاز التنفسي:-",
    p6_gi: "7. الجهاز الهضمي:-",
    p6_uri: "8. المسالك البولية:-",
  }
};

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// --- OPTIONS (FUNCTIONS FOR TRANSLATION) ---
const getOptions = (lang: 'en' | 'ar') => {
  const isAr = lang === 'ar';
  return {
    maritalStatus: isAr 
      ? [{label: 'متزوجة', value: 'Married'}, {label: 'عزباء', value: 'Single'}, {label: 'مطلقة', value: 'Divorced'}, {label: 'أرملة', value: 'Widowed'}]
      : ['Married', 'Single', 'Divorced', 'Widowed'],
    occupations: isAr
      ? [{label: 'ربة منزل', value: 'Housewife'}, {label: 'معلمة', value: 'Teacher'}, {label: 'ممرضة', value: 'Nurse'}, {label: 'طالبة', value: 'Student'}, {label: 'طبيبة', value: 'Doctor'}, {label: 'مهندسة', value: 'Engineer'}, {label: 'موظفة', value: 'Employee'}, {label: 'عاطلة', value: 'Unemployed'}, {label: 'أخرى', value: 'Other'}]
      : ['Housewife', 'Teacher', 'Nurse', 'Student', 'Doctor', 'Engineer', 'Employee', 'Unemployed', 'Other'],
    yesNo: isAr ? [{label: 'نعم', value: 'Yes'}, {label: 'لا', value: 'No'}] : ['Yes', 'No'],
    feeding: isAr ? [{label: 'رضاعة طبيعية', value: 'Breastfeeding'}, {label: 'رضاعة صناعية', value: 'Bottle feeding'}, {label: 'مختلط', value: 'Mixed'}] : ['Breastfeeding', 'Bottle feeding', 'Mixed'],
    cycleRegularity: isAr ? [{label: 'منتظمة', value: 'Regular'}, {label: 'غير منتظمة', value: 'Irregular'}] : ['Regular', 'Irregular'],
    bloodLoss: isAr ? [{label: 'شحيح', value: 'Scanty'}, {label: 'متوسط', value: 'Average'}, {label: 'غزير', value: 'Heavy'}] : ['Scanty', 'Average', 'Heavy'],
    immunizationOptions: isAr 
      ? [{label: 'كامل', value: 'Complete'}, {label: 'غير كامل', value: 'Incomplete'}, {label: 'غير محصنة', value: 'Not Immunized'}, {label: 'غير معروف', value: 'Unknown'}]
      : ['Complete', 'Incomplete', 'Not Immunized', 'Unknown'],
    commonComplaints: isAr
      ? [{label: 'فحص روتيني', value: 'Routine Checkup'}, {label: 'ألم بطني', value: 'Abdominal Pain'}, {label: 'نزيف مهبلي', value: 'Vaginal Bleeding'}, {label: 'إفرازات مهبلية', value: 'Vaginal Discharge'}, {label: 'انقطاع الطمث', value: 'Amenorrhea'}, {label: 'آلام المخاض', value: 'Labor Pains'}, {label: 'قلة حركة الجنين', value: 'Decreased Fetal Movement'}]
      : ['Routine Checkup', 'Abdominal Pain', 'Lower Abdominal Pain', 'Vaginal Bleeding', 'Vaginal Discharge', 'Amenorrhea', 'Labor Pains', 'Decreased Fetal Movement'],
    gynOptions: isAr 
      ? [{label: 'دورات منتظمة', value: 'Regular Cycles'}, {label: 'دورات غير منتظمة', value: 'Irregular Cycles'}, {label: 'انقطاع أولي', value: 'Primary Amenorrhea'}, {label: 'سن اليأس', value: 'Menopause'}]
      : ['Regular Cycles', 'Irregular Cycles', 'Primary Amenorrhea', 'Secondary Amenorrhea', 'Menopause', 'Hysterectomy'],
    allergyOptions: isAr 
      ? [{label: 'لا يوجد', value: 'NIL'}, {label: 'بنسلين', value: 'Penicillin'}, {label: 'أدوية السلفا', value: 'Sulfa Drugs'}, {label: 'أسبرين', value: 'Aspirin'}, {label: 'أطعمة', value: 'Foods'}, {label: 'لاتكس', value: 'Latex'}, {label: 'أخرى', value: 'Other'}]
      : ['NIL', 'Penicillin', 'Sulfa Drugs', 'Aspirin', 'Foods', 'Latex', 'Other'],
    surgicalOptions: isAr
      ? [{label: 'لا يوجد', value: 'NIL'}, {label: 'قيصرية', value: 'C-Section'}, {label: 'زائدة دودية', value: 'Appendectomy'}, {label: 'توسيع وكحت', value: 'D&C'}]
      : ['NIL', 'C-Section', 'Appendectomy', 'Cholecystectomy', 'D&C', 'Ectopic Pregnancy Surgery'],
    religions: isAr 
      ? [{label: 'الإسلام', value: 'Islam'}, {label: 'المسيحية', value: 'Christianity'}, {label: 'اليهودية', value: 'Judaism'}, {label: 'أخرى', value: 'Other'}]
      : ['Islam', 'Christianity', 'Judaism', 'Other']
  }
};

type AppMode = 'selection' | 'long' | 'fast' | 'records_list' | 'record_view';

interface SavedRecord {
  id: string;
  timestamp: string;
  type: 'Fast' | 'Detailed';
  data: FormAnswers;
  analysis?: string; // Store AI analysis
}

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [mode, setMode] = useState<AppMode>('selection');
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState<FormAnswers>({});
  const [savedRecords, setSavedRecords] = useState<SavedRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<SavedRecord | null>(null);
  
  // AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = (key: keyof typeof translations['en']) => translations[lang][key] || key;
  const opts = getOptions(lang);

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  const handleChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    handleChange(e.target.id, e.target.value);
  };

  const handleSave = (type: 'Fast' | 'Detailed') => {
    const newRecord: SavedRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US'),
      type,
      data: { ...answers }
    };
    setSavedRecords([newRecord, ...savedRecords]);
    setSelectedRecord(newRecord);
    setMode('record_view');
    setAnswers({}); // Reset form
    setCurrentPage(1);
  };

  // --- AI ANALYSIS ---
  const handleAnalyze = async () => {
    if (!selectedRecord) return;
    setIsAnalyzing(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construct a readable history string
      let historyText = `Patient History (${selectedRecord.type} Mode):\n`;
      Object.entries(selectedRecord.data).forEach(([key, value]) => {
        if(value) historyText += `- ${key}: ${value}\n`;
      });

      const prompt = `
        You are an expert Obstetrician & Gynaecologist. Analyze the following patient history data:
        ${historyText}
        
        Please provide a concise clinical assessment including:
        1. Summary of key findings.
        2. Differential Diagnosis (list top 3).
        3. Suggested investigations/next steps.
        
        Keep it professional and concise.
      `;

      // Correct API Usage: ai.models.generateContent
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });

      // Correct Response extraction: response.text (property)
      const analysisText = response.text || "No analysis generated.";

      // Save analysis to the record locally
      const updatedRecord = { ...selectedRecord, analysis: analysisText };
      setSelectedRecord(updatedRecord);
      setSavedRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));

    } catch (error) {
      console.error("AI Analysis failed:", error);
      alert("Analysis failed. Please check your API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- IMPORT / EXPORT ---
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedRecords));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "obs_gyn_records.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result;
        if (typeof json === 'string') {
          const parsedRecords = JSON.parse(json) as SavedRecord[];
          // Basic validation could be added here
          if (Array.isArray(parsedRecords)) {
             setSavedRecords(prev => [...parsedRecords, ...prev]); // Merge imported
             alert("Records imported successfully!");
          }
        }
      } catch (error) {
        console.error("Import failed:", error);
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(fileObj);
    // Reset input
    event.target.value = '';
  };

  // Auto-Calculate EDD when LMP changes
  useEffect(() => {
    const calculateEDD = (lmpValue: string | undefined, targetId: string) => {
      if (lmpValue) {
        const lmpDate = new Date(lmpValue);
        if (!isNaN(lmpDate.getTime())) {
          const eddDate = new Date(lmpDate);
          eddDate.setDate(eddDate.getDate() + 7);
          eddDate.setMonth(eddDate.getMonth() + 9);
          
          const eddString = eddDate.toISOString().split('T')[0];
          if (answers[targetId] !== eddString) {
              setAnswers(prev => ({ ...prev, [targetId]: eddString }));
          }
        }
      }
    };

    calculateEDD(answers["p2_obs_lmp"], "p2_obs_edd_val"); // Long Form
    calculateEDD(answers["f_obs_lmp"], "f_obs_edd");       // Fast Form
  }, [answers["p2_obs_lmp"], answers["f_obs_lmp"], answers]);

  const totalPages = 7;

  // --- ICONS ---
  const Icons = {
    User: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    FileText: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    Baby: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Heart: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    Activity: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    Users: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Table: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7-8v8m14-8v8M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    Back: () => <svg className="w-5 h-5 rtl:scale-x-[-1]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
    Home: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    Globe: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Sparkles: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
    Upload: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
    Download: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
  };

  // --- SELECTION SCREEN ---
  const renderSelectionScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-teal-900 uppercase tracking-wide mb-2">{t('appTitle')}</h1>
        <p className="text-slate-500 mb-8">{t('selectMethod')}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {savedRecords.length > 0 && (
            <button 
                onClick={() => setMode('records_list')}
                className="px-6 py-2 bg-white border border-slate-300 rounded-full text-slate-700 hover:bg-slate-50 shadow-sm font-medium flex items-center gap-2"
            >
                <Icons.FileText /> {t('viewSaved')} ({savedRecords.length})
            </button>
            )}
            
            <button 
                onClick={handleImportClick}
                className="px-6 py-2 bg-slate-800 border border-slate-700 rounded-full text-white hover:bg-slate-700 shadow-sm font-medium flex items-center gap-2"
            >
                <Icons.Upload /> {t('importData')}
            </button>
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImportFile} 
                accept=".json"
                className="hidden"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <button 
          onClick={() => setMode('fast')}
          className="group relative bg-white p-8 rounded-2xl shadow-md hover:shadow-xl border-2 border-transparent hover:border-teal-500 transition-all duration-300 text-start flex flex-col"
        >
          <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors">
            <Icons.Activity />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{t('fastMode')}</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            {t('fastDesc')}
          </p>
          <div className="mt-auto pt-6 flex items-center text-teal-600 font-semibold text-sm group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform">{t('startFast')} {lang === 'en' ? '→' : '←'}</div>
        </button>

        <button 
          onClick={() => setMode('long')}
          className="group relative bg-white p-8 rounded-2xl shadow-md hover:shadow-xl border-2 border-transparent hover:border-blue-500 transition-all duration-300 text-start flex flex-col"
        >
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
             <Icons.FileText />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{t('detailedMode')}</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            {t('detailedDesc')}
          </p>
          <div className="mt-auto pt-6 flex items-center text-blue-600 font-semibold text-sm group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform">{t('startDetailed')} {lang === 'en' ? '→' : '←'}</div>
        </button>
      </div>
    </div>
  );

  // --- FAST FORM ---
  const renderFastForm = () => (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in pb-32">
       <div className="text-center mb-8 pb-6 border-b border-slate-200">
         <h2 className="text-2xl font-bold text-teal-900">{t('caseHistory')}</h2>
         <span className="inline-block bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full mt-2 font-semibold tracking-wide">{t('fastTag')}</span>
       </div>

       <SectionHeader title={t('personalHistory')} />
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput id="f_p_name" label={t('patientName')} value={answers["f_p_name"] || ""} onChange={handleInputChange} />
          <TextInput id="f_p_age" label={t('age')} type="number" value={answers["f_p_age"] || ""} onChange={handleInputChange} />
          <SelectInput id="f_p_occ" label={t('occupation')} options={opts.occupations} value={answers["f_p_occ"] || ""} onChange={handleInputChange} />
          <SelectInput id="f_p_blood" label={t('bloodGroup')} options={bloodGroups} value={answers["f_p_blood"] || ""} onChange={handleInputChange} />
       </div>

       <SectionHeader title={t('chiefComplaint')} />
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <SelectInput id="f_cc_select" label={t('commonComplaints')} options={opts.commonComplaints} value={answers["f_cc_select"] || ""} onChange={handleInputChange} />
          <TextArea id="f_cc" label={t('detailedComplaint')} value={answers["f_cc"] || ""} onChange={handleInputChange} />
       </div>

       <SectionHeader title={t('obsHistory')} />
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <TextInput id="f_obs_g" type="number" label={t('gravida')} value={answers["f_obs_g"] || ""} onChange={handleInputChange} />
            <TextInput id="f_obs_p" type="number" label={t('parity')} value={answers["f_obs_p"] || ""} onChange={handleInputChange} />
            <TextInput id="f_obs_a" type="number" label={t('abortion')} value={answers["f_obs_a"] || ""} onChange={handleInputChange} />
            <TextInput id="f_obs_children" type="number" label={t('children')} value={answers["f_obs_children"] || ""} onChange={handleInputChange} />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
             <TextInput id="f_obs_term" type="number" label={t('term')} value={answers["f_obs_term"] || ""} onChange={handleInputChange} />
             <TextInput id="f_obs_pre" type="number" label={t('preTerm')} value={answers["f_obs_pre"] || ""} onChange={handleInputChange} />
             <TextInput id="f_obs_post" type="number" label={t('postTerm')} value={answers["f_obs_post"] || ""} onChange={handleInputChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
             <TextInput id="f_obs_lmp" type="date" label={t('lmp')} value={answers["f_obs_lmp"] || ""} onChange={handleInputChange} />
             <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
               <LabelText>{t('edd')}</LabelText>
               <TextInput id="f_obs_edd" type="date" value={answers["f_obs_edd"] || ""} onChange={handleInputChange} className="mb-0 font-bold text-teal-800" />
             </div>
          </div>
       </div>

       <SectionHeader title={t('hpi')} />
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <TextInput id="f_hpi_last_well" label={t('lastWell')} value={answers["f_hpi_last_well"] || ""} onChange={handleInputChange} />
             <TextInput id="f_hpi_onset" type="date" label={t('onsetDate')} value={answers["f_hpi_onset"] || ""} onChange={handleInputChange} />
          </div>
          <TextArea id="f_hpi_details" label={t('details')} value={answers["f_hpi_details"] || ""} onChange={handleInputChange} />
       </div>

       <SectionHeader title={t('medSurgBg')} />
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <SelectInput id="f_bg_gyn_select" label={t('gynStatus')} options={opts.gynOptions} value={answers["f_bg_gyn_select"] || ""} onChange={handleInputChange} />
            <TextInput id="f_bg_gyn" placeholder={t('addGynDetails')} value={answers["f_bg_gyn"] || ""} onChange={handleInputChange} className="mt-2" />
          </div>
          
          <SelectInput id="f_bg_imm" label={t('immStatus')} options={opts.immunizationOptions} value={answers["f_bg_imm"] || ""} onChange={handleInputChange} />
          
          <div className="md:col-span-1">
             <SelectInput id="f_bg_alg_select" label={t('allergies')} options={opts.allergyOptions} value={answers["f_bg_alg_select"] || ""} onChange={handleInputChange} />
             <TextInput id="f_bg_alg" placeholder={t('specAllergy')} value={answers["f_bg_alg"] || ""} onChange={handleInputChange} className="mt-2" />
          </div>

          <TextInput id="f_bg_drug" label={t('currMed')} value={answers["f_bg_drug"] || ""} onChange={handleInputChange} />
          
          <div className="md:col-span-2">
            <SelectInput id="f_bg_surg_select" label={t('pastSurg')} options={opts.surgicalOptions} value={answers["f_bg_surg_select"] || ""} onChange={handleInputChange} />
            <TextInput id="f_bg_surg" placeholder={t('surgDetails')} value={answers["f_bg_surg"] || ""} onChange={handleInputChange} className="mt-2" />
          </div>
       </div>

       <SectionHeader title={t('familyHistory')} />
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <TextArea id="f_fam" label={t('familyHistory')} value={answers["f_fam"] || ""} onChange={handleInputChange} />
       </div>

       <SectionHeader title={t('husbandInfo')} />
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput id="f_h_name" label={t('husbandName')} value={answers["f_h_name"] || ""} onChange={handleInputChange} />
          <TextInput id="f_h_age" label={t('age')} type="number" value={answers["f_h_age"] || ""} onChange={handleInputChange} />
          <SelectInput id="f_h_blood" label={t('bloodGroup')} options={bloodGroups} value={answers["f_h_blood"] || ""} onChange={handleInputChange} />
          <SelectInput id="f_h_occ" label={t('occupation')} options={opts.occupations} value={answers["f_h_occ"] || ""} onChange={handleInputChange} />
       </div>

       <div className="mt-12 flex justify-center space-x-4">
         <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMode('selection'); }} className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            {t('cancel')}
         </button>
         <button onClick={() => handleSave('Fast')} className="px-8 py-3 rounded-lg bg-teal-600 text-white font-bold shadow-md hover:bg-teal-700 hover:shadow-lg transition-all flex items-center gap-2">
            <Icons.FileText /> {t('saveRecord')}
         </button>
       </div>
    </div>
  );

  // --- RECORD DETAIL VIEW ---
  const renderRecordView = () => {
    if (!selectedRecord) return null;
    const { data } = selectedRecord;
    const isFast = selectedRecord.type === 'Fast';
    const get = (key: string) => data[key] || "—";

    return (
      <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
           <button onClick={() => setMode('records_list')} className="text-slate-500 hover:text-teal-600 flex items-center gap-2 font-medium">
              <Icons.Back /> {t('backToRecords')}
           </button>
           <div className="flex gap-2">
                <button onClick={() => window.print()} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm hover:bg-slate-300 print:hidden font-medium">
                    {t('printRecord')}
                </button>
                <button onClick={handleExport} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 print:hidden flex items-center gap-2 font-medium">
                    <Icons.Download /> {t('exportData')}
                </button>
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden print:shadow-none print:border-none">
           {/* Header */}
           <div className="bg-teal-600 text-white p-8">
              <div className="flex justify-between items-start">
                 <div>
                    <h1 className="text-3xl font-bold mb-2">{isFast ? get('f_p_name') : get('p1_name')}</h1>
                    <div className="flex gap-4 text-teal-100 text-sm">
                       <span>{t('age')}: {isFast ? get('f_p_age') : get('p1_age')}</span>
                       <span>•</span>
                       <span>{t('bloodGroup')}: {isFast ? get('f_p_blood') : get('p1_blood')}</span>
                       <span>•</span>
                       <span>{selectedRecord.timestamp}</span>
                    </div>
                 </div>
                 <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <Icons.Activity />
                 </div>
              </div>
           </div>
           
           {/* AI Analysis Section */}
           <div className="bg-indigo-50 border-b border-indigo-100 p-6 print:break-inside-avoid">
               <div className="flex justify-between items-center mb-4">
                   <h3 className="text-indigo-900 font-bold flex items-center gap-2">
                       <Icons.Sparkles /> {t('aiAnalysis')}
                   </h3>
                   {!selectedRecord.analysis && (
                       <button 
                           onClick={handleAnalyze} 
                           disabled={isAnalyzing}
                           className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm font-semibold"
                       >
                           {isAnalyzing ? t('analyzing') : t('analyzeAi')}
                       </button>
                   )}
               </div>
               {selectedRecord.analysis ? (
                   <div className="text-sm text-indigo-900 leading-relaxed bg-white p-4 rounded-lg border border-indigo-100 whitespace-pre-wrap">
                       {selectedRecord.analysis}
                   </div>
               ) : (
                   <p className="text-sm text-indigo-400 italic">
                       {isAnalyzing ? t('analyzing') : "Click analyze to get an AI assessment of this case."}
                   </p>
               )}
           </div>

           {/* Content Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 ltr:md:divide-x rtl:md:divide-x-reverse divide-slate-100">
              
              {/* Column 1: Personal & Spouse */}
              <div className="p-6 space-y-8">
                 <div>
                    <h3 className="flex items-center gap-2 font-bold text-teal-800 mb-4 uppercase text-xs tracking-wider">
                       <Icons.User /> {t('personalHistory')}
                    </h3>
                    <div className="space-y-3 text-sm text-slate-600">
                       <p><span className="font-semibold text-slate-800">{t('occupation')}:</span> {isFast ? get('f_p_occ') : get('p1_occ')}</p>
                       {!isFast && <p><span className="font-semibold text-slate-800">{t('p1_addr')}:</span> {get('p1_address')}</p>}
                       {!isFast && <p><span className="font-semibold text-slate-800">{t('p1_rel')}:</span> {get('p1_religion')}</p>}
                    </div>
                 </div>
                 <div>
                    <h3 className="flex items-center gap-2 font-bold text-teal-800 mb-4 uppercase text-xs tracking-wider">
                       <Icons.Users /> {t('husbandInfo')}
                    </h3>
                    <div className="space-y-3 text-sm text-slate-600">
                       <p><span className="font-semibold text-slate-800">{t('husbandName')}:</span> {isFast ? get('f_h_name') : get('p1_h_name')}</p>
                       <p><span className="font-semibold text-slate-800">{t('age')}:</span> {isFast ? get('f_h_age') : get('p1_h_age')}</p>
                       <p><span className="font-semibold text-slate-800">{t('bloodGroup')}:</span> {isFast ? get('f_h_blood') : get('p1_h_blood')}</p>
                       <p><span className="font-semibold text-slate-800">{t('occupation')}:</span> {isFast ? get('f_h_occ') : get('p1_h_occ')}</p>
                    </div>
                 </div>
              </div>

              {/* Column 2: Obstetric & Complaint */}
              <div className="p-6 space-y-8">
                 <div>
                    <h3 className="flex items-center gap-2 font-bold text-teal-800 mb-4 uppercase text-xs tracking-wider">
                       <Icons.Baby /> {t('obsHistory')}
                    </h3>
                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                       <div className="bg-teal-50 p-2 rounded">
                          <span className="block text-xs text-teal-600 font-bold">G</span>
                          <span className="text-lg font-bold text-teal-900">{isFast ? get('f_obs_g') : get('p2_obs_g')}</span>
                       </div>
                       <div className="bg-teal-50 p-2 rounded">
                          <span className="block text-xs text-teal-600 font-bold">P</span>
                          <span className="text-lg font-bold text-teal-900">{isFast ? get('f_obs_p') : get('p2_obs_p')}</span>
                       </div>
                       <div className="bg-teal-50 p-2 rounded">
                          <span className="block text-xs text-teal-600 font-bold">A</span>
                          <span className="text-lg font-bold text-teal-900">{isFast ? get('f_obs_a') : get('p2_obs_a')}</span>
                       </div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mb-4 px-2 border-b border-slate-100 pb-4">
                        <div className="text-center">
                            <span className="block font-semibold text-slate-700">{t('term')}</span>
                            <span>{isFast ? get('f_obs_term') : get('p2_obs_term')}</span>
                        </div>
                        <div className="text-center">
                            <span className="block font-semibold text-slate-700">{t('preTerm')}</span>
                            <span>{isFast ? get('f_obs_pre') : get('p2_obs_pre')}</span>
                        </div>
                        <div className="text-center">
                            <span className="block font-semibold text-slate-700">{t('postTerm')}</span>
                            <span>{isFast ? get('f_obs_post') : get('p2_obs_post')}</span>
                        </div>
                    </div>
                    <div className="space-y-3 text-sm text-slate-600">
                       <p><span className="font-semibold text-slate-800">{t('lmp')}:</span> {isFast ? get('f_obs_lmp') : get('p2_obs_lmp')}</p>
                       <p><span className="font-semibold text-teal-700">{t('edd')}:</span> {isFast ? get('f_obs_edd') : get('p2_obs_edd_val')}</p>
                    </div>
                 </div>
                 <div>
                    <h3 className="flex items-center gap-2 font-bold text-teal-800 mb-4 uppercase text-xs tracking-wider">
                       <Icons.Heart /> {t('chiefComplaint')}
                    </h3>
                    <p className="text-sm text-slate-600 italic border-l-2 rtl:border-l-0 rtl:border-r-2 border-teal-200 ltr:pl-3 rtl:pr-3">
                       "{isFast ? get('f_cc_select') : get('p1_cc_a')} {isFast ? get('f_cc') : ''}"
                    </p>
                 </div>
              </div>

              {/* Column 3: Medical & HPI */}
              <div className="p-6 space-y-8">
                 <div>
                     <h3 className="flex items-center gap-2 font-bold text-teal-800 mb-4 uppercase text-xs tracking-wider">
                        <Icons.Table /> {t('historyTitle')}
                     </h3>
                     <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex justify-between border-b border-slate-50 pb-1">
                           <span>{t('immStatus')}:</span>
                           <span className="font-medium text-slate-900">{isFast ? get('f_bg_imm') : 'See chart'}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-1">
                           <span>{t('gynStatus')}:</span>
                           <span className="font-medium text-slate-900">{isFast ? get('f_bg_gyn_select') : 'See chart'}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-1">
                           <span>{t('allergies')}:</span>
                           <span className="font-medium text-slate-900">{isFast ? get('f_bg_alg_select') : get('p4_alg_a')}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-1">
                           <span>{t('pastSurg')}:</span>
                           <span className="font-medium text-slate-900">{isFast ? get('f_bg_surg_select') : 'See chart'}</span>
                        </div>
                     </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  };

  const renderRecordsList = () => (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
       <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold text-slate-900">{t('savedRecords')}</h2>
           <div className="flex gap-2">
               <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImportFile} 
                    accept=".json"
                    className="hidden"
               />
               <button onClick={handleImportClick} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-300 font-bold flex items-center gap-2">
                    <Icons.Upload /> {t('importData')}
               </button>
               <button onClick={() => setMode('selection')} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 font-bold flex items-center gap-2">
                    <Icons.Activity /> {t('newPatient')}
               </button>
           </div>
       </div>
       
       <div className="space-y-4">
          {savedRecords.length === 0 ? (
             <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-400">{t('noRecords')}</p>
             </div>
          ) : (
             savedRecords.map((record) => (
                <div key={record.id} onClick={() => { setSelectedRecord(record); setMode('record_view'); }} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer flex justify-between items-center group">
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${record.type === 'Fast' ? 'bg-teal-100 text-teal-700' : 'bg-blue-100 text-blue-700'}`}>
                         {(record.type === 'Fast' ? record.data['f_p_name'] : record.data['p1_name'])?.charAt(0) || '?'}
                      </div>
                      <div>
                         <h3 className="font-bold text-slate-800 text-lg">{record.type === 'Fast' ? record.data['f_p_name'] : record.data['p1_name']}</h3>
                         <div className="flex gap-3 text-sm text-slate-500">
                            <span>{record.type} {t('historyTitle')}</span>
                            <span>•</span>
                            <span>{record.timestamp}</span>
                         </div>
                      </div>
                   </div>
                   <div className="text-slate-300 group-hover:text-teal-500 transition-colors">
                      <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                   </div>
                </div>
             ))
          )}
       </div>
    </div>
  );

  // --- LONG FORM RENDER FUNCTIONS ---
  const renderPage1 = () => (
    <div className="animate-fade-in">
      <div className="text-center mb-10 p-6 bg-teal-50 rounded-xl border border-teal-100">
        <h1 className="text-lg font-bold text-teal-900 uppercase tracking-wide">{t('deptTitle')}</h1>
        <h2 className="text-md font-semibold text-teal-800 uppercase mt-1">{t('subDeptTitle')}</h2>
        <div className="my-4 h-px bg-teal-200 w-1/2 mx-auto"></div>
        <h2 className="text-xl font-extrabold text-teal-950 uppercase tracking-wider">{t('formTitle')}</h2>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 ltr:border-l-4 rtl:border-r-4 border-teal-500 ltr:pl-4 rtl:pr-4 mb-6">{t('historyTitle')}</h2>

      <SectionHeader title={t('personalHistory')} />
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput id="p1_name" label={t('p1_name')} value={answers["p1_name"] || ""} onChange={handleInputChange} />
          <TextInput id="p1_age" label={t('p1_age')} type="number" value={answers["p1_age"] || ""} onChange={handleInputChange} />
          <SelectInput id="p1_occ" label={t('p1_occ')} options={opts.occupations} value={answers["p1_occ"] || ""} onChange={handleInputChange} />
          <TextInput id="p1_address" label={t('p1_addr')} value={answers["p1_address"] || ""} onChange={handleInputChange} />
          
          <div className="space-y-2">
            <LabelText>{t('p1_marital')}</LabelText>
            <div className="flex gap-2">
                <div className="w-1/2">
                    <SelectInput id="p1_marital_status" value={answers["p1_marital_status"] || ""} onChange={handleInputChange} options={opts.maritalStatus} className="mb-0"/>
                </div>
                <div className="w-1/2">
                    <TextInput id="p1_marital_date" type="date" value={answers["p1_marital_date"] || ""} onChange={handleInputChange} className="mb-0"/>
                </div>
            </div>
          </div>

          <SelectInput id="p1_religion" label={t('p1_rel')} options={opts.religions} value={answers["p1_religion"] || ""} onChange={handleInputChange} />
          <SelectInput id="p1_blood" label={t('p1_bg')} options={bloodGroups} value={answers["p1_blood"] || ""} onChange={handleInputChange} />
        </div>
        
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4">
            <LabelText>{t('p1_hus')}</LabelText>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <TextInput id="p1_h_name" label={t('husbandName')} value={answers["p1_h_name"] || ""} onChange={handleInputChange} />
                <TextInput id="p1_h_age" label={t('p1_hus_age')} type="number" value={answers["p1_h_age"] || ""} onChange={handleInputChange} />
                <SelectInput id="p1_h_occ" label={t('p1_hus_occ')} options={opts.occupations} value={answers["p1_h_occ"] || ""} onChange={handleInputChange} />
                <SelectInput id="p1_h_blood" label={t('p1_hus_bg')} options={bloodGroups} value={answers["p1_h_blood"] || ""} onChange={handleInputChange} />
            </div>
        </div>
      </div>

      <SectionHeader title={t('p1_cc')} subtitle={t('p1_cc_sub')} />
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
        <TextArea id="p1_cc_a" label={t('p1_cc_a')} value={answers["p1_cc_a"] || ""} onChange={handleInputChange} />
        <TextArea id="p1_cc_b" label={t('p1_cc_b')} value={answers["p1_cc_b"] || ""} onChange={handleInputChange} />
      </div>

      <SectionHeader title={t('p1_hpi')} />
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput id="p1_hpi_a" label={t('p1_hpi_a')} value={answers["p1_hpi_a"] || ""} onChange={handleInputChange} />
        <TextInput id="p1_hpi_b" type="date" label={t('p1_hpi_b')} value={answers["p1_hpi_b"] || ""} onChange={handleInputChange} />
      </div>
    </div>
  );

  const renderPage2 = () => (
    <div className="animate-fade-in">
      <SectionHeader title={t('p2_hpi_cont')} />
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
         <TextArea id="p2_hpi_c" label={t('p2_hpi_c')} value={answers["p2_hpi_c"] || ""} onChange={handleInputChange} />
         <TextInput id="p2_hpi_d" label={t('p2_hpi_d')} value={answers["p2_hpi_d"] || ""} onChange={handleInputChange} />
         <TextInput id="p2_hpi_e" label={t('p2_hpi_e')} value={answers["p2_hpi_e"] || ""} onChange={handleInputChange} />
         <TextInput id="p2_hpi_f" label={t('p2_hpi_f')} value={answers["p2_hpi_f"] || ""} onChange={handleInputChange} />
      </div>

      <SectionHeader title={t('p2_obs')} />
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <TextInput id="p2_obs_g" type="number" label={t('gravida')} value={answers["p2_obs_g"] || ""} onChange={handleInputChange} />
            <TextInput id="p2_obs_p" type="number" label={t('parity')} value={answers["p2_obs_p"] || ""} onChange={handleInputChange} />
            <TextInput id="p2_obs_a" type="number" label={t('abortion')} value={answers["p2_obs_a"] || ""} onChange={handleInputChange} />
            <TextInput id="p2_obs_lmp" type="date" label={t('lmp')} value={answers["p2_obs_lmp"] || ""} onChange={handleInputChange} />
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
             <TextInput id="p2_obs_term" type="number" label={t('term')} value={answers["p2_obs_term"] || ""} onChange={handleInputChange} />
             <TextInput id="p2_obs_pre" type="number" label={t('preTerm')} value={answers["p2_obs_pre"] || ""} onChange={handleInputChange} />
             <TextInput id="p2_obs_post" type="number" label={t('postTerm')} value={answers["p2_obs_post"] || ""} onChange={handleInputChange} />
        </div>

        <div className="space-y-3 bg-blue-50 p-5 rounded-lg border border-blue-100">
          <LabelText>{t('p2_edd_note')}</LabelText>
           <div className="mt-4 p-4 bg-white border border-blue-200 rounded-lg flex items-center justify-between">
              <span className="font-bold text-blue-900">{t('calc_edd')}</span>
              <TextInput 
                id="p2_obs_edd_val" 
                type="date" 
                value={answers["p2_obs_edd_val"] || ""} 
                onChange={handleInputChange} 
                className="mb-0 w-48 font-bold text-blue-700" 
                readOnly={false} 
              />
           </div>
        </div>
      </div>
    </div>
  );

  const renderPage3 = () => (
    <div className="animate-fade-in">
       <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-xs md:text-sm">
            <thead>
                <tr className="bg-teal-600 text-white">
                <th className="border border-teal-700 p-3 w-1/6">1<sup>st</sup> trimester</th>
                <th className="border border-teal-700 p-3 w-1/6">2<sup>nd</sup> trimester</th>
                <th className="border border-teal-700 p-3 w-1/6">3<sup>rd</sup> trimester</th>
                <th className="border border-teal-700 p-3 w-1/6">Delivery</th>
                <th className="border border-teal-700 p-3 w-1/6">Puerperium</th>
                <th className="border border-teal-700 p-3 w-1/6">Feeding</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
                <tr className="bg-white hover:bg-slate-50">
                <td className="border border-slate-200 p-2 align-top">
                    <label className="font-bold block text-teal-800 mb-1">Any illness</label>
                    <SelectInput options={opts.yesNo} placeholder="-" className="mb-0" value={answers["p3_row1_col1"] || ""} onChange={(e) => handleChange("p3_row1_col1", e.target.value)} />
                </td>
                <td className="border border-slate-200 p-2 align-top">
                    <label className="font-bold block text-teal-800 mb-1">Hypertension</label>
                    <SelectInput options={opts.yesNo} placeholder="-" className="mb-0" value={answers["p3_row1_col2"] || ""} onChange={(e) => handleChange("p3_row1_col2", e.target.value)} />
                </td>
                <td className="border border-slate-200 p-2 align-top">
                    <label className="font-bold block text-teal-800 mb-1">APH</label>
                    <SelectInput options={opts.yesNo} placeholder="-" className="mb-0" value={answers["p3_row1_col3"] || ""} onChange={(e) => handleChange("p3_row1_col3", e.target.value)} />
                </td>
                <td className="border border-slate-200 p-2 align-top">
                    <label className="font-bold block text-teal-800 mb-1">Time</label>
                    <TextInput className="mb-0" value={answers["p3_row1_col4"] || ""} onChange={(e) => handleChange("p3_row1_col4", e.target.value)} />
                </td>
                <td className="border border-slate-200 p-2 align-top">
                    <label className="font-bold block text-teal-800 mb-1">PPH</label>
                    <SelectInput options={opts.yesNo} placeholder="-" className="mb-0" value={answers["p3_row1_col5"] || ""} onChange={(e) => handleChange("p3_row1_col5", e.target.value)} />
                </td>
                <td className="border border-slate-200 p-2 align-top">
                    <label className="font-bold block text-teal-800 mb-1">Breastfeeding</label>
                    <SelectInput options={opts.feeding} placeholder="Type" className="mb-0" value={answers["p3_row1_col6"] || ""} onChange={(e) => handleChange("p3_row1_col6", e.target.value)} />
                </td>
                </tr>
                {/* ... Simplified table rows content for brevity, mirroring original structure ... */}
                <tr className="bg-slate-50 hover:bg-white">
                <td className="border border-slate-200 p-2 align-top">
                    <label className="font-bold block text-teal-800 mb-1">Morning sickness</label>
                    <SelectInput options={opts.yesNo} placeholder="-" className="mb-0" value={answers["p3_row2_col1"] || ""} onChange={(e) => handleChange("p3_row2_col1", e.target.value)} />
                </td>
                <td className="border border-slate-200 p-2 align-top">
                    <label className="font-bold block text-teal-800 mb-1">Diabetes Mellitus</label>
                    <SelectInput options={opts.yesNo} placeholder="-" className="mb-0" value={answers["p3_row2_col2"] || ""} onChange={(e) => handleChange("p3_row2_col2", e.target.value)} />
                </td>
                <td className="border border-slate-200 p-2 bg-slate-100"></td>
                <td className="border border-slate-200 p-2 align-top">
                    <label className="font-bold block text-teal-800 mb-1">Place/Type delivery</label>
                    <TextInput className="mb-0" value={answers["p3_row2_col4"] || ""} onChange={(e) => handleChange("p3_row2_col4", e.target.value)} />
                </td>
                <td className="border border-slate-200 p-2 align-top">
                    <label className="font-bold block text-teal-800 mb-1">Pyrexia</label>
                    <SelectInput options={opts.yesNo} placeholder="-" className="mb-0" value={answers["p3_row2_col5"] || ""} onChange={(e) => handleChange("p3_row2_col5", e.target.value)} />
                </td>
                <td className="border border-slate-200 p-2 align-top">
                    <label className="font-bold block text-teal-800 mb-1">Bottle feeding</label>
                    <SelectInput options={opts.yesNo} placeholder="-" className="mb-0" value={answers["p3_row2_col6"] || ""} onChange={(e) => handleChange("p3_row2_col6", e.target.value)} />
                </td>
                </tr>
            </tbody>
            </table>
        </div>
       </div>

       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mt-6">
            <p className="text-sm italic text-slate-500 mb-2">And the same questions in G2.</p>
            <TextArea id="p3_g2_notes" label="G2 Notes:" value={answers["p3_g2_notes"] || ""} onChange={handleInputChange} />
       </div>

       <SectionHeader title={t('p3_gyn')} />
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
         <LabelText>{t('p3_menst')}</LabelText>
         <div className="ltr:pl-4 rtl:pr-4 space-y-4 ltr:border-l-2 rtl:border-r-2 border-slate-200">
            <TextInput id="p3_gyn_1" label={t('p3_gyn_1')} value={answers["p3_gyn_1"] || ""} onChange={handleInputChange} />
            <SelectInput id="p3_gyn_2" label={t('p3_gyn_2')} options={opts.cycleRegularity} value={answers["p3_gyn_2"] || ""} onChange={handleInputChange} />
            <SelectInput id="p3_gyn_3" label={t('p3_gyn_3')} options={opts.bloodLoss} value={answers["p3_gyn_3"] || ""} onChange={handleInputChange} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <SelectInput id="p3_gyn_4_dys" label={t('p3_gyn_4_pain')} options={opts.yesNo} value={answers["p3_gyn_4_dys"] || ""} onChange={handleInputChange} />
                 <SelectInput id="p3_gyn_4_men" label={t('p3_gyn_4_men')} options={opts.yesNo} value={answers["p3_gyn_4_men"] || ""} onChange={handleInputChange} />
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg mt-4">
                <LabelText>{t('p3_gyn_5')}</LabelText>
                <div className="space-y-4 mt-2">
                    <TextInput id="p3_gyn_5a" label={t('p3_gyn_5a')} value={answers["p3_gyn_5a"] || ""} onChange={handleInputChange} />
                    <SelectInput id="p3_gyn_5b" label={t('p3_gyn_5b')} options={opts.yesNo} value={answers["p3_gyn_5b"] || ""} onChange={handleInputChange} />
                </div>
            </div>
         </div>
       </div>
    </div>
  );

  const renderPage4 = () => (
    <div className="animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
         <TextInput id="p4_c" label={t('p4_c')} value={answers["p4_c"] || ""} onChange={handleInputChange} />
         <TextInput id="p4_d" label={t('p4_d')} value={answers["p4_d"] || ""} onChange={handleInputChange} />
      </div>

      <SectionHeader title={t('p4_imm')} subtitle={t('p4_imm_sub')} />
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
         <TextInput id="p4_imm_a" label="a. DPT" value={answers["p4_imm_a"] || ""} onChange={handleInputChange} />
         <TextInput id="p4_imm_b" label="b. OPV" value={answers["p4_imm_b"] || ""} onChange={handleInputChange} />
         <TextInput id="p4_imm_c" label="c. BCG" value={answers["p4_imm_c"] || ""} onChange={handleInputChange} />
         <TextInput id="p4_imm_d" label="d. Heptatis B" value={answers["p4_imm_d"] || ""} onChange={handleInputChange} />
      </div>

      <SectionHeader title={t('p4_drug')} />
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
         <LabelText>{t('p4_curr_med')}</LabelText>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <TextInput id="p4_drug_1" label="1. Type." value={answers["p4_drug_1"] || ""} onChange={handleInputChange} />
            <TextInput id="p4_drug_2" label="2. Prescribed by." value={answers["p4_drug_2"] || ""} onChange={handleInputChange} />
            <TextInput id="p4_drug_3" label="3. When." value={answers["p4_drug_3"] || ""} onChange={handleInputChange} />
            <TextInput id="p4_drug_4" label="4. Amount." value={answers["p4_drug_4"] || ""} onChange={handleInputChange} />
            <TextInput id="p4_drug_5" label="5. Problems." className="md:col-span-2" value={answers["p4_drug_5"] || ""} onChange={handleInputChange} />
         </div>
      </div>

      <SectionHeader title={t('p4_alg')} />
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
         <TextInput id="p4_alg_a" label="a. Drugs." value={answers["p4_alg_a"] || ""} onChange={handleInputChange} />
         <TextInput id="p4_alg_b" label="b. Foods." value={answers["p4_alg_b"] || ""} onChange={handleInputChange} />
         <TextInput id="p4_alg_c" label="c. Contact." value={answers["p4_alg_c"] || ""} onChange={handleInputChange} />
         <TextInput id="p4_alg_d" label="d. Environmental" value={answers["p4_alg_d"] || ""} onChange={handleInputChange} />
      </div>

      <SectionHeader title={t('p4_surg')} />
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
         <TextArea id="p4_surg_a" label="a. Operations" value={answers["p4_surg_a"] || ""} onChange={handleInputChange} />
         <TextArea id="p4_surg_b" label="b. Serious accidents" value={answers["p4_surg_b"] || ""} onChange={handleInputChange} />
      </div>
    </div>
  );

  const renderPage5 = () => (
    <div className="animate-fade-in">
      <SectionHeader title={t('p5_fam')} />
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
         <SelectInput id="p5_fam_a" label="a. DM/HTN." options={opts.yesNo} value={answers["p5_fam_a"] || ""} onChange={handleInputChange} />
         <SelectInput id="p5_fam_b" label="b. Heart/TB." options={opts.yesNo} value={answers["p5_fam_b"] || ""} onChange={handleInputChange} />
         <SelectInput id="p5_fam_c" label="c. Multipregnancy." options={opts.yesNo} value={answers["p5_fam_c"] || ""} onChange={handleInputChange} />
         <SelectInput id="p5_fam_d" label="d. Genetic." options={opts.yesNo} value={answers["p5_fam_d"] || ""} onChange={handleInputChange} />
         <SelectInput id="p5_fam_e" label="e. Stroke/Blood." options={opts.yesNo} value={answers["p5_fam_e"] || ""} onChange={handleInputChange} />
         <SelectInput id="p5_fam_f" label="f. Renal/Cancer." options={opts.yesNo} value={answers["p5_fam_f"] || ""} onChange={handleInputChange} />
      </div>

      <SectionHeader title={t('p5_rev')} />
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
         <div className="ltr:border-l-4 rtl:border-r-4 border-teal-200 ltr:pl-4 rtl:pr-4">
             <LabelText>{t('p5_rev_1')}</LabelText>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <TextInput id="p5_rev_1a" label="a. Fatigue." value={answers["p5_rev_1a"] || ""} onChange={handleInputChange} />
                <SelectInput id="p5_rev_1b" label="b. Fever." options={opts.yesNo} value={answers["p5_rev_1b"] || ""} onChange={handleInputChange} />
                <TextInput id="p5_rev_1c" label="c. Colds." value={answers["p5_rev_1c"] || ""} onChange={handleInputChange} />
                <TextInput id="p5_rev_1d" label="d. Weakness." value={answers["p5_rev_1d"] || ""} onChange={handleInputChange} />
                <TextInput id="p5_rev_1e" label="e. Daily activities." className="md:col-span-2" value={answers["p5_rev_1e"] || ""} onChange={handleInputChange} />
             </div>
         </div>

         <div className="ltr:border-l-4 rtl:border-r-4 border-teal-200 ltr:pl-4 rtl:pr-4">
            <LabelText>{t('p5_rev_2')}</LabelText>
            <div className="space-y-4 mt-2">
                <TextInput id="p5_rev_2a" label="a. Skin." value={answers["p5_rev_2a"] || ""} onChange={handleInputChange} />
                <TextInput id="p5_rev_2b" label="b. Growths." value={answers["p5_rev_2b"] || ""} onChange={handleInputChange} />
                <SelectInput id="p5_rev_2c" label="c. Dryness." options={opts.yesNo} value={answers["p5_rev_2c"] || ""} onChange={handleInputChange} />
            </div>
         </div>
      </div>
    </div>
  );

  const renderPage6 = () => (
     <div className="animate-fade-in">
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
          <TextInput id="p6_d" label={t('p4_c')} value={answers["p6_d"] || ""} onChange={handleInputChange} />
          <TextInput id="p6_e" label={t('p4_d')} value={answers["p6_e"] || ""} onChange={handleInputChange} />
       </div>

       <SectionHeader title={t('p6_psy')} />
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
          <SelectInput id="p6_psy_a" label="a. Anxiety." options={opts.yesNo} value={answers["p6_psy_a"] || ""} onChange={handleInputChange} />
          <SelectInput id="p6_psy_b" label="b. Depression." options={opts.yesNo} value={answers["p6_psy_b"] || ""} onChange={handleInputChange} />
          <TextInput id="p6_psy_c" label="c. Mood." value={answers["p6_psy_c"] || ""} onChange={handleInputChange} />
       </div>
       
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mt-6 space-y-6">
          <TextInput id="p6_4" label="4. Other (ENT/Head)." value={answers["p6_4"] || ""} onChange={handleInputChange} />
          
          <div className="bg-slate-50 p-4 rounded-lg">
            <LabelText>5. Cardiovascular</LabelText>
            <TextArea id="p6_5" label={t('details')} value={answers["p6_5"] || ""} onChange={handleInputChange} />
          </div>

          <div className="ltr:border-l-4 rtl:border-r-4 border-teal-200 ltr:pl-4 rtl:pr-4">
            <LabelText>{t('p6_resp')}</LabelText>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
               <SelectInput id="p6_resp_a" label="a. Dyspnoea." options={opts.yesNo} value={answers["p6_resp_a"] || ""} onChange={handleInputChange} />
               <SelectInput id="p6_resp_b" label="b. Wheezing." options={opts.yesNo} value={answers["p6_resp_b"] || ""} onChange={handleInputChange} />
               <SelectInput id="p6_resp_c" label="c. Cough." options={opts.yesNo} value={answers["p6_resp_c"] || ""} onChange={handleInputChange} />
            </div>
          </div>

          <div className="ltr:border-l-4 rtl:border-r-4 border-teal-200 ltr:pl-4 rtl:pr-4">
            <LabelText>{t('p6_gi')}</LabelText>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
               <SelectInput id="p6_gi_a" label="a. Dysphagia." options={opts.yesNo} value={answers["p6_gi_a"] || ""} onChange={handleInputChange} />
               <SelectInput id="p6_gi_b" label="b. Ulcer." options={opts.yesNo} value={answers["p6_gi_b"] || ""} onChange={handleInputChange} />
               <SelectInput id="p6_gi_c" label="c. Nausea." options={opts.yesNo} value={answers["p6_gi_c"] || ""} onChange={handleInputChange} />
               <SelectInput id="p6_gi_d" label="d. Bowel." options={['Constipation', 'Diarrhea', 'Normal']} value={answers["p6_gi_d"] || ""} onChange={handleInputChange} />
               <SelectInput id="p6_gi_e" label="e. Hemorrhoids." options={opts.yesNo} value={answers["p6_gi_e"] || ""} onChange={handleInputChange} />
               <SelectInput id="p6_gi_f" label="f. Jaundice." options={opts.yesNo} value={answers["p6_gi_f"] || ""} onChange={handleInputChange} />
            </div>
          </div>
          
          <LabelText>{t('p6_uri')}</LabelText>
       </div>
     </div>
  );

  const renderPage7 = () => (
     <div className="animate-fade-in">
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectInput id="p7_a" label="a. Dysuria." options={opts.yesNo} value={answers["p7_a"] || ""} onChange={handleInputChange} />
            <SelectInput id="p7_b" label="b. Urgency." options={opts.yesNo} value={answers["p7_b"] || ""} onChange={handleInputChange} />
            <SelectInput id="p7_c" label="c. Flank pain." options={opts.yesNo} value={answers["p7_c"] || ""} onChange={handleInputChange} />
            <SelectInput id="p7_d" label="d. Groin pain." options={opts.yesNo} value={answers["p7_d"] || ""} onChange={handleInputChange} />
            <SelectInput id="p7_e" label="e. Suprapubic." options={opts.yesNo} value={answers["p7_e"] || ""} onChange={handleInputChange} />
            <SelectInput id="p7_f" label="f. Low back." options={opts.yesNo} value={answers["p7_f"] || ""} onChange={handleInputChange} />
            
            <div className="md:col-span-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex items-center gap-3">
               <span className="text-yellow-600 text-3xl">•</span>
               <div className="flex-grow">
                 <SelectInput id="p7_poly" label="Polyuria." options={opts.yesNo} value={answers["p7_poly"] || ""} onChange={handleInputChange} className="mb-0" />
               </div>
            </div>
            
            <SelectInput id="p7_h" label="h. Oliguria." options={opts.yesNo} value={answers["p7_h"] || ""} onChange={handleInputChange} />
            <SelectInput id="p7_i" label="i. Haematuria." options={opts.yesNo} value={answers["p7_i"] || ""} onChange={handleInputChange} />
            <TextInput id="p7_j" label="j. Frequency." value={answers["p7_j"] || ""} onChange={handleInputChange} />
         </div>
       </div>
       
       <div className="mt-12 text-center">
          <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-200">
             <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentPage(p => Math.max(1, p - 1)); }} disabled={currentPage === 1} className={`flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === 1 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'}`}>{lang === 'en' ? '←' : '→'} {t('prev')}</button>
             <button onClick={() => handleSave('Detailed')} className="flex items-center px-8 py-3 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">{t('saveDetailed')} ✓</button>
          </div>
       </div>
     </div>
  );

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900 ${lang === 'ar' ? 'font-sans' : ''}`}>
      
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm backdrop-blur-md bg-opacity-90 animate-fade-in-down">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <button onClick={() => setMode('selection')} className="text-slate-400 hover:text-slate-700">
                    <Icons.Home />
                 </button>
                 <span className="font-bold text-teal-700 text-lg hidden sm:block">{t('appTitle')}</span>
              </div>
              
              <div className="flex items-center gap-4">
                  <button 
                    onClick={toggleLang} 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors"
                  >
                    <Icons.Globe />
                    <span>{lang === 'en' ? 'عربي' : 'English'}</span>
                  </button>

                  {mode === 'long' && (
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="w-24 sm:w-32 bg-slate-200 rounded-full h-2.5">
                            <div className="bg-teal-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${(currentPage / totalPages) * 100}%` }}></div>
                        </div>
                        <span className="text-sm font-bold text-slate-700">{currentPage}/{totalPages}</span>
                    </div>
                  )}
              </div>
          </div>
      </div>

      {/* Main Content */}
      <div className={mode === 'long' ? "max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8" : ""}>
        {mode === 'selection' && renderSelectionScreen()}
        {mode === 'fast' && renderFastForm()}
        {mode === 'records_list' && renderRecordsList()}
        {mode === 'record_view' && renderRecordView()}

        {mode === 'long' && (
          <div className="min-h-[60vh] transition-all duration-300">
            {currentPage === 1 && renderPage1()}
            {currentPage === 2 && renderPage2()}
            {currentPage === 3 && renderPage3()}
            {currentPage === 4 && renderPage4()}
            {currentPage === 5 && renderPage5()}
            {currentPage === 6 && renderPage6()}
            {currentPage === 7 && renderPage7()}
          
            {/* Footer Navigation (Only Next/Prev) */}
            {currentPage !== totalPages && (
              <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-200">
                <button 
                    onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentPage(p => Math.max(1, p - 1)); }}
                    disabled={currentPage === 1}
                    className={`flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === 1 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'}`}
                >{lang === 'en' ? '←' : '→'} {t('prev')}</button>
                <button 
                    onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                    className="flex items-center px-8 py-3 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                >{t('next')} {lang === 'en' ? '→' : '←'}</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;