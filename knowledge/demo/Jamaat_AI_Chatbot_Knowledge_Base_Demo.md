# **JAMAAT AI CHATBOT KNOWLEDGE BASE** 

### Services + Business Directory + Demo Dataset 

_Prepared as a provisional/testing knowledge base — October 2026_ 

## **Critical status notice** 

This document is designed for chatbot development and testing. It is NOT an official statement of Jamaat policy. Where exact Jamaat eligibility, funding limits, deadlines, or document lists are not publicly confirmed, the text is deliberately marked DEMO / PROVISIONAL. Replace those fields with administrator-approved rules before production. 

#### **What is grounded in public information** 

- The public KSI Jamaat Mumbai website lists Educational Assistance as a continuing project supporting needy community students in their academic pursuits. 

- The public website lists Medical and Hospitalization as a continuing project for needy/underprivileged people needing help with monthly medical bills, investigations and hospitalization. 

- The public Projects section also lists Hajatmand, described as helping widows and divorcees. 

- The public website provides a central Mumbai contact address and phone numbers. These should be treated as officialcontact data, not as sample business-directory data. 

#### **What is intentionally provisional** 

- Exact income thresholds, minimum marks, percentage of assistance, age limits, membership-duration rules, deadlines, approval committees, reimbursement caps and document checklists. 

- Services that may exist in the planned website but are not established here as official KSI policy, such as generic loans, document facilitation, emergency cash assistance and facility booking rules. 

- All business-directory records in this document are fictional DEMO records created only for chatbot/database testing. 

Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

## **1. Chatbot Operating Rules** 

The chatbot should answer from structured records rather than from free-form model memory. Every service and business record should have a status field and last-reviewed timestamp. 

|**Rule**|**Implementation**|
|---|---|
|Source of truth|Admin-approved database/knowledge base. Public web research<br>is reference material,not an authorization to inventpolicy.<br>i  f  f|
|Unknown policy|Say that the exact rule is not confirmed and offer the official<br>contact/enquiryroute.|
|Eligibility|Use the stored eligibility criteria; do not infer approval from a user's<br>description.<br>f|
|Documents|Return the document list plus a note that the office may request<br>additional documents.|
|Business search|Filter by category + location + service keywords; rank exact locality<br>before broader citymatches.|
|Location|If the user says Navi Mumbai, do not silently return a Mumbai-only<br>result unless explicitlyallowed as a nearbyalternative.<br>i i|
|Contact data|Business phone numbers are public-directory fields. Beneficiary<br>identitydata must never be exposed through business search.|
|Sensitive identifiers|Do not ask users to paste Aadhaar numbers into ordinary chat. Use<br>a secure form or verified internal workflow where required.|
|Escalation|Medical emergencies, legal disputes, urgent welfare cases and<br>unclear eligibilityshould be routed to a human/admin.|
|Language|Support English, Hindi/Hinglish and optionally Gujarati/Urdu as a<br>later layer;keepthe underlyingrecords language-neutral.|



## **2. Suggested Knowledge-Base Record Structure** 

Recommended JSON-like structure for each service: 

{ "id": "SERVICE_EDU_001", "name": "Educational Assistance", "category": "Education", "status": "provisional", "officially_verified": false, "description": "...", "eligibility": [], "documents": [], "process": [], "faq": [], "contact_route": "Jamaat Services Desk", "last_reviewed": "YYYY-MM-DD", "source_notes": [] } 

Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

## **3. Service Catalogue** 

#### **3.1 Educational / Scholarship Assistance** 

**PUBLICLY GROUNDED SERVICE AREA + PROVISIONAL ELIGIBILITY** — Financial support for students who need help continuing school, college, professional or vocational education. The public Jamaat site confirms educational assistance for needy community students. 

##### **Eligibility — provisional chatbot rule** 

- Applicant is a member of, or otherwise eligible under, the relevant Jamaat/community assistance policy. 

- Student is currently enrolled in a recognized school, college, university or vocational/professional course. 

- Demonstrable financial need is present; household income and family circumstances may be considered. 

- Academic progress is satisfactory, subject to the actual Jamaat policy. 

- The requested expense is education-related: tuition, examination fees, books, hostel/transport or another approved educational expense. 

- DEMO RULE: If exact income/marks thresholds are unknown, the chatbot must not invent a cutoff. It should say that the case is assessed under Jamaat guidelines. 

##### **Documents — typical/requested documents** 

- Student Aadhaar/ID proof — only through a secure application process if actually required. 

- Parent/guardian identity proof. 

- Current academic admission/bonafide certificate. 

- Latest marksheet/result. 

- Current fee structure or fee-demand letter. 

- Bank account details/cancelled cheque if assistance is transferred directly. 

- Income certificate or other household-income evidence, where required. 

- Previous scholarship/assistance details, if any. 

- Passport-size photograph, if the application form requires it. 

##### **Suggested process** 

1. Collect course, institution, year/semester and fee information. 

2. Collect financial-need information and supporting documents. 

3. Validate completeness of the application. 

4. Forward the case for human/admin review. 

5. Record approval/rejection/request-for-more-information. 

6. Disburse or reimburse according to the approved method. 

##### **Cautions / escalation** 

- 

- 

   - Do not promise a fixed percentage such as 50% unless that percentage is approved and stored in the database. 

   - Do not tell a student they are definitely eligible based only on marks or income. 

- If a user asks about a government scholarship, distinguish it from Jamaat assistance and direct them to the relevant official scheme. 

- The National Scholarship Portal states that scholarship eligibility is scheme-specific and requires OTR for current applications; do not conflate NSP rules with Jamaat rules. 

##### **FAQ examples** 

###### **Q: Do I need good marks?** 

A: Academic progress may be considered, but the exact minimum marks for Jamaat assistance are not confirmed in this demo knowledge base. 

###### **Q: What documents should I keep ready?** 

Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

A: Keep your latest marksheet, admission/bonafide proof, current fee details, identity documents and income/financial-need evidence ready. The office may request additional documents. 

###### **Q: Can diploma/professional students apply?** 

A: Potentially, if the Jamaat's approved educational-assistance policy covers the course. The exact course list should be confirmed by the Services Desk. 

##### **Example chatbot response** 

**_If you are asking about Jamaat educational assistance, it is intended to support needy community students. For a provisional application, keep your latest marksheet, admission/bonafide proof, fee details, identity proof and income/financial-need documents ready. I cannot confirm the exact income or marks cutoff because the official cutoff is not included in the current knowledge base._** 

#### **3.2 Medical & Hospitalization Assistance** 

**PUBLICLY GROUNDED SERVICE AREA + PROVISIONAL ELIGIBILITY** — Assistance for needy community members facing medical, investigation, hospitalization or recurring treatment expenses. The public Jamaat page specifically describes help with monthly medical bills, investigations and hospitalization. 

##### **Eligibility — provisional chatbot rule** 

- Patient/community member falls within the Jamaat's approved service area. 

- 

- 

- 

   - There is a genuine medical need supported by doctor/hospital documentation. 

   - Financial hardship or inability to meet the expense independently is demonstrated. 

   - Treatment/expense is within the categories approved by the Jamaat. 

- DEMO RULE: Priority may be given to urgent/high-cost/low-income cases, but no such ranking should be treated as official until approved. 

##### **Documents — typical/requested documents** 

- Patient identity proof. 

- Doctor's prescription/medical report/diagnosis. 

- 

   - Hospital estimate or treatment-cost estimate. 

- Investigation/test reports where relevant. 

- 

- 

- 

   - Bills/receipts for expenses already incurred, if reimbursement is allowed by the actual policy. 

   - Household income/financial hardship evidence. 

   - Bank details if approved assistance is paid by transfer. 

- Insurance/TPA details if applicable. 

##### **Suggested process** 

7. Collect the medical condition and treatment details. 

8. Collect hospital/doctor documentation and estimated cost. 

9. Collect financial-need information. 

10. Escalate urgent cases to the human medical-assistance team. 

11. Human reviewers verify the case and approve assistance amount/method. 

12. Record the decision and supporting documents securely. 

##### **Cautions / escalation** 

- 

- 

- 

- 

- The chatbot must never diagnose a patient or recommend treatment. 

- For emergencies, instruct the user to contact emergency medical services/hospital immediately. 

- Do not promise reimbursement of already-paid expenses; this depends on the actual Jamaat policy. 

- Do not expose medical documents or beneficiary information in public/admin business search. 

Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

##### **FAQ examples** 

###### **Q: Can I get help for hospitalization?** 

A: Medical and hospitalization assistance is a documented Jamaat welfare area. Eligibility and assistance amount depend on the case and approved policy. 

###### **Q: What should I upload?** 

A: A medical report/prescription, hospital estimate or bills, identity proof and financial-need evidence are typical starting documents. Additional documents may be requested. 

###### **Q: Will Jamaat pay the full bill?** 

A: Do not assume that. The chatbot should state that the approved amount depends on the case and the Jamaat's current assistance policy. 

##### **Example chatbot response** 

**_Jamaat medical and hospitalization assistance is intended for needy cases involving medical bills, investigations or hospitalization. Keep the patient's medical report/prescription, hospital estimate or bills, identity proof and financial-need documents ready. The chatbot cannot confirm an approval amount without human review._** 

#### **3.3 Financial / Emergency Assistance** 

**DEMO SERVICE — REPLACE WITH ADMIN-APPROVED POLICY** — Temporary financial help for a household facing a documented urgent need such as essential living expenses, emergency travel, education-related hardship or another approved welfare need. 

##### **Eligibility — provisional chatbot rule** 

- Applicant is within the community/Jamaat service area. 

- 

- 

   - Need is genuine, specific and documented. 

   - Applicant demonstrates financial hardship. 

- Assistance is not being requested for an excluded or non-essential purpose. 

- 

- Any repeat-assistance or outstanding-assistance rules are checked by the admin. 

##### **Documents — typical/requested documents** 

- Identity proof. 

- Address/residence proof. 

- 

   - Income/financial-status evidence. 

- Documents proving the emergency or expense. 

- Bank details where required. 

- Previous assistance details, if applicable. 

##### **Suggested process** 

13. Describe the need and amount required. 

14. Upload supporting evidence. 

15. Human welfare team reviews urgency and need. 

16. Admin records decision and assistance type. 

17. Follow-up is recorded where applicable. 

##### **Cautions / escalation** 

- Do not call this a 'loan' unless the actual Jamaat provides a loan product. 

- Do not invent repayment terms, interest, guarantor requirements or maximum amounts. 

Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

- For a crisis involving immediate danger, direct the user to emergency services first. 

##### **FAQ examples** 

###### **Q: Can Jamaat give me a loan?** 

A: The current demo knowledge base does not confirm a Jamaat loan product. I can help you check financial-assistance options, but the exact facility must be confirmed by the Services Desk. 

###### **Q: I lost my job. Can I request help?** 

A: You may be able to submit a welfare/financial-assistance enquiry if the Jamaat's policy covers employment hardship. Keep identity, income/status and supporting household-expense documents ready. 

##### **Example chatbot response** 

**_I can help you identify the relevant welfare-assistance category, but I cannot confirm a loan or fixed cash benefit unless that facility is explicitly enabled in the Jamaat's approved service records._** 

#### **3.4 Hajatmand / Support for Widows & Divorcees** 

**PUBLICLY GROUNDED SERVICE AREA + PROVISIONAL WORKFLOW** — Welfare support for eligible community members facing financial or social hardship. The public KSI Jamaat Projects page lists Hajatmand as helping widows and divorcees. 

##### **Eligibility — provisional chatbot rule** 

- Applicant fits the actual Jamaat definition of the service beneficiary. 

- Financial/social need is demonstrated. 

- Household circumstances are verified where required. 

- The request falls within the assistance categories approved by the relevant committee. 

##### **Documents — typical/requested documents** 

- Identity proof. 

- Residence/address proof. 

- Relevant marital-status document where applicable. 

- Income/financial-status evidence. 

- Children/dependent details where relevant. 

- Bank details if assistance is transferred. 

- Other documents requested during case verification. 

##### **Suggested process** 

18. Submit a confidential welfare enquiry. 

19. Provide identity and household information through a secure form. 

20. Human team verifies the case. 

21. Committee/admin determines assistance. 

22. Record assistance securely and restrict access. 

##### **Cautions / escalation** 

- This is sensitive welfare information; it should not appear in public profiles. 

- The chatbot should not ask invasive questions unless necessary for eligibility. 

- Do not expose one beneficiary's case to another user. 

##### **FAQ examples** 

###### **Q: Does Jamaat help widows?** 

Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

A: The public KSI Jamaat project list includes Hajatmand, described as helping widows and divorcees. The exact current eligibility and benefit amount should be confirmed by the Jamaat. 

###### **Q: Can I apply for someone else?** 

A: You can make an enquiry on behalf of a family member, but the Jamaat may require the beneficiary's information and consent during verification. 

##### **Example chatbot response** 

**_The public Jamaat project list includes Hajatmand, which is described as helping widows and divorcees. If you want to enquire about this support, I can tell you the typical documents to prepare, but the final eligibility decision must come from the Jamaat._** 

#### **3.5 Education Support / Books / Fees** 

**DEMO SUBCATEGORY — CONFIGURE UNDER EDUCATIONAL ASSISTANCE** — A narrower chatbot category for users asking specifically about books, examination fees, tuition shortfalls, hostel costs or educational materials. 

##### **Eligibility — provisional chatbot rule** 

- Student is enrolled in an eligible institution/course. 

- Expense is education-related and documented. 

- Need is demonstrated. 

- Any existing assistance is disclosed. 

##### **Documents — typical/requested documents** 

- Bonafide/admission proof. 

- Latest marksheet. 

- Fee demand/receipt. 

- Book list or expense quotation where applicable. 

- Income/financial-need evidence. 

- Identity and bank details if required. 

##### **Suggested process** 

23. Identify expense type. 

24. Check whether it falls under the educational-assistance policy. 

25. Collect evidence. 

26. Route to human review. 

##### **Cautions / escalation** 

- Do not create a separate scheme in the database if it is actually a subcategory of educational assistance. 

- Avoid duplicate applications for the same expense. 

##### **FAQ examples** 

###### **Q: Can I get help buying books?** 

A: This can be treated as an education-support enquiry if the Jamaat's approved educational-assistance policy covers books. The exact coverage must be confirmed. 

###### **Q: Can I ask for exam fees?** 

A: You can submit an education-assistance enquiry. Keep the exam-fee demand/receipt and current academic documents ready. 

Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

**Example chatbot response** 

**_If your need is specifically for books, tuition, examination fees or another academic expense, select Educational Assistance and describe the exact expense. The admin team can confirm whether it is covered._** 

#### **3.6 Document / Certificate Assistance** 

**DEMO SERVICE — REPLACE WITH ACTUAL JAMAAT DOCUMENT POLICY** — A chatbot information service for questions about community certificates, forms, marriage/death/birth-related documentation or office procedures. 

##### **Eligibility — provisional chatbot rule** 

- User has a genuine document-related requirement. 

- The requested document is actually issued or facilitated by the Jamaat. 

- Identity and supporting records can be verified. 

- Some processes may require an in-person office visit. 

##### **Documents — typical/requested documents** 

- Government ID. 

- Existing relevant certificate/document. 

- Photographs where required. 

- Application/form. 

- Supporting family/member records where applicable. 

##### **Suggested process** 

27. Identify document type. 

28. Tell user the provisional document checklist. 

29. Tell user whether online submission is supported. 

30. If office verification is required, provide office/contact details. 

##### **Cautions / escalation** 

- Never claim a document can be issued online unless the system supports it. 

- Do not fabricate processing times or fees. 

- For legal certificates, distinguish Jamaat-issued records from government-issued certificates. 

##### **FAQ examples** 

###### **Q: Can I get a birth certificate from Jamaat?** 

A: The chatbot should first determine whether you mean a government birth certificate or a Jamaat/community record. Government certificates must be obtained through the relevant government authority unless the Jamaat is formally authorized to facilitate them. 

###### **Q: Do I have to visit the office?** 

A: Some document processes may require in-person verification. The exact requirement should come from the current document record. 

##### **Example chatbot response** 

**_Tell me which document you need and I can show the current checklist stored by the Jamaat. If the knowledge base does not contain the exact procedure, I will direct you to the office instead of guessing._** 

Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

#### **3.7 Facility / Hall Booking** 

**DEMO SERVICE — WEBSITE PLANNED FEATURE** — Information and booking enquiry for community halls or other facilities. 

##### **Eligibility — provisional chatbot rule** 

- User selects an available facility. 

- 

- 

- 

- Requested date/time is available. 

- User satisfies booking rules and provides required identification/contact information. 

- Any deposit or fee requirements are met. 

##### **Documents — typical/requested documents** 

- Applicant name and contact. 

- 

   - Date/time and event type. 

- ID proof if required. 

- 

   - Booking/deposit receipt where applicable. 

- Additional event documents if required. 

##### **Suggested process** 

31. Check facility availability. 

32. Collect event details. 

33. Show applicable fee/deposit from the live database. 

34. Confirm booking only after the booking system confirms it. 

##### **Cautions / escalation** 

- Never tell the user a hall is available based on static knowledge-base text. 

- Availability must come from the live booking database. 

- Do not invent prices. 

##### **FAQ examples** 

###### **Q: Is the hall available on Saturday?** 

A: I need to check the live facility calendar for the exact date and time. The knowledge base alone cannot confirm availability. 

###### **Q: How much is the hall?** 

A: The price depends on the facility, date, duration and current tariff. I can show the live tariff if it is available in the booking system. 

##### **Example chatbot response** 

**_For facility booking, I can explain the rules and documents, but availability and price must be checked against the live facility database._** 

#### **3.8 General Service / Welfare Enquiry** 

**DEMO FALLBACK SERVICE** — A catch-all route when a user describes a hardship but does not know which service applies. 

##### **Eligibility — provisional chatbot rule** 

- User explains the problem in natural language. 

- Chatbot maps the issue to one or more service categories. 

- 

- If confidence is low, ask one clarifying question or route to the enquiry form. 

##### **Documents — typical/requested documents** 

- 

- 

- Only request documents after identifying the service. 

- Never collect unnecessary sensitive information in chat. 

Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

##### **Suggested process** 

35. Classify the request. 

36. Suggest the most relevant service. 

37. Give provisional documents. 

38. Offer human enquiry if uncertain. 

##### **Cautions / escalation** 

- 

   - This should be a routing mechanism, not a new benefit. 

- Never say 'you qualify' based on a language-model judgment. 

##### **FAQ examples** 

###### **Q: My family is struggling and I don't know which scheme to apply for.** 

A: I can help identify the likely category. Tell me whether the main need is education, medical expenses, household financial hardship, document assistance or another issue. 

###### **Q: I need help urgently.** 

A: Please describe whether the urgency is medical, financial, educational or another type of need. If there is an immediate medical or safety emergency, contact emergency services first. 

##### **Example chatbot response** 

**_I can help identify the right Jamaat service. Please tell me the main issue—education, medical expense, financial hardship, documentation, facility booking, or something else._** 

Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

## **4. Business Directory — Demo Dataset** 

All businesses below are FICTIONAL DEMO RECORDS. They are deliberately named with community-relevant names for testing, but they do not represent real businesses, endorsements or real phone numbers. 

|**ID**|**Business**|**Category**|**Type**|**City**|**Locality**|**Demo**<br>**Mobile**|**Services**|**Hours**|**Language**<br>**s**|
|---|---|---|---|---|---|---|---|---|---|
|BUS-001|Abbas<br>Plumbing<br>& Sanitary<br>Works|Home<br>Services|Plumber|Navi<br>Mumbai|Vashi|90000000<br>01|Plumbing<br>repair,<br>leakage,<br>bathroom<br>fittings|Mon-Sat<br>9am-8pm|Hindi,<br>English,<br>Gujarati|
|BUS-002|Ali Electric<br>Solutions|Home<br>Services|Electrician|Navi<br>Mumbai|Nerul|90000000<br>02|Wiring,<br>switches,<br>fans,<br>lighting,<br>emergenc<br>y electrical<br>repair|Mon-Sun<br>8am-9pm|Hindi,<br>English|
|BUS-003|Haider AC<br>&<br>Refrigerati<br>on|Home<br>Services|AC Repair|Thane|Majiwada|90000000<br>03|AC<br>servicing,<br>gas check,<br>installatio<br>n,<br>refrigerato<br>r repair|Mon-Sat<br>9am-7pm|Hindi,<br>English|
|BUS-004|Zahra<br>Ladies<br>Tailoring<br>Studio|Apparel|Tailor|Mumbai|Dongri|90000000<br>04|Ladies<br>tailoring,<br>alterations<br>, abaya<br>and<br>modest-<br>wear<br>stitching|Mon-Sat<br>10am-8p<br>m|Hindi,<br>Gujarati,<br>English|
|BUS-005|Sakina<br>Home<br>Bakers|Food|Home<br>Bakery|Mumbai|Byculla|90000000<br>05|Cakes,<br>cupcakes,<br>tea<br>snacks,<br>custom<br>orders|Pre-order|English,<br>Hindi|
|BUS-006|Hussain<br>Computer<br>Care|Technolog<br>y|Computer<br>Repair|Mumbai|Kurla|90000000<br>06|Laptop<br>repair,<br>Windows<br>installatio<br>n,<br>SSD/RAM<br>upgrade|Mon-Sat<br>10am-8p<br>m|Hindi,<br>English|
|BUS-007|Fatema<br>Learning<br>Point|Education|Tutor|Mumbai|Mazgaon|90000000<br>07|School<br>tutoring,<br>mathemati<br>cs,<br>science,<br>homework<br>support|Mon-Fri<br>4pm-8pm|English,<br>Hindi|
|BUS-008|Mehdi<br>Career<br>Guidance<br>Centre|Education|Career<br>Counsellin<br>g|Mumbai|Andheri<br>East|90000000<br>08|College<br>admission<br>s, career<br>counsellin<br>g, aptitude<br>guidance|By<br>appointme<br>nt|English,<br>Hindi|
|BUS-009|Imran<br>Mobile<br>Care|Technolog<br>y|Mobile<br>Repair|Navi<br>Mumbai|Sanpada|90000000<br>09|Android/<br>iPhone<br>repair,<br>screen<br>and|Mon-Sat<br>10am-8p<br>m|Hindi,<br>English|



Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

||||||||battery<br>replaceme<br>nt|||
|---|---|---|---|---|---|---|---|---|---|
|BUS-010|Hasan<br>Auto<br>Service|Automotiv<br>e|Car & Bike<br>Repair|Thane|Kopri|90000000<br>10|Periodic<br>service,<br>brakes,<br>battery,<br>diagnostic<br>s|Mon-Sat<br>9am-8pm|Hindi,<br>English|
|BUS-011|Murtaza<br>Tax &<br>Accounts|Profession<br>al|CA/Tax<br>Consultan<br>t|Mumbai|Masjid<br>Bunder|90000000<br>11|ITR, GST,<br>accountin<br>g and<br>small-<br>business<br>complianc<br>e|By<br>appointme<br>nt|English,<br>Hindi,<br>Gujarati|
|BUS-012|Sajjad<br>Legal<br>Consultan<br>cy|Profession<br>al|Legal<br>Consultan<br>t|Mumbai|Fort|90000000<br>12|Civil<br>document<br>ation,<br>property<br>and<br>general<br>legal<br>consultati<br>on|By<br>appointme<br>nt|English,<br>Hindi,<br>Gujarati|
|BUS-013|Abid<br>Photograp<br>hy Studio|Creative|Photograp<br>her|Mumbai|Nagpada|90000000<br>13|Wedding,<br>Nikah,<br>family and<br>event<br>photograp<br>hy|By<br>appointme<br>nt|English,<br>Hindi|
|BUS-014|Noor<br>Event<br>Decor|Events|Event<br>Decorator|Mumbai|Mira Road|90000000<br>14|Nikah<br>decor,<br>communit<br>y events,<br>stage and<br>floral<br>setup|By<br>appointme<br>nt|Hindi,<br>English|
|BUS-015|Qasim<br>Caterers|Food|Caterer|Thane|Bhiwandi|90000000<br>15|Communit<br>y<br>functions,<br>Nikah<br>catering,<br>bulk meal<br>orders|Advance<br>booking|Hindi,<br>Gujarati|
|BUS-016|Raza<br>Travel<br>Desk|Travel|Travel<br>Agent|Mumbai|Dongri|90000000<br>16|Domestic/<br>internation<br>al tickets,<br>group<br>travel<br>assistance|Mon-Sat<br>10am-7p<br>m|Hindi,<br>Gujarati,<br>English|
|BUS-017|Fatemah<br>Mehndi &<br>Beauty|Personal<br>Care|Beauty<br>Services|Navi<br>Mumbai|Kharghar|90000000<br>17|Bridal<br>mehndi,<br>event<br>mehndi<br>and ladies<br>beauty<br>services|By<br>appointme<br>nt|Hindi,<br>English|
|BUS-018|Aliya<br>Home<br>Nursing<br>Support|Healthcar<br>e|Home<br>Care|Mumbai|Byculla|90000000<br>18|Non-<br>emergenc<br>y home<br>attendant<br>and elder-<br>care<br>coordinati<br>on|By<br>appointme<br>nt|Hindi,<br>English|



Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

|BUS-019|Mustafa<br>Hardware<br>Mart|Home<br>Services|Hardware<br>Store|Mumbai|Mandvi|90000000<br>19|Plumbing<br>fittings,<br>electrical<br>items,<br>tools and<br>hardware|Mon-Sat<br>9am-8pm|Hindi,<br>Gujarati|
|---|---|---|---|---|---|---|---|---|---|
|BUS-020|Sajida<br>Printing &<br>Forms|Business<br>Services|Printing|Mumbai|Nagpada|90000000<br>20|Printing,<br>scanning,<br>photocopy<br>, forms<br>and<br>binding|Mon-Sat<br>9am-9pm|Hindi,<br>English|
|BUS-021|Abbas<br>Digital<br>Solutions|Technolog<br>y|Web<br>Services|Navi<br>Mumbai|CBD<br>Belapur|90000000<br>21|Website<br>setup,<br>domain,<br>basic<br>digital<br>services<br>for small<br>businesse<br>s|By<br>appointme<br>nt|English,<br>Hindi|
|BUS-022|Mohsin<br>Furniture<br>Works|Home<br>Services|Carpenter|Mumbai|Kurla|90000000<br>22|Furniture<br>repair,<br>modular<br>work and<br>custom<br>woodwork|Mon-Sat<br>9am-7pm|Hindi,<br>English|
|BUS-023|Hadiya<br>Tuition<br>Academy|Education|Coaching|Mira-<br>Bhayandar|Mira Road|90000000<br>23|School<br>coaching,<br>board<br>exam<br>preparatio<br>n and<br>study<br>support|Mon-Sat<br>3pm-9pm|English,<br>Hindi|
|BUS-024|Karim<br>Medical<br>Supplies|Healthcar<br>e|Medical<br>Equipment|Thane|Wagle<br>Estate|90000000<br>24|Wheelchai<br>rs,<br>walkers,<br>basic<br>home-care<br>equipment|Mon-Sat<br>10am-7p<br>m|Hindi,<br>English|
|BUS-025|Zainab<br>Bridal &<br>Events|Events|Bridal<br>Services|Navi<br>Mumbai|Airoli|90000000<br>25|Bridal<br>styling,<br>Nikah<br>preparatio<br>n and<br>event<br>coordinati<br>on|By<br>appointme<br>nt|Hindi,<br>English|



## **5. Business Search Fields** 

|**Field**|**Example**|**Purpose**<br>i|
|---|---|---|
|business_id|BUS-001|Stable internal identifier|
|business_name|Abbas Plumbing& SanitaryWorks|Displayname<br>i|
|category|Home Services|Broad filter<br>i i|
|service_type|Plumber|Specific filter|
|city|Navi Mumbai|Location matching|
|locality|Vashi|Moreprecise matching<br>i|
|address|DEMO — admin to enter|Full location once verified|
|phone|9000000001<br>i|Contact|
|services|Leakage;fittings;repair|Keyword search|
|languages|Hindi;English;Gujarati|Useful for userpreference|



Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

|hours|Mon-Sat 9am-8pm|Availabilityinformation<br>i|
|---|---|---|
|verified<br>i|false|Prevents demo/unverified records being<br>presented as verified|
|last_verified|YYYY-MM-DD|Freshness control|



## **6. Location Search Logic** 

39. Normalize the user's location phrase: e.g., 'Navi Mumbai', 'Vashi', 'near Vashi', 'in Nerul'. 

40. Match exact locality first. 

41. Then match the city. 

42. Only show nearby alternatives if the user asks for alternatives or no exact match exists. 

43. Sort by relevance: exact locality → same city → nearby area → broader region. 

44. Never invent travel distance unless a map/geocoding service is connected. 

45. If multiple businesses match, return 3–5 useful options rather than the entire directory. 

46. Use the business category and service keywords together. Example: 'plumber in Navi Mumbai' should match service_type=Plumber AND city=Navi Mumbai. 

47. Do not treat a business as verified simply because its record exists; use the verified flag. 

## **7. Sample Business Chatbot Answers** 

**User:** I need a plumber in Navi Mumbai. 

**Chatbot:** I found demo directory matches in Navi Mumbai. Abbas Plumbing & Sanitary Works — Vashi — 9000000001 — plumbing repair, leakage and bathroom fittings. Ali Electric Solutions is an electrician in Nerul, so it would not be a plumber match. 

**User:** Do you have an electrician in Nerul? 

**Chatbot:** Yes. Demo directory match: Ali Electric Solutions, Nerul, Navi Mumbai — 9000000002. Services include wiring, switches, fans, lighting and emergency electrical repair. 

**User:** I need AC repair in Thane. 

**Chatbot:** Demo match: Haider AC & Refrigeration, Majiwada, Thane — 9000000003. Services include AC servicing, gas checks, installation and refrigerator repair. 

**User:** Is there a tutor near Mazgaon? 

**Chatbot:** Demo match: Fatema Learning Point, Mazgaon, Mumbai — 9000000007. It provides school tutoring, mathematics, science and homework support. 

**User:** Give me a computer repair shop in Mumbai. 

**Chatbot:** Demo match: Hussain Computer Care, Kurla, Mumbai — 9000000006. It handles laptop repair, Windows installation and SSD/RAM upgrades. 

**User:** I need a caterer for a Nikah. 

**Chatbot:** Demo directory match: Qasim Caterers, Bhiwandi, Thane — 9000000015. It lists community functions, Nikah catering and bulk meal orders. This is a demo record and should be verified before production use. 

Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

## **8. Sample End-to-End Service Questions** 

|**Userquestion**|**Recommended chatbot answer**|
|---|---|
|What scholarship does Jamaat provide?|The public Jamaat information confirms Educational Assistance for<br>needy community students. The exact current eligibility, amount<br>and application deadline should come from the Jamaat's approved<br>service record.<br>i|
|What documents are required for scholarship?|Typical documents are current admission/bonafide proof, latest<br>marksheet, fee details, identity proof and financial-need/income<br>evidence. The Jamaat mayrequest additional documents.|
|My college fee is very high. Can Jamaat help?|You can make an Educational Assistance enquiry. Share the<br>course, institution, current fee requirement and your financial<br>situation. Final approval depends on the Jamaat's policy and case<br>review.|
|I need medical help for hospitalization.|Medical and Hospitalization is a documented Jamaat welfare area.<br>Keep the medical report/prescription, hospital estimate or bills,<br>identity proof and financial-need documents ready. Final<br>assistance requires human review.<br>i|
|Will Jamaat pay my entire medical bill?|I cannot confirm that. The approved amount depends on the<br>current Jamaatpolicyand the individual case.|
|Does Jamaat help widows and divorcees?|The public KSI Jamaat project list includes Hajatmand, described<br>as helping widows and divorcees. The current eligibility and benefit<br>details should be confirmed bythe Jamaat.<br>i|
|Can Jamaat give me a loan?|The current demo knowledge base does not confirm a Jamaat loan<br>product. I can help identify financial-assistance options, but I<br>should notpromise a loan or invent repayment terms.<br>i|
|Can I apply online?|That depends on the specific service. The chatbot can provide the<br>current application/enquiry route stored by the admin. Some<br>document or verificationprocesses mayrequire an office visit.|
|What if I don't know which scheme I qualify for?|Tell me your situation in simple words—for example, education<br>fees, medical expenses, household financial hardship or<br>document work. I can identify the most relevant service category,<br>but final eligibilityis decided bythe Jamaat.|



## **9. Chatbot Guardrails** 

- Never say 'You are eligible' unless an explicit eligibility engine has verified the required fields. 

- Prefer 'You may be eligible to apply' when the user appears to fit a provisional rule. 

- When a required field is missing, ask only for the minimum necessary information. 

- Do not ask for Aadhaar numbers in ordinary conversational text. Route sensitive identity collection to a secure form. 

- Do not expose a beneficiary's financial, medical, marital or assistance history. 

- Do not expose one organization's assistance transactions to another organization or to the public. 

- If the system eventually includes a central assistance registry, the chatbot should only return whether the user is eligible/needs review according to the authorized workflow—not raw transaction records. 

- Do not give medical diagnosis, legal advice, or financial advice as if the Jamaat officially endorsed it. 

- If the knowledge base does not contain the answer, say so and provide the official contact/enquiry route. 

- Every admin-edited service should have last_updated and approved_by fields. 

## **10. Recommended Admin Data Model** 

|**Table**|**Core fields**|
|---|---|
|services|id, name, category, status, description, eligibility_rules,<br>documents, process, exclusions, faqs, contact_route, approved,<br>last_updated|
|businesses|id, name, category, service_type, city, locality, address, phone,<br>email,website,services,hours,languages,verified,last_verified|
|service_faqs|id,service_id, question,answer,keywords,approved|
|business_categories|id,name,synonyms|



Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

|locations|id,city,locality,aliases,latitude,longitude|
|---|---|
|enquiries|id, user_reference, service_id, question, status, assigned_to,<br>created_at<br>i|
|knowledge_sources|id,source_name,source_type,url/reference,verified,reviewed_at|
|audit_log|id,record_type,record_id,action,admin_id,timestamp|



## **11. Recommended Retrieval / RAG Strategy** 

48. Store services and businesses as structured records in the database. 

49. Create embeddings for descriptive text and FAQs only as a secondary semantic-search layer. 

50. For business requests, use structured filters first: category/service + location. 

51. For service questions, retrieve the relevant service record and its FAQs. 

52. Pass only retrieved approved records to the language model. 

53. Require the model to distinguish verified facts from provisional/demo information. 

54. For high-risk actions such as application submission, booking, financial approval or sensitive identity collection, use deterministic application/booking workflows rather than free-form model output. 

55. Log the source record IDs used to answer each query so admins can audit chatbot responses. 

## **12. Recommended Response Templates** 

|**Use case**|**Template**|
|---|---|
|Eligibility|Based on the current Jamaat knowledge base, you may be able to<br>apply for [SERVICE]. The final eligibility depends on<br>[RULE/REVIEW]. I can showyou the documents normallyrequired.<br>i|
|Unknown|I cannot confirm that from the current Jamaat knowledge base. I do<br>not want to give you an incorrect eligibility rule. Please use the<br>official enquiry/contact route for confirmation.<br>f|
|Documents|For [SERVICE], keep these documents ready: [LIST]. The office may<br>request additional documents duringverification.|
|Business|[BUSINESS NAME] — [LOCALITY], [CITY] — [PHONE]. Services:<br>[SERVICES]. Verification status:[VERIFIED/DEMO].|
||If this is an immediate medical or safety emergency, contact<br>i|
|Emergency|emergency services or the nearest hospital first. For Jamaat<br>assistance,I can explain the normal enquiry process.|



Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

## **13. Research Basis and Source Notes** 

The following sources were used to ground the verified portions of this document: 

|**Source**|**URL**|**Why used**|
|---|---|---|
|KSI Jamaat Mumbai — Medical and<br>Hospitalization|https://ksijamat.org/services/medical-and-<br>hospitalization/|Confirms medical/hospitalization welfare<br>assistance and describes support for<br>medical bills, investigations and<br>hospitalization.<br>i  i|
|KSI Jamaat Mumbai — Educational<br>Assistance|https://ksijamat.org/services/educational-<br>assistance/|Confirms recurring financial support for<br>needycommunitystudents.|
|KSI Jamaat Mumbai — Projects|https://ksijamat.org/projects/|Lists Medical and Hospitalization,<br>Educational Assistance and Hajatmand.<br>f|
|KSI Jamaat Mumbai — Contact Us|https://ksijamat.org/contact-us/|Official contact/address information; use<br>current official page rather than demo<br>business data.|
|Maharashtra DTE — Merit-Cum-Means|https://dte.maharashtra.gov.in/merit-cum-<br>means/|Reference for common scholarship<br>eligibility/income-document patterns; not<br>Jamaatpolicy.|
|Maharashtra MahaDBT — EBC scholarship<br>example|https://mahadbt.maharashtra.gov.in/|Reference for common Indian scholarship<br>documentation such as income certificates<br>and marksheets;not Jamaatpolicy.|
|||Reference for current government<br>l  i|
|National Scholarship Portal|https://scholarships.gov.in/|scholarship workflow and scheme-specific<br>eligibility.|
|Government of India medical assistance<br>guidance|https://www.mohfw.gov.in/|Reference for typical medical-assistance<br>evidence such as medical reports and<br>income documentation;not Jamaatpolicy.|



## **14. Production Data Replacement Checklist** 

- Replace every DEMO / PROVISIONAL label with an admin-approved policy record or remove the service. 

- Confirm exact eligibility for each service with Jamaat committee/administrator. 

- Confirm exact documents and whether originals, scans or self-attested copies are needed. 

- Confirm whether Aadhaar is actually required; if yes, collect it only through a secure authenticated workflow. 

- Confirm exact benefit amounts, percentage assistance, caps and frequency. 

- Confirm application deadlines and renewal rules. 

- Confirm whether assistance is reimbursement, direct payment to institution/hospital, direct bank transfer, or another method. 

- Confirm official contact person/team for each service. 

- Replace every fictional business with real, consented/verified business records before production. 

- Add business verification and expiry dates. 

- Connect location search to the actual business database; do not make the language model invent businesses. 

- Add an admin review workflow for all service-rule changes. 

- Add source/reference fields to every policy record. 

- Test the chatbot with ambiguous, adversarial and out-of-scope questions before launch. 

## **15. Minimal JSON Demo Dataset** 

{ 

- "services": [ 

- { 

- "id": "SERVICE_EDU_001", 

- "name": "Educational Assistance", 

Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

"status": "provisional", "officially_verified": false, "category": "Education" }, { "id": "SERVICE_MED_001", "name": "Medical & Hospitalization Assistance", "status": "provisional", "officially_verified": false, "category": "Medical" }, { "id": "SERVICE_HAJ_001", "name": "Hajatmand Support", "status": "provisional", "officially_verified": false, "category": "Welfare" }, { "id": "SERVICE_FIN_001", "name": "Financial / Emergency Assistance", "status": "demo", "officially_verified": false, "category": "Financial" }, { "id": "SERVICE_DOC_001", "name": "Document / Certificate Assistance", "status": "demo", "officially_verified": false, "category": "Documents" }, { "id": "SERVICE_FAC_001", "name": "Facility / Hall Booking", "status": "demo", "officially_verified": false, "category": "Facilities" } ], "businesses": [ { "id": "BUS-001", "name": "Abbas Plumbing & Sanitary Works", "category": "Home Services", "service_type": "Plumber", 

Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

"city": "Navi Mumbai", "locality": "Vashi", "phone": "+91 9000000001", "verified": false }, { "id": "BUS-002", "name": "Ali Electric Solutions", "category": "Home Services", "service_type": "Electrician", "city": "Navi Mumbai", "locality": "Nerul", "phone": "+91 9000000002", "verified": false }, { "id": "BUS-003", "name": "Haider AC & Refrigeration", "category": "Home Services", "service_type": "AC Repair", "city": "Thane", "locality": "Majiwada", "phone": "+91 9000000003", "verified": false }, { "id": "BUS-004", "name": "Zahra Ladies Tailoring Studio", "category": "Apparel", "service_type": "Tailor", "city": "Mumbai", "locality": "Dongri", "phone": "+91 9000000004", "verified": false }, { "id": "BUS-005", "name": "Sakina Home Bakers", "category": "Food", "service_type": "Home Bakery", "city": "Mumbai", "locality": "Byculla", "phone": "+91 9000000005", "verified": false }, { 

Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

"id": "BUS-006", "name": "Hussain Computer Care", "category": "Technology", "service_type": "Computer Repair", "city": "Mumbai", "locality": "Kurla", "phone": "+91 9000000006", "verified": false }, { "id": "BUS-007", "name": "Fatema Learning Point", "category": "Education", "service_type": "Tutor", "city": "Mumbai", "locality": "Mazgaon", "phone": "+91 9000000007", "verified": false }, { "id": "BUS-008", "name": "Mehdi Career Guidance Centre", "category": "Education", "service_type": "Career Counselling", "city": "Mumbai", "locality": "Andheri East", "phone": "+91 9000000008", "verified": false }, { "id": "BUS-009", "name": "Imran Mobile Care", "category": "Technology", "service_type": "Mobile Repair", "city": "Navi Mumbai", "locality": "Sanpada", "phone": "+91 9000000009", "verified": false }, { "id": "BUS-010", "name": "Hasan Auto Service", "category": "Automotive", "service_type": "Car & Bike Repair", "city": "Thane", "locality": "Kopri", 

Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

"phone": "+91 9000000010", "verified": false } ] } 

## **16. Final Implementation Principle** 

The strongest architecture is: structured database as source of truth → retrieval/filtering layer → language model for naturallanguage explanation → human/admin workflow for approval. The model should explain records, not manufacture policy. 

Jamaat AI Chatbot Knowledge Base — DEMO / PROVISIONAL where explicitly marked 

