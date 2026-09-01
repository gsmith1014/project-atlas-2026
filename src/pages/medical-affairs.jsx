import React, { useState } from 'react';
import { Eyebrow, Section, NavA, Brand } from '../components.jsx';

// ── ESC 2019 Pre-Test Probability (Table 3, Knuuti et al.) ────────────────────
const ESC_PTP = {
  '30-39': { typical:{m:59,f:28}, atypical:{m:29,f:10}, nonanginal:{m:18,f:5},  dyspnea:{m:30,f:10} },
  '40-49': { typical:{m:69,f:37}, atypical:{m:38,f:14}, nonanginal:{m:25,f:8},  dyspnea:{m:38,f:14} },
  '50-59': { typical:{m:77,f:47}, atypical:{m:49,f:20}, nonanginal:{m:34,f:12}, dyspnea:{m:49,f:20} },
  '60-69': { typical:{m:84,f:58}, atypical:{m:59,f:28}, nonanginal:{m:44,f:17}, dyspnea:{m:59,f:28} },
  '70+':   { typical:{m:89,f:68}, atypical:{m:69,f:37}, nonanginal:{m:54,f:24}, dyspnea:{m:69,f:37} },
};

const SYM_LABEL = { typical:'Typical angina', atypical:'Atypical angina', nonanginal:'Non-anginal chest pain', dyspnea:'Dyspnea only' };

function ageGroup(age) {
  if (age < 30) return null;
  if (age < 40) return '30-39';
  if (age < 50) return '40-49';
  if (age < 60) return '50-59';
  if (age < 70) return '60-69';
  return '70+';
}

function calcAge(dob) {
  if (!dob) return null;
  const d = new Date(dob), now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
  return age >= 0 && age <= 130 ? age : null;
}

function classifySymptoms(syms) {
  const chest = syms.includes('chest-pain') || syms.includes('chest-tightness');
  const exert = syms.includes('exertional-fatigue');
  const dysp  = syms.includes('dyspnea');
  if (chest && exert) return 'typical';
  if (chest || exert) return 'atypical';
  if (dysp)           return 'dyspnea';
  return 'nonanginal';
}

function calcPtp(dob, sex, syms) {
  const age = calcAge(dob);
  if (!age || !sex || sex === 'other' || syms.length === 0) return null;
  const ag = ageGroup(age);
  if (!ag) return null;
  const sc = classifySymptoms(syms);
  const gk = sex === 'male' ? 'm' : 'f';
  const pct = ESC_PTP[ag]?.[sc]?.[gk];
  return pct != null ? { pct, sc, age, ag } : null;
}

function ptpBracket(pct) {
  if (pct <= 5)  return 'le5';
  if (pct <= 14) return '6to14';
  return 'ge15';
}

// ── CDS message lookup ────────────────────────────────────────────────────────
const MESSAGES = {
  "three|neg_le5|neg|neg": "Considering test-negative CAD, PH, and PCWP results, the tested signals do not prioritize ischemic CAD, pulmonary hypertension, or elevated left-sided filling pressure among the evaluated contributors to symptoms. Given the CAD test-negative result, the probability of disease is updated to ≤5% and is sufficiently low that diagnostic testing should be performed only for compelling reasons*. Continue clinical evaluation for other causes when symptoms persist, are concerning, or clinical judgment suggests additional workup.\n*2019 ESC chronic coronary syndromes guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|neg_6to14|neg|neg": "Considering test-negative CAD, PH, and PCWP results, the tested signals do not prioritize ischemic CAD, pulmonary hypertension, or elevated left-sided filling pressure among the evaluated contributors to symptoms. Given the CAD test-negative result, the probability of disease is updated to 6–14%; non-invasive CAD testing may be considered based on clinical judgment, patient preference, local resources, and test availability, while recognizing the higher risk of false-positive results*. Continue clinical evaluation for other causes when symptoms persist, are concerning, or clinical judgment suggests additional workup.\n*2019 ESC chronic coronary syndromes guideline and 2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|neg_ge15|neg|neg": "Considering a test-negative CAD result that nevertheless leaves a post-test probability ≥15% together with test-negative PH and PCWP results, ischemic CAD remains a potential contributor to symptoms, while the tested pulmonary hypertension and filling-pressure signals are less prioritized. Despite the test-negative CAD result, non-invasive CAD testing is beneficial. Consider CCTA, stress imaging, cardiology referral, or invasive coronary angiography in appropriate high-risk scenarios*.\n*2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|pos_le5|neg|neg": "Considering a test-positive CAD result with test-negative PH and PCWP results, the pulmonary hypertension and filling-pressure signals are not prioritized, and the CAD result is interpreted in light of the post-test probability below. Although the CAD test was positive, the probability of disease remains ≤5% and is sufficiently low that diagnostic testing should be performed only for compelling reasons*. Continue clinical evaluation for other causes when symptoms persist, are concerning, or clinical judgment suggests additional workup.\n*2019 ESC chronic coronary syndromes guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|pos_6to14|neg|neg": "Considering a test-positive CAD result with test-negative PH and PCWP results, the pulmonary hypertension and filling-pressure signals are not prioritized, and the CAD result is interpreted in light of the post-test probability below. Although the CAD test was positive, the post-test probability of disease is 6–14%; non-invasive CAD testing may be considered based on clinical judgment, patient preference, local resources, and test availability, while recognizing the higher risk of false-positive results*. Continue clinical evaluation for other causes when symptoms persist, are concerning, or clinical judgment suggests additional workup.\n*2019 ESC chronic coronary syndromes guideline and 2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|pos_ge15|neg|neg": "Considering a test-positive CAD result with a post-test probability ≥15% together with test-negative PH and PCWP results, ischemic CAD remains a potential contributor to symptoms, while the tested pulmonary hypertension and filling-pressure signals are less prioritized. Non-invasive CAD testing is beneficial. Consider CCTA, stress imaging, cardiology referral, or invasive coronary angiography in appropriate high-risk scenarios*.\n*2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|neg_le5|neg|pos": "Considering a test-positive PCWP result with a test-negative CAD result and a test-negative PH result, the elevated filling-pressure signal is the main physiologic signal of interest. Assess for heart failure and other left-heart contributors, including ejection fraction, diastolic function, valvular heart disease, volume/renal status, blood pressure, and rhythm*. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context*. Given the CAD test-negative result, the probability of disease is updated to ≤5% and is sufficiently low that diagnostic testing should be performed only for compelling reasons**.\n*2022 AHA/ACC/HFSA HF guideline; **2019 ESC chronic coronary syndromes guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|neg_6to14|neg|pos": "Considering a test-positive PCWP result with a test-negative CAD result and a test-negative PH result, the elevated filling-pressure signal is the main physiologic signal of interest. Assess for heart failure and other left-heart contributors, including ejection fraction, diastolic function, valvular heart disease, volume/renal status, blood pressure, and rhythm*. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context*. Given the CAD test-negative result, the probability of disease is updated to 6–14%; non-invasive CAD testing may be considered based on clinical judgment, patient preference, local resources, and test availability, while recognizing the higher risk of false-positive results**.\n*2022 AHA/ACC/HFSA HF guideline; **2019 ESC chronic coronary syndromes guideline and 2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|neg_ge15|neg|pos": "Considering a test-negative CAD result that nevertheless leaves a post-test probability ≥15% together with a test-positive PCWP result and test-negative PH result, both ischemic CAD and elevated left-sided filling pressure remain potential contributors to symptoms. Despite the test-negative CAD result, non-invasive CAD testing is beneficial. Consider CCTA, stress imaging, cardiology referral, or invasive coronary angiography in appropriate high-risk scenarios**. Assess for heart failure and other left-heart contributors, including ejection fraction, diastolic function, valvular heart disease, volume/renal status, blood pressure, and rhythm*. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context*.\n*2022 AHA/ACC/HFSA HF guideline; **2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|pos_le5|neg|pos": "Considering a test-positive PCWP result with a test-positive CAD result and a test-negative PH result, the elevated filling-pressure signal is the main physiologic signal of interest. Assess for heart failure and other left-heart contributors, including ejection fraction, diastolic function, valvular heart disease, volume/renal status, blood pressure, and rhythm*. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context*. Although the CAD test was positive, the probability of disease remains ≤5% and is sufficiently low that diagnostic testing should be performed only for compelling reasons**.\n*2022 AHA/ACC/HFSA HF guideline; **2019 ESC chronic coronary syndromes guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|pos_6to14|neg|pos": "Considering a test-positive PCWP result with a test-positive CAD result and a test-negative PH result, the elevated filling-pressure signal is the main physiologic signal of interest. Assess for heart failure and other left-heart contributors, including ejection fraction, diastolic function, valvular heart disease, volume/renal status, blood pressure, and rhythm*. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context*. Although the CAD test was positive, the post-test probability of disease is 6–14%; non-invasive CAD testing may be considered based on clinical judgment, patient preference, local resources, and test availability, while recognizing the higher risk of false-positive results**.\n*2022 AHA/ACC/HFSA HF guideline; **2019 ESC chronic coronary syndromes guideline and 2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|pos_ge15|neg|pos": "Considering a test-positive CAD result with a post-test probability ≥15% together with a test-positive PCWP result and test-negative PH result, both ischemic CAD and elevated left-sided filling pressure remain potential contributors to symptoms. Non-invasive CAD testing is beneficial. Consider CCTA, stress imaging, cardiology referral, or invasive coronary angiography in appropriate high-risk scenarios**. Assess for heart failure and other left-heart contributors, including ejection fraction, diastolic function, valvular heart disease, volume/renal status, blood pressure, and rhythm*. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context*.\n*2022 AHA/ACC/HFSA HF guideline; **2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|neg_le5|pos|neg": "Considering a test-positive PH result with a test-negative CAD result and a test-negative PCWP result, the PH signal is the main physiologic signal of interest. The test-negative PCWP result supports exclusion of Group 2/post-capillary PH but does not rule it out*. Consider referral to a PH specialist for workup of non-Group 2 PH*. Given the CAD test-negative result, the probability of disease is updated to ≤5% and is sufficiently low that diagnostic testing should be performed only for compelling reasons**.\n*2022 ESC/ERS PH guideline; **2019 ESC chronic coronary syndromes guideline\n\nPlease note that the PCWP test detects PCWP >18 mmHg, whereas the PH guidelines phenotype with PCWP at ≥15 mmHg.\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|neg_6to14|pos|neg": "Considering a test-positive PH result with a test-negative CAD result and a test-negative PCWP result, the PH signal is the main physiologic signal of interest. The test-negative PCWP result supports exclusion of Group 2/post-capillary PH but does not rule it out*. Consider referral to a PH specialist for workup of non-Group 2 PH*. Given the CAD test-negative result, the probability of disease is updated to 6–14%; non-invasive CAD testing may be considered based on clinical judgment, patient preference, local resources, and test availability, while recognizing the higher risk of false-positive results**.\n*2022 ESC/ERS PH guideline; **2019 ESC chronic coronary syndromes guideline and 2021 AHA/ACC chest pain guideline\n\nPlease note that the PCWP test detects PCWP >18 mmHg, whereas the PH guidelines phenotype with PCWP at ≥15 mmHg.\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|neg_ge15|pos|neg": "Considering a test-negative CAD result that nevertheless leaves a post-test probability ≥15% together with a test-positive PH result and test-negative PCWP result, both ischemic CAD and pulmonary hypertension remain potential contributors to symptoms. Despite the test-negative CAD result, non-invasive CAD testing is beneficial. Consider CCTA, stress imaging, cardiology referral, or invasive coronary angiography in appropriate high-risk scenarios**. The test-negative PCWP result supports exclusion of Group 2/post-capillary PH but does not rule it out*. Consider referral to a PH specialist for workup of non-Group 2 PH*.\n*2022 ESC/ERS PH guideline; **2021 AHA/ACC chest pain guideline\n\nPlease note that the PCWP test detects PCWP >18 mmHg, whereas the PH guidelines phenotype with PCWP at ≥15 mmHg.\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|pos_le5|pos|neg": "Considering a test-positive PH result with a test-positive CAD result and a test-negative PCWP result, the PH signal is the main physiologic signal of interest. The test-negative PCWP result supports exclusion of Group 2/post-capillary PH but does not rule it out*. Consider referral to a PH specialist for workup of non-Group 2 PH*. Although the CAD test was positive, the probability of disease remains ≤5% and is sufficiently low that diagnostic testing should be performed only for compelling reasons**.\n*2022 ESC/ERS PH guideline; **2019 ESC chronic coronary syndromes guideline\n\nPlease note that the PCWP test detects PCWP >18 mmHg, whereas the PH guidelines phenotype with PCWP at ≥15 mmHg.\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|pos_6to14|pos|neg": "Considering a test-positive PH result with a test-positive CAD result and a test-negative PCWP result, the PH signal is the main physiologic signal of interest. The test-negative PCWP result supports exclusion of Group 2/post-capillary PH but does not rule it out*. Consider referral to a PH specialist for workup of non-Group 2 PH*. Although the CAD test was positive, the post-test probability of disease is 6–14%; non-invasive CAD testing may be considered based on clinical judgment, patient preference, local resources, and test availability, while recognizing the higher risk of false-positive results**.\n*2022 ESC/ERS PH guideline; **2019 ESC chronic coronary syndromes guideline and 2021 AHA/ACC chest pain guideline\n\nPlease note that the PCWP test detects PCWP >18 mmHg, whereas the PH guidelines phenotype with PCWP at ≥15 mmHg.\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|pos_ge15|pos|neg": "Considering a test-positive CAD result with a post-test probability ≥15% together with a test-positive PH result and test-negative PCWP result, both ischemic CAD and pulmonary hypertension remain potential contributors to symptoms. Non-invasive CAD testing is beneficial. Consider CCTA, stress imaging, cardiology referral, or invasive coronary angiography in appropriate high-risk scenarios**. The test-negative PCWP result supports exclusion of Group 2/post-capillary PH but does not rule it out*. Consider referral to a PH specialist for workup of non-Group 2 PH*.\n*2022 ESC/ERS PH guideline; **2021 AHA/ACC chest pain guideline\n\nPlease note that the PCWP test detects PCWP >18 mmHg, whereas the PH guidelines phenotype with PCWP at ≥15 mmHg.\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|neg_le5|pos|pos": "Considering test-positive PH and PCWP results with a test-negative CAD result, the combined PH and PCWP pattern is the main physiologic signal of interest. The combined PH and PCWP pattern is compatible with post-capillary PH physiology*. Evaluate heart failure phenotype, ejection fraction, valvular heart disease, volume/renal status, blood pressure, and rhythm. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context**. RHC may be appropriate when needed for confirmation*. Given the CAD test-negative result, the probability of disease is updated to ≤5% and is sufficiently low that diagnostic testing should be performed only for compelling reasons***.\n*2022 ESC/ERS PH guideline; **2022 AHA/ACC/HFSA HF guideline; ***2019 ESC chronic coronary syndromes guideline\n\nPlease note that the PCWP test detects PCWP >18 mmHg, whereas the PH guidelines phenotype with PCWP at ≥15 mmHg.\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|neg_6to14|pos|pos": "Considering test-positive PH and PCWP results with a test-negative CAD result, the combined PH and PCWP pattern is the main physiologic signal of interest. The combined PH and PCWP pattern is compatible with post-capillary PH physiology*. Evaluate heart failure phenotype, ejection fraction, valvular heart disease, volume/renal status, blood pressure, and rhythm. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context**. RHC may be appropriate when needed for confirmation*. Given the CAD test-negative result, the probability of disease is updated to 6–14%; non-invasive CAD testing may be considered based on clinical judgment, patient preference, local resources, and test availability, while recognizing the higher risk of false-positive results***.\n*2022 ESC/ERS PH guideline; **2022 AHA/ACC/HFSA HF guideline; ***2019 ESC chronic coronary syndromes guideline and 2021 AHA/ACC chest pain guideline\n\nPlease note that the PCWP test detects PCWP >18 mmHg, whereas the PH guidelines phenotype with PCWP at ≥15 mmHg.\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|neg_ge15|pos|pos": "Considering a test-negative CAD result that nevertheless leaves a post-test probability ≥15% together with test-positive PH and PCWP results, ischemic CAD, pulmonary hypertension, and elevated left-sided filling pressure are all potential contributors to symptoms. Despite the test-negative CAD result, non-invasive CAD testing is beneficial. Consider CCTA, stress imaging, cardiology referral, or invasive coronary angiography in appropriate high-risk scenarios***. The combined PH and PCWP pattern is compatible with post-capillary PH physiology*. Evaluate heart failure phenotype, ejection fraction, valvular heart disease, volume/renal status, blood pressure, and rhythm. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context**. RHC may be appropriate when needed for confirmation*.\n*2022 ESC/ERS PH guideline; **2022 AHA/ACC/HFSA HF guideline; ***2021 AHA/ACC chest pain guideline\n\nPlease note that the PCWP test detects PCWP >18 mmHg, whereas the PH guidelines phenotype with PCWP at ≥15 mmHg.\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|pos_le5|pos|pos": "Considering test-positive PH and PCWP results with a test-positive CAD result, the combined PH and PCWP pattern is the main physiologic signal of interest. The combined PH and PCWP pattern is compatible with post-capillary PH physiology*. Evaluate heart failure phenotype, ejection fraction, valvular heart disease, volume/renal status, blood pressure, and rhythm. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context**. RHC may be appropriate when needed for confirmation*. Although the CAD test was positive, the probability of disease remains ≤5% and is sufficiently low that diagnostic testing should be performed only for compelling reasons***.\n*2022 ESC/ERS PH guideline; **2022 AHA/ACC/HFSA HF guideline; ***2019 ESC chronic coronary syndromes guideline\n\nPlease note that the PCWP test detects PCWP >18 mmHg, whereas the PH guidelines phenotype with PCWP at ≥15 mmHg.\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|pos_6to14|pos|pos": "Considering test-positive PH and PCWP results with a test-positive CAD result, the combined PH and PCWP pattern is the main physiologic signal of interest. The combined PH and PCWP pattern is compatible with post-capillary PH physiology*. Evaluate heart failure phenotype, ejection fraction, valvular heart disease, volume/renal status, blood pressure, and rhythm. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context**. RHC may be appropriate when needed for confirmation*. Although the CAD test was positive, the post-test probability of disease is 6–14%; non-invasive CAD testing may be considered based on clinical judgment, patient preference, local resources, and test availability, while recognizing the higher risk of false-positive results***.\n*2022 ESC/ERS PH guideline; **2022 AHA/ACC/HFSA HF guideline; ***2019 ESC chronic coronary syndromes guideline and 2021 AHA/ACC chest pain guideline\n\nPlease note that the PCWP test detects PCWP >18 mmHg, whereas the PH guidelines phenotype with PCWP at ≥15 mmHg.\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "three|pos_ge15|pos|pos": "Considering a test-positive CAD result with a post-test probability ≥15% together with test-positive PH and PCWP results, ischemic CAD, pulmonary hypertension, and elevated left-sided filling pressure are all potential contributors to symptoms. Non-invasive CAD testing is beneficial. Consider CCTA, stress imaging, cardiology referral, or invasive coronary angiography in appropriate high-risk scenarios***. The combined PH and PCWP pattern is compatible with post-capillary PH physiology*. Evaluate heart failure phenotype, ejection fraction, valvular heart disease, volume/renal status, blood pressure, and rhythm. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context**. RHC may be appropriate when needed for confirmation*.\n*2022 ESC/ERS PH guideline; **2022 AHA/ACC/HFSA HF guideline; ***2021 AHA/ACC chest pain guideline\n\nPlease note that the PCWP test detects PCWP >18 mmHg, whereas the PH guidelines phenotype with PCWP at ≥15 mmHg.\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-ph|neg_le5|neg|no": "Considering test-negative CAD and PH results, the tested signals do not prioritize ischemic CAD or pulmonary hypertension among the evaluated contributors to symptoms. Given the CAD test-negative result, the probability of disease is updated to ≤5% and is sufficiently low that diagnostic testing should be performed only for compelling reasons*. Continue clinical evaluation for other causes when symptoms persist, are concerning, or clinical judgment suggests additional workup.\n*2019 ESC chronic coronary syndromes guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-ph|neg_6to14|neg|no": "Considering test-negative CAD and PH results, the tested signals do not prioritize ischemic CAD or pulmonary hypertension among the evaluated contributors to symptoms. Given the CAD test-negative result, the probability of disease is updated to 6–14%; non-invasive CAD testing may be considered based on clinical judgment, patient preference, local resources, and test availability, while recognizing the higher risk of false-positive results*. Continue clinical evaluation for other causes when symptoms persist, are concerning, or clinical judgment suggests additional workup.\n*2019 ESC chronic coronary syndromes guideline and 2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-ph|neg_ge15|neg|no": "Considering a test-negative CAD result that nevertheless leaves a post-test probability ≥15% together with a test-negative PH result, ischemic CAD remains a potential contributor to symptoms, while the tested pulmonary hypertension signal is less prioritized. Despite the test-negative CAD result, non-invasive CAD testing is beneficial. Consider CCTA, stress imaging, cardiology referral, or invasive coronary angiography in appropriate high-risk scenarios*.\n*2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-ph|pos_le5|neg|no": "Considering a test-positive CAD result with a test-negative PH result, the pulmonary hypertension signal is not prioritized, and the CAD result is interpreted in light of the post-test probability below. Although the CAD test was positive, the probability of disease remains ≤5% and is sufficiently low that diagnostic testing should be performed only for compelling reasons*. Continue clinical evaluation for other causes when symptoms persist, are concerning, or clinical judgment suggests additional workup.\n*2019 ESC chronic coronary syndromes guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-ph|pos_6to14|neg|no": "Considering a test-positive CAD result with a test-negative PH result, the pulmonary hypertension signal is not prioritized, and the CAD result is interpreted in light of the post-test probability below. Although the CAD test was positive, the post-test probability of disease is 6–14%; non-invasive CAD testing may be considered based on clinical judgment, patient preference, local resources, and test availability, while recognizing the higher risk of false-positive results*. Continue clinical evaluation for other causes when symptoms persist, are concerning, or clinical judgment suggests additional workup.\n*2019 ESC chronic coronary syndromes guideline and 2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-ph|pos_ge15|neg|no": "Considering a test-positive CAD result with a post-test probability ≥15% together with a test-negative PH result, ischemic CAD remains a potential contributor to symptoms, while the tested pulmonary hypertension signal is less prioritized. Non-invasive CAD testing is beneficial. Consider CCTA, stress imaging, cardiology referral, or invasive coronary angiography in appropriate high-risk scenarios*.\n*2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-ph|neg_le5|pos|no": "Considering a test-positive PH result with a test-negative CAD result, the PH signal is the main physiologic signal of interest. Consider referral to a PH specialist when appropriate*. Given the CAD test-negative result, the probability of disease is updated to ≤5% and is sufficiently low that diagnostic testing should be performed only for compelling reasons**.\n*2022 ESC/ERS PH guideline; **2019 ESC chronic coronary syndromes guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-ph|neg_6to14|pos|no": "Considering a test-positive PH result with a test-negative CAD result, the PH signal is the main physiologic signal of interest. Consider referral to a PH specialist when appropriate*. Given the CAD test-negative result, the probability of disease is updated to 6–14%; non-invasive CAD testing may be considered based on clinical judgment, patient preference, local resources, and test availability, while recognizing the higher risk of false-positive results**.\n*2022 ESC/ERS PH guideline; **2019 ESC chronic coronary syndromes guideline and 2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-ph|neg_ge15|pos|no": "Considering a test-negative CAD result that nevertheless leaves a post-test probability ≥15% together with a test-positive PH result, both ischemic CAD and pulmonary hypertension remain potential contributors to symptoms. Despite the test-negative CAD result, non-invasive CAD testing is beneficial. Consider CCTA, stress imaging, cardiology referral, or invasive coronary angiography in appropriate high-risk scenarios**. Consider referral to a PH specialist when appropriate*.\n*2022 ESC/ERS PH guideline; **2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-ph|pos_le5|pos|no": "Considering a test-positive PH result with a test-positive CAD result, the PH signal is the main physiologic signal of interest. Consider referral to a PH specialist when appropriate*. Although the CAD test was positive, the probability of disease remains ≤5% and is sufficiently low that diagnostic testing should be performed only for compelling reasons**.\n*2022 ESC/ERS PH guideline; **2019 ESC chronic coronary syndromes guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-ph|pos_6to14|pos|no": "Considering a test-positive PH result with a test-positive CAD result, the PH signal is the main physiologic signal of interest. Consider referral to a PH specialist when appropriate*. Although the CAD test was positive, the post-test probability of disease is 6–14%; non-invasive CAD testing may be considered based on clinical judgment, patient preference, local resources, and test availability, while recognizing the higher risk of false-positive results**.\n*2022 ESC/ERS PH guideline; **2019 ESC chronic coronary syndromes guideline and 2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-ph|pos_ge15|pos|no": "Considering a test-positive CAD result with a post-test probability ≥15% together with a test-positive PH result, both ischemic CAD and pulmonary hypertension remain potential contributors to symptoms. Non-invasive CAD testing is beneficial. Consider CCTA, stress imaging, cardiology referral, or invasive coronary angiography in appropriate high-risk scenarios**. Consider referral to a PH specialist when appropriate*.\n*2022 ESC/ERS PH guideline; **2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-pcwp|neg_le5|no|neg": "Considering test-negative CAD and PCWP results, the tested signals do not prioritize ischemic CAD or elevated left-sided filling pressure among the evaluated contributors to symptoms. Given the CAD test-negative result, the probability of disease is updated to ≤5% and is sufficiently low that diagnostic testing should be performed only for compelling reasons*. Continue clinical evaluation for other causes when symptoms persist, are concerning, or clinical judgment suggests additional workup.\n*2019 ESC chronic coronary syndromes guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-pcwp|neg_6to14|no|neg": "Considering test-negative CAD and PCWP results, the tested signals do not prioritize ischemic CAD or elevated left-sided filling pressure among the evaluated contributors to symptoms. Given the CAD test-negative result, the probability of disease is updated to 6–14%; non-invasive CAD testing may be considered based on clinical judgment, patient preference, local resources, and test availability, while recognizing the higher risk of false-positive results*. Continue clinical evaluation for other causes when symptoms persist, are concerning, or clinical judgment suggests additional workup.\n*2019 ESC chronic coronary syndromes guideline and 2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-pcwp|neg_ge15|no|neg": "Considering a test-negative CAD result that nevertheless leaves a post-test probability ≥15% together with a test-negative PCWP result, ischemic CAD remains a potential contributor to symptoms, while the tested filling-pressure signal is less prioritized. Despite the test-negative CAD result, non-invasive CAD testing is beneficial. Consider CCTA, stress imaging, cardiology referral, or invasive coronary angiography in appropriate high-risk scenarios*.\n*2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-pcwp|pos_le5|no|neg": "Considering a test-positive CAD result with a test-negative PCWP result, the filling-pressure signal is not prioritized, and the CAD result is interpreted in light of the post-test probability below. Although the CAD test was positive, the probability of disease remains ≤5% and is sufficiently low that diagnostic testing should be performed only for compelling reasons*. Continue clinical evaluation for other causes when symptoms persist, are concerning, or clinical judgment suggests additional workup.\n*2019 ESC chronic coronary syndromes guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-pcwp|pos_6to14|no|neg": "Considering a test-positive CAD result with a test-negative PCWP result, the filling-pressure signal is not prioritized, and the CAD result is interpreted in light of the post-test probability below. Although the CAD test was positive, the post-test probability of disease is 6–14%; non-invasive CAD testing may be considered based on clinical judgment, patient preference, local resources, and test availability, while recognizing the higher risk of false-positive results*. Continue clinical evaluation for other causes when symptoms persist, are concerning, or clinical judgment suggests additional workup.\n*2019 ESC chronic coronary syndromes guideline and 2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-pcwp|pos_ge15|no|neg": "Considering a test-positive CAD result with a post-test probability ≥15% together with a test-negative PCWP result, ischemic CAD remains a potential contributor to symptoms, while the tested filling-pressure signal is less prioritized. Non-invasive CAD testing is beneficial. Consider CCTA, stress imaging, cardiology referral, or invasive coronary angiography in appropriate high-risk scenarios*.\n*2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-pcwp|neg_le5|no|pos": "Considering a test-positive PCWP result with a test-negative CAD result, the elevated filling-pressure signal is the main physiologic signal of interest. Assess for heart failure and other left-heart contributors, including ejection fraction, diastolic function, valvular heart disease, volume/renal status, blood pressure, and rhythm*. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context*. Given the CAD test-negative result, the probability of disease is updated to ≤5% and is sufficiently low that diagnostic testing should be performed only for compelling reasons**.\n*2022 AHA/ACC/HFSA HF guideline; **2019 ESC chronic coronary syndromes guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-pcwp|neg_6to14|no|pos": "Considering a test-positive PCWP result with a test-negative CAD result, the elevated filling-pressure signal is the main physiologic signal of interest. Assess for heart failure and other left-heart contributors, including ejection fraction, diastolic function, valvular heart disease, volume/renal status, blood pressure, and rhythm*. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context*. Given the CAD test-negative result, the probability of disease is updated to 6–14%; non-invasive CAD testing may be considered based on clinical judgment, patient preference, local resources, and test availability, while recognizing the higher risk of false-positive results**.\n*2022 AHA/ACC/HFSA HF guideline; **2019 ESC chronic coronary syndromes guideline and 2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-pcwp|neg_ge15|no|pos": "Considering a test-negative CAD result that nevertheless leaves a post-test probability ≥15% together with a test-positive PCWP result, both ischemic CAD and elevated left-sided filling pressure remain potential contributors to symptoms. Despite the test-negative CAD result, non-invasive CAD testing is beneficial. Consider CCTA, stress imaging, cardiology referral, or invasive coronary angiography in appropriate high-risk scenarios**. Assess for heart failure and other left-heart contributors, including ejection fraction, diastolic function, valvular heart disease, volume/renal status, blood pressure, and rhythm*. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context*.\n*2022 AHA/ACC/HFSA HF guideline; **2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-pcwp|pos_le5|no|pos": "Considering a test-positive PCWP result with a test-positive CAD result, the elevated filling-pressure signal is the main physiologic signal of interest. Assess for heart failure and other left-heart contributors, including ejection fraction, diastolic function, valvular heart disease, volume/renal status, blood pressure, and rhythm*. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context*. Although the CAD test was positive, the probability of disease remains ≤5% and is sufficiently low that diagnostic testing should be performed only for compelling reasons**.\n*2022 AHA/ACC/HFSA HF guideline; **2019 ESC chronic coronary syndromes guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-pcwp|pos_6to14|no|pos": "Considering a test-positive PCWP result with a test-positive CAD result, the elevated filling-pressure signal is the main physiologic signal of interest. Assess for heart failure and other left-heart contributors, including ejection fraction, diastolic function, valvular heart disease, volume/renal status, blood pressure, and rhythm*. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context*. Although the CAD test was positive, the post-test probability of disease is 6–14%; non-invasive CAD testing may be considered based on clinical judgment, patient preference, local resources, and test availability, while recognizing the higher risk of false-positive results**.\n*2022 AHA/ACC/HFSA HF guideline; **2019 ESC chronic coronary syndromes guideline and 2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad-pcwp|pos_ge15|no|pos": "Considering a test-positive CAD result with a post-test probability ≥15% together with a test-positive PCWP result, both ischemic CAD and elevated left-sided filling pressure remain potential contributors to symptoms. Non-invasive CAD testing is beneficial. Consider CCTA, stress imaging, cardiology referral, or invasive coronary angiography in appropriate high-risk scenarios**. Assess for heart failure and other left-heart contributors, including ejection fraction, diastolic function, valvular heart disease, volume/renal status, blood pressure, and rhythm*. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context*.\n*2022 AHA/ACC/HFSA HF guideline; **2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "ph-pcwp|no|neg|neg": "Considering test-negative PH and PCWP results, the tested signals do not prioritize PH or elevated left-sided filling pressure among the evaluated contributors to symptoms. Continue clinical evaluation for other causes when symptoms persist, are concerning, or clinical judgment suggests additional workup.",
  "ph-pcwp|no|neg|pos": "Considering an isolated test-positive PCWP result with a test-negative PH result, this pattern supports elevated left-sided filling pressure as a potential contributor to symptoms. Assess for heart failure and other left-heart contributors, including ejection fraction, diastolic function, valvular heart disease, volume/renal status, blood pressure, and rhythm*. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context*.\n*2022 AHA/ACC/HFSA HF guideline",
  "ph-pcwp|no|pos|neg": "Considering an isolated test-positive PH result with a test-negative PCWP result, this pattern supports pulmonary hypertension as a potential contributor to symptoms. The test-negative PCWP result supports exclusion of Group 2/post-capillary PH but does not rule it out*. Consider referral to a PH specialist for workup of non-Group 2 PH*.\n*2022 ESC/ERS PH guideline\n\nPlease note that the PCWP test detects PCWP >18 mmHg, whereas the PH guidelines phenotype with PCWP at ≥15 mmHg.",
  "ph-pcwp|no|pos|pos": "Considering test-positive PH and PCWP results, the combined PH and PCWP pattern is compatible with post-capillary PH physiology*. Evaluate heart failure phenotype, ejection fraction, valvular heart disease, volume/renal status, blood pressure, and rhythm. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context**. RHC may be appropriate when needed for confirmation*.\n*2022 ESC/ERS PH guideline; **2022 AHA/ACC/HFSA HF guideline\n\nPlease note that the PCWP test detects PCWP >18 mmHg, whereas the PH guidelines phenotype with PCWP at ≥15 mmHg.",
  "cad|neg_le5|no|no": "Considering a test-negative CAD result, the CAD result is interpreted in light of the post-test probability below. Given the CAD test-negative result, the probability of disease is updated to ≤5% and is sufficiently low that diagnostic testing should be performed only for compelling reasons*.\n*2019 ESC chronic coronary syndromes guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad|neg_6to14|no|no": "Considering a test-negative CAD result, the CAD result is interpreted in light of the post-test probability below. Given the CAD test-negative result, the probability of disease is updated to 6–14%; non-invasive CAD testing may be considered based on clinical judgment, patient preference, local resources, and test availability, while recognizing the higher risk of false-positive results*.\n*2019 ESC chronic coronary syndromes guideline and 2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad|neg_ge15|no|no": "Considering a test-negative CAD result that nevertheless leaves a post-test probability ≥15%, ischemic CAD remains a potential contributor to symptoms. Despite the test-negative CAD result, non-invasive CAD testing is beneficial. Consider CCTA, stress imaging, cardiology referral, or invasive coronary angiography in appropriate high-risk scenarios*.\n*2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad|pos_le5|no|no": "Considering an isolated test-positive CAD result, ischemic CAD cannot be ruled out as a contributor to symptoms. Although the CAD test was positive, the probability of disease remains ≤5% and is sufficiently low that diagnostic testing should be performed only for compelling reasons*.\n*2019 ESC chronic coronary syndromes guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad|pos_6to14|no|no": "Considering an isolated test-positive CAD result, ischemic CAD cannot be ruled out as a contributor to symptoms. Although the CAD test was positive, the post-test probability of disease is 6–14%; non-invasive CAD testing may be considered based on clinical judgment, patient preference, local resources, and test availability, while recognizing the higher risk of false-positive results*.\n*2019 ESC chronic coronary syndromes guideline and 2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "cad|pos_ge15|no|no": "Considering a test-positive CAD result with a post-test probability ≥15%, ischemic CAD remains a potential contributor to symptoms. Non-invasive CAD testing is beneficial. Consider CCTA, stress imaging, cardiology referral, or invasive coronary angiography in appropriate high-risk scenarios*.\n*2021 AHA/ACC chest pain guideline\n\nPlease note that the pre-test probability (and therefore the resultant post-test probability) assumes that the patient has not had any other evaluations for coronary disease.",
  "ph|no|neg|no": "Considering a test-negative PH result, the tested signal does not prioritize pulmonary hypertension among the evaluated contributors to symptoms. Continue clinical evaluation for other causes when symptoms persist, are concerning, or clinical judgment suggests additional workup.",
  "ph|no|pos|no": "Considering an isolated test-positive PH result, this pattern supports pulmonary hypertension as a potential contributor to symptoms. Consider ordering the PCWP test for further context on left ventricular filling pressures to clarify PH etiology, and consider referral to a PH specialist when appropriate*.\n*2022 ESC/ERS PH guideline",
  "pcwp|no|no|neg": "Considering a test-negative PCWP result, the tested signal does not prioritize elevated left-sided filling pressure among the evaluated contributors to symptoms. Continue clinical evaluation for other causes when symptoms persist, are concerning, or clinical judgment suggests additional workup.",
  "pcwp|no|no|pos": "Considering an isolated test-positive PCWP result, this pattern supports elevated left-sided filling pressure as a potential contributor to symptoms. Assess for heart failure and other left-heart contributors, including ejection fraction, diastolic function, valvular heart disease, volume/renal status, blood pressure, and rhythm*. EF-agnostic measures include diuretics for congestion and SGLT2 inhibitor therapy when appropriate, and tailor additional therapy to the clinical context*.\n*2022 AHA/ACC/HFSA HF guideline",
};

const SCOPE_LABELS = {
  three:'Three-Test', 'cad-ph':'Pairwise: CAD + PH', 'cad-pcwp':'Pairwise: CAD + PCWP',
  'ph-pcwp':'Pairwise: PH + PCWP', cad:'Single-Test: CAD', ph:'Single-Test: PH', pcwp:'Single-Test: PCWP',
};

function getStatus(v) {
  const s = String(v).trim();
  if (s === '') return 'no';
  const n = parseFloat(s);
  if (isNaN(n)) return 'no';
  return n > 0 ? 'pos' : n < 0 ? 'neg' : 'no';
}

function getScope(cad, ph, pcwp) {
  const hC = cad !== 'no', hP = ph !== 'no', hW = pcwp !== 'no';
  if (hC && hP && hW) return 'three';
  if (hC && hP)  return 'cad-ph';
  if (hC && hW)  return 'cad-pcwp';
  if (hP && hW)  return 'ph-pcwp';
  if (hC)        return 'cad';
  if (hP)        return 'ph';
  if (hW)        return 'pcwp';
  return null;
}

function cadKey(status, prob) {
  return status === 'no' ? 'no' : `${status}_${prob}`;
}

function formatMessage(text) {
  const lines = text.split('\n');
  const mainLines = [], footnoteLines = [], noteLines = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('Please note')) noteLines.push(t);
    else if (/^\*+\d{4}/.test(t)) footnoteLines.push(t);
    else mainLines.push(t);
  }
  const sentences = mainLines.join(' ')
    .split(/\. (?=[A-Z])/).map(s => s.trim()).filter(Boolean)
    .map(s => s.endsWith('.') ? s : s + '.');
  const ctx = sentences[0] || '';
  const actions = sentences.slice(1);
  let html = ctx ? `<div class="cds-context">${ctx}</div>` : '';
  if (actions.length) {
    html += `<div class="cds-rec-label">Recommendations</div><ul class="cds-actions">`;
    actions.forEach(s => { html += `<li>${s}</li>`; });
    html += '</ul>';
  }
  if (footnoteLines.length) {
    html += `<hr class="cds-rule"/>`;
    footnoteLines.forEach(l => {
      html += `<div class="cds-footnotes">${l.split(';').map(r => r.trim()).filter(Boolean).join('<br/>')}</div>`;
    });
  }
  if (noteLines.length) {
    html += `<div class="cds-notes">`;
    noteLines.forEach(n => { html += `<p>${n}</p>`; });
    html += '</div>';
  }
  return html;
}

// ── HCP gate ──────────────────────────────────────────────────────────────────
function HcpGate({ onConfirm }) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:'var(--bg-elev,var(--white))', border:'1px solid var(--rule)', borderRadius:'var(--radius-lg)', padding:'48px 40px', maxWidth:480, width:'100%', textAlign:'center' }}>
        <Brand />
        <div style={{ marginTop:28, display:'inline-block', padding:'3px 12px', background:'var(--blue-tint)', color:'var(--blue-deep)', borderRadius:3, fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:24 }}>
          US Healthcare Professionals Only
        </div>
        <h2 style={{ fontFamily:'var(--f-sans)', fontSize:22, fontWeight:700, color:'var(--fg)', lineHeight:1.3, marginBottom:16 }}>
          This page is intended for US healthcare professionals
        </h2>
        <p style={{ fontFamily:'var(--f-body)', color:'var(--fg-muted)', fontSize:15, lineHeight:1.65, marginBottom:32 }}>
          The content on this page includes clinical decision support tools and medical affairs resources intended for licensed healthcare providers practicing in the United States.
        </p>
        <button
          onClick={onConfirm}
          className="btn btn-primary"
          style={{ width:'100%', justifyContent:'center', padding:'14px 24px', fontSize:15 }}
        >
          I confirm I am a US healthcare professional
        </button>
        <div style={{ marginTop:16 }}>
          <NavA to="home" style={{ color:'var(--fg-muted)', fontSize:14, fontFamily:'var(--f-body)' }}>
            Return to main site →
          </NavA>
        </div>
        <p style={{ marginTop:24, fontSize:11, color:'var(--fg-muted)', lineHeight:1.5 }}>
          For investigational use only. The CorVista System and related tools are not intended to replace clinical judgment.
        </p>
      </div>
    </div>
  );
}

// ── CDS Tool ──────────────────────────────────────────────────────────────────
const SYMS = [
  { value:'chest-pain',       label:'Chest pain or pressure' },
  { value:'chest-tightness',  label:'Chest tightness or heaviness' },
  { value:'radiating-pain',   label:'Pain radiating to arm, jaw, neck, or back' },
  { value:'dyspnea',          label:'Shortness of breath', sub:'Dyspnea' },
  { value:'exertional-fatigue',label:'Exertional fatigue' },
  { value:'dizziness',        label:'Dizziness or lightheadedness on exertion', sub:'Including syncope' },
  { value:'edema',            label:'Edema' },
  { value:'palpitations',     label:'Palpitations' },
  { value:'diaphoresis',      label:'Diaphoresis', sub:'Excessive sweating' },
  { value:'nausea',           label:'Nausea' },
];

function Badge({ status }) {
  const styles = {
    no:  { background:'var(--paper-2,#F0EDE6)', color:'var(--mid,#6B7280)', label:'Not Ordered' },
    neg: { background:'var(--blue-tint)', color:'var(--blue-deep)', label:'Negative' },
    pos: { background:'#fee2e2', color:'#b91c1c', label:'Positive' },
  };
  const s = styles[status] || styles.no;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', padding:'2px 10px', borderRadius:100, fontSize:11, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', background:s.background, color:s.color }}>
      {s.label}
    </span>
  );
}

function CdsTool() {
  const [dob, setDob]         = useState('');
  const [sex, setSex]         = useState('');
  const [syms, setSyms]       = useState([]);
  const [cadVal, setCadVal]   = useState('');
  const [phVal,  setPhVal]    = useState('');
  const [pcwpVal,setPcwpVal]  = useState('');
  const [cadProb,setCadProb]  = useState('le5');
  const [manualProb, setManualProb] = useState(false);
  const [result, setResult]   = useState(null);

  const age    = calcAge(dob);
  const ptp    = calcPtp(dob, sex, syms);
  const autoBr = ptp ? ptpBracket(ptp.pct) : null;
  const effectiveBr = manualProb ? cadProb : (autoBr || cadProb);

  const cadS  = getStatus(cadVal);
  const phS   = getStatus(phVal);
  const pcwpS = getStatus(pcwpVal);
  const scope = getScope(cadS, phS, pcwpS);

  const toggleSym = (v) => setSyms(prev => prev.includes(v) ? prev.filter(s => s !== v) : [...prev, v]);

  const handleProbChange = (v) => { setCadProb(v); setManualProb(true); };

  // Reset manual override when auto bracket changes
  const prevAutoBr = React.useRef(autoBr);
  React.useEffect(() => {
    if (autoBr && autoBr !== prevAutoBr.current) {
      setCadProb(autoBr);
      setManualProb(false);
    }
    prevAutoBr.current = autoBr;
  }, [autoBr]);

  const lookup = () => {
    const prob  = effectiveBr;
    if (!scope) return;
    const key = `${scope}|${cadKey(cadS, prob)}|${phS}|${pcwpS}`;
    const msg = MESSAGES[key];
    const parts = [];
    if (cadS !== 'no') parts.push(`CAD: ${cadS === 'pos' ? 'Positive' : 'Negative'} (${{'le5':'≤5%','6to14':'6–14%','ge15':'≥15%'}[prob]})`);
    if (phS  !== 'no') parts.push(`PH: ${phS  === 'pos' ? 'Positive' : 'Negative'}`);
    if (pcwpS !== 'no') parts.push(`PCWP: ${pcwpS === 'pos' ? 'Positive' : 'Negative'}`);
    setResult({ scope, msg, combo: parts.join(' · ') });
    setTimeout(() => document.getElementById('cds-result')?.scrollIntoView({ behavior:'smooth', block:'start' }), 50);
  };

  const cardStyle = { background:'var(--bg-elev,var(--white))', border:'1px solid var(--rule)', borderRadius:'var(--radius-lg)', padding:'28px 32px', marginBottom:20 };
  const labelStyle = { display:'block', fontSize:12, fontWeight:600, color:'var(--fg-muted)', letterSpacing:'0.04em', marginBottom:6, fontFamily:'var(--f-sans)' };
  const inputStyle = { width:'100%', padding:'10px 12px', border:'1.5px solid var(--rule)', borderRadius:'var(--radius)', fontSize:14, color:'var(--fg)', background:'var(--bg)', fontFamily:'var(--f-body)', outline:'none', boxSizing:'border-box', appearance:'none' };
  const sectionLabel = { fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--fg-muted)', marginBottom:16, fontFamily:'var(--f-sans)' };
  const bracketLabels = { le5:'≤ 5%', '6to14':'6 – 14%', ge15:'≥ 15%' };

  return (
    <div style={{ maxWidth:600, margin:'0 auto' }}>

      {/* Patient Information */}
      <div style={cardStyle}>
        <div style={sectionLabel}>Patient Information</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div>
            <label style={labelStyle}>Date of Birth</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} style={inputStyle} />
            {age != null && <div style={{ fontSize:12, color:'var(--fg-muted)', marginTop:4, fontFamily:'var(--f-body)' }}>Age: {age} years</div>}
          </div>
          <div>
            <label style={labelStyle}>Biological Sex</label>
            <select value={sex} onChange={e => setSex(e.target.value)} style={inputStyle}>
              <option value="">— Select —</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other / Prefer not to say</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Height</label>
            <div style={{ display:'flex', gap:6, alignItems:'center' }}>
              <input type="number" placeholder="ft" min="0" max="8" step="1" style={{ ...inputStyle, maxWidth:72 }} />
              <span style={{ fontSize:13, color:'var(--fg-muted)', fontFamily:'var(--f-body)' }}>ft</span>
              <input type="number" placeholder="in" min="0" max="11" step="1" style={{ ...inputStyle, maxWidth:72 }} />
              <span style={{ fontSize:13, color:'var(--fg-muted)', fontFamily:'var(--f-body)' }}>in</span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Weight</label>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <input type="number" placeholder="0" min="0" step="0.1" style={inputStyle} />
              <span style={{ fontSize:12, fontWeight:600, color:'var(--fg-muted)', whiteSpace:'nowrap', fontFamily:'var(--f-sans)' }}>lbs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Presenting Symptoms */}
      <div style={cardStyle}>
        <div style={sectionLabel}>Presenting Symptoms</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {SYMS.map(s => (
            <label key={s.value} style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer', userSelect:'none' }}>
              <input
                type="checkbox"
                checked={syms.includes(s.value)}
                onChange={() => toggleSym(s.value)}
                style={{ marginTop:2, accentColor:'var(--blue)', cursor:'pointer', width:16, height:16, flexShrink:0 }}
              />
              <span style={{ fontSize:14, color:'var(--fg)', lineHeight:1.45, fontFamily:'var(--f-body)' }}>
                {s.label}
                {s.sub && <span style={{ display:'block', fontSize:12, color:'var(--fg-muted)', marginTop:1 }}>{s.sub}</span>}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Pre-Test Probability */}
      <div style={{ ...cardStyle, background: ptp ? 'var(--blue-tint)' : 'var(--bg-elev,var(--white))', borderColor: ptp ? 'var(--blue)' : 'var(--rule)' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
          <div>
            <div style={{ ...sectionLabel, color: ptp ? 'var(--blue-deep)' : 'var(--fg-muted)', marginBottom:4 }}>
              Pre-Test Probability — CAD
            </div>
            <div style={{ fontSize:11, color:'var(--fg-muted)', fontFamily:'var(--f-body)', marginBottom: ptp ? 16 : 0 }}>
              {ptp
                ? 'Calculated · 2019 ESC Chronic Coronary Syndromes Guidelines, Table 3'
                : 'Enter date of birth, biological sex, and at least one symptom to calculate'}
            </div>
          </div>
          {ptp && (
            <div style={{ textAlign:'center', flexShrink:0, background:'var(--blue)', color:'white', borderRadius:'var(--radius-lg)', padding:'12px 20px', minWidth:80 }}>
              <div style={{ fontSize:32, fontWeight:800, fontFamily:'var(--f-sans)', lineHeight:1 }}>{ptp.pct}%</div>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', marginTop:4, opacity:0.85 }}>PTP</div>
            </div>
          )}
        </div>
        {ptp && (
          <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
            <div>
              <div style={{ fontSize:11, fontWeight:600, color:'var(--blue-deep)', letterSpacing:'0.04em', textTransform:'uppercase', fontFamily:'var(--f-sans)' }}>Symptom Type</div>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--fg)', fontFamily:'var(--f-body)', marginTop:3 }}>{SYM_LABEL[ptp.sc]}</div>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:600, color:'var(--blue-deep)', letterSpacing:'0.04em', textTransform:'uppercase', fontFamily:'var(--f-sans)' }}>Age Group · Sex</div>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--fg)', fontFamily:'var(--f-body)', marginTop:3 }}>{ptp.ag} · {sex === 'male' ? 'Male' : 'Female'}</div>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:600, color:'var(--blue-deep)', letterSpacing:'0.04em', textTransform:'uppercase', fontFamily:'var(--f-sans)' }}>Auto-bracket</div>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--fg)', fontFamily:'var(--f-body)', marginTop:3 }}>{bracketLabels[autoBr]} {!manualProb && '· applied'}</div>
            </div>
          </div>
        )}
        {ptp && (
          <p style={{ marginTop:12, fontSize:11, color:'var(--fg-muted)', fontFamily:'var(--f-body)', lineHeight:1.6 }}>
            Typical angina = substernal chest pain/tightness + provoked by exertion. Atypical = one of those features. "Relief by rest/nitrates" cannot be assessed from checklist inputs and is assumed present when both other features are checked.
          </p>
        )}
      </div>

      {/* Test Values */}
      <div style={cardStyle}>
        <div style={sectionLabel}>Test Values</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:20 }}>
          {[
            { id:'cad', label:'CAD', val:cadVal, set:setCadVal, st:cadS },
            { id:'ph',  label:'PH',  val:phVal,  set:setPhVal,  st:phS  },
            { id:'pcwp',label:'PCWP',val:pcwpVal,set:setPcwpVal,st:pcwpS },
          ].map(({ id, label, val, set, st }) => (
            <div key={id}>
              <div style={{ fontSize:15, fontWeight:700, color:'var(--fg)', fontFamily:'var(--f-sans)', marginBottom:8 }}>{label}</div>
              <input
                type="number"
                placeholder="blank = N/O"
                value={val}
                onChange={e => set(e.target.value)}
                step="any"
                style={{ ...inputStyle, borderColor: st === 'pos' ? '#ef4444' : st === 'neg' ? 'var(--blue)' : 'var(--rule)', background: st === 'pos' ? '#fef2f2' : st === 'neg' ? 'var(--blue-tint)' : 'var(--bg)' }}
              />
              <div style={{ marginTop:6 }}><Badge status={st} /></div>
            </div>
          ))}
        </div>

        {/* CAD probability selector — shows when CAD has a value */}
        {cadS !== 'no' && (
          <div style={{ borderTop:'1px solid var(--rule)', paddingTop:16, marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:600, color:'var(--fg-muted)', letterSpacing:'0.04em', marginBottom:10, fontFamily:'var(--f-sans)' }}>
              CAD Post-Test Probability
              {!manualProb && ptp && <span style={{ marginLeft:8, color:'var(--blue)', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>Auto-set from PTP</span>}
              {manualProb && <span style={{ marginLeft:8, color:'var(--fg-muted)', fontSize:10 }}>· overriding auto</span>}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {Object.entries(bracketLabels).map(([val, lbl]) => (
                <label key={val} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                  <input
                    type="radio"
                    name="cad-prob"
                    value={val}
                    checked={effectiveBr === val}
                    onChange={() => handleProbChange(val)}
                    style={{ accentColor:'var(--blue)', cursor:'pointer' }}
                  />
                  <span style={{ fontSize:13, color:'var(--fg)', fontFamily:'var(--f-body)' }}>{lbl}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div style={{ borderTop:'1px solid var(--rule)', paddingTop:16, marginBottom:16, fontSize:13, color:'var(--fg-muted)', fontFamily:'var(--f-body)' }}>
          Scope: <strong style={{ color:'var(--fg)', fontFamily:'var(--f-sans)' }}>{scope ? SCOPE_LABELS[scope] : '—'}</strong>
        </div>

        <button
          onClick={lookup}
          disabled={!scope}
          className="btn btn-primary"
          style={{ width:'100%', justifyContent:'center', padding:'13px 24px', fontSize:15, cursor: scope ? 'pointer' : 'not-allowed', opacity: scope ? 1 : 0.45 }}
        >
          Get Recommendation<span className="arrow">→</span>
        </button>
      </div>

      {/* Result */}
      {result && (
        <div id="cds-result" style={{ ...cardStyle, borderColor:'var(--blue)' }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:16 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--blue-tint)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg fill="none" stroke="var(--blue)" strokeWidth="2" viewBox="0 0 24 24" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--blue)', marginBottom:3, fontFamily:'var(--f-sans)' }}>
                {SCOPE_LABELS[result.scope]}
              </div>
              <div style={{ fontSize:13, color:'var(--fg-muted)', fontFamily:'var(--f-body)' }}>{result.combo}</div>
            </div>
          </div>
          {result.msg
            ? <div dangerouslySetInnerHTML={{ __html: formatMessage(result.msg) }} />
            : <p style={{ fontSize:14, color:'var(--fg-muted)', fontStyle:'italic' }}>No matching combination found. Please verify your inputs.</p>
          }
        </div>
      )}

      <p style={{ fontSize:12, color:'var(--fg-muted)', textAlign:'center', lineHeight:1.6, fontFamily:'var(--f-body)', marginTop:8 }}>
        Values &gt; 0 = Positive · Values &lt; 0 = Negative · Blank = Not Ordered<br/>
        For investigational use only — not intended to replace clinical judgment
      </p>

      <style>{`
        .cds-context { background:var(--blue-tint); border-left:3px solid var(--blue); border-radius:0 6px 6px 0; padding:12px 14px; font-size:14px; line-height:1.65; color:var(--fg); margin-bottom:14px; font-family:var(--f-body); }
        .cds-rec-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--fg-muted); margin-bottom:8px; font-family:var(--f-sans); }
        .cds-actions { list-style:none; padding:0; margin:0 0 14px; display:flex; flex-direction:column; gap:8px; }
        .cds-actions li { display:flex; gap:10px; align-items:flex-start; font-size:14px; line-height:1.6; color:var(--fg); font-family:var(--f-body); }
        .cds-actions li::before { content:""; display:block; width:6px; height:6px; border-radius:50%; background:var(--blue); flex-shrink:0; margin-top:7px; }
        .cds-rule { border:none; border-top:1px solid var(--rule); margin:12px 0; }
        .cds-footnotes { font-size:11.5px; color:var(--fg-muted); line-height:1.6; margin-bottom:8px; font-family:var(--f-body); }
        .cds-notes { background:var(--bg); border-radius:6px; padding:10px 12px; font-size:12px; color:var(--fg-muted); line-height:1.6; font-family:var(--f-body); }
        .cds-notes p+p { margin-top:6px; }
      `}</style>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function MedicalAffairsPage() {
  const [confirmed, setConfirmed] = useState(() => {
    try { return localStorage.getItem('corvista_hcp_confirmed_v1') === 'true'; }
    catch { return false; }
  });

  const confirm = () => {
    try { localStorage.setItem('corvista_hcp_confirmed_v1', 'true'); } catch {}
    setConfirmed(true);
  };

  return (
    <div className="page-fade" data-page="medical-affairs">
      {!confirmed && <HcpGate onConfirm={confirm} />}
      {confirmed && (
        <>
          <div className="subhero">
            <div className="container">
              <Eyebrow>Medical Affairs</Eyebrow>
              <h1 style={{ marginTop:28 }}>Resources for <span className="em">clinicians</span>.</h1>
              <p className="lead">
                Clinical decision support, published evidence, and contact information for the CorVista Medical Affairs team — for US healthcare professionals.
              </p>
            </div>
          </div>

          {/* Resource cards */}
          <Section>
            <div className="row row-3" style={{ gap:24, marginBottom:64 }}>
              <a href="#cds-anchor" onClick={e => { e.preventDefault(); document.getElementById('cds-anchor')?.scrollIntoView({ behavior:'smooth' }); }} style={{ display:'block', textDecoration:'none' }} className="hover-lift">
                <div className="card" style={{ padding:28, height:'100%', borderTop:'3px solid var(--blue)' }}>
                  <div style={{ fontSize:32, marginBottom:12 }}>🧠</div>
                  <div style={{ fontFamily:'var(--f-sans)', fontWeight:700, fontSize:16, color:'var(--fg)', marginBottom:8 }}>Three-Test CDS Tool</div>
                  <p style={{ fontSize:14, color:'var(--fg-muted)', lineHeight:1.6, fontFamily:'var(--f-body)', margin:0 }}>
                    Guideline-aligned clinical decision support for CAD, PH, and PCWP test combinations, with ESC 2019 pre-test probability auto-calculation.
                  </p>
                </div>
              </a>
              <NavA to="evidence" style={{ display:'block', textDecoration:'none' }} className="hover-lift">
                <div className="card" style={{ padding:28, height:'100%', borderTop:'3px solid var(--blue)' }}>
                  <div style={{ fontSize:32, marginBottom:12 }}>📄</div>
                  <div style={{ fontFamily:'var(--f-sans)', fontWeight:700, fontSize:16, color:'var(--fg)', marginBottom:8 }}>Clinical Evidence</div>
                  <p style={{ fontSize:14, color:'var(--fg-muted)', lineHeight:1.6, fontFamily:'var(--f-body)', margin:0 }}>
                    Peer-reviewed publications from the IDENTIFY trial, ERJ Open Research, JACC Case Reports, and more — with direct DOI links.
                  </p>
                </div>
              </NavA>
              <NavA to="contact" style={{ display:'block', textDecoration:'none' }} className="hover-lift">
                <div className="card" style={{ padding:28, height:'100%', borderTop:'3px solid var(--blue)' }}>
                  <div style={{ fontSize:32, marginBottom:12 }}>✉️</div>
                  <div style={{ fontFamily:'var(--f-sans)', fontWeight:700, fontSize:16, color:'var(--fg)', marginBottom:8 }}>Contact Medical Affairs</div>
                  <p style={{ fontSize:14, color:'var(--fg-muted)', lineHeight:1.6, fontFamily:'var(--f-body)', margin:0 }}>
                    Questions about the CorVista System, clinical studies, or medical education? Our Medical Affairs team is here to help.
                  </p>
                </div>
              </NavA>
            </div>

            {/* CDS Tool */}
            <div id="cds-anchor">
              <div style={{ borderTop:'1px solid var(--rule)', paddingTop:48, marginBottom:40 }}>
                <Eyebrow>Clinical Decision Support</Eyebrow>
                <h2 style={{ marginTop:16, marginBottom:12 }}>Three-Test Combination Framework</h2>
                <p className="lead" style={{ maxWidth:'56ch', marginBottom:8 }}>
                  Enter available CorVista test values to generate a guideline-aligned clinical interpretation. Patient demographics and symptoms are used to calculate CAD pre-test probability per the 2019 ESC Chronic Coronary Syndromes Guidelines.
                </p>
                <p style={{ fontSize:13, color:'var(--fg-muted)', fontFamily:'var(--f-body)', marginBottom:32 }}>
                  For investigational use only · Intended for US HCPs · Values &gt; 0 = Positive · Values &lt; 0 = Negative
                </p>
              </div>
              <CdsTool />
            </div>
          </Section>

          <Section dark>
            <div className="row row-2" style={{ gridTemplateColumns:'1.3fr 1fr', gap:64, alignItems:'center' }}>
              <div>
                <Eyebrow><span style={{ color:'#98A2B3' }}>Medical Affairs</span></Eyebrow>
                <h2 style={{ color:'#F4F6F9', marginTop:20, fontSize:'clamp(28px, 3.5vw, 48px)' }}>
                  Questions about CorVista in your practice?
                </h2>
                <p className="lead" style={{ color:'#C8D0DC', marginTop:18, maxWidth:'46ch' }}>
                  Our Medical Affairs team supports clinicians with evidence summaries, training resources, and real-world implementation guidance.
                </p>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <NavA to="contact" className="btn btn-primary" style={{ justifyContent:'center', padding:'14px 24px', fontSize:15 }}>
                  Contact Medical Affairs<span className="arrow">→</span>
                </NavA>
                <NavA to="evidence" className="btn btn-ghost" style={{ justifyContent:'center', padding:'14px 24px', fontSize:15, borderColor:'rgba(255,255,255,0.2)', color:'#F4F6F9' }}>
                  Browse clinical evidence
                </NavA>
              </div>
            </div>
          </Section>
        </>
      )}
    </div>
  );
}
