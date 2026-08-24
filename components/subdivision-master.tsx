"use client";

import { Check, ChevronRight, Package, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, Users, X } from "lucide-react";
import { useState } from "react";

type SubdivisionRow = { id: number; code: string; shortName: string; subdivisionName: string; productwiseCount: number; fieldforcewiseCount: number; };
type ProductRow = { sno: number; productName: string; description: string; saleUnit: string; category: string; group: string; };
type FieldForceRow = { sno: number; name: string; designation: string; hq: string; reportingTo: string; };

const initialRows: SubdivisionRow[] = [
  { id: 1, code: "270", shortName: "Astra", subdivisionName: "Astra", productwiseCount: 15, fieldforcewiseCount: 52 },
  { id: 2, code: "271", shortName: "Aura", subdivisionName: "Aura", productwiseCount: 12, fieldforcewiseCount: 53 },
  { id: 3, code: "272", shortName: "ZIVIRA LAB", subdivisionName: "ZIVIRA LABS", productwiseCount: 27, fieldforcewiseCount: 112 }
];

const productwiseData: Record<string, ProductRow[]> = {
  "ZIVIRA LABS": [
    { sno:1,productName:"BEPIREX",description:"BEPOTASTINE BESILATE",saleUnit:"5ML",category:"ANTI-ALLERGY",group:"AA"},
    { sno:2,productName:"BRINZIA",description:"Brinzolamide and Brimonidine",saleUnit:"10ML",category:"ANTI-GLAUCOMA",group:"AG"},
    { sno:3,productName:"BRITIVIN",description:"BRIMONIDINE + TIMOLOL",saleUnit:"5 ML",category:"ANTI-GLAUCOMA",group:"AG"},
    { sno:4,productName:"DEXNOVA",description:"DEXAMETHASONE",saleUnit:"10ml",category:"NSAID",group:"INFLM"},
    { sno:5,productName:"DUCIRA GEL",description:"HPMC GEL",saleUnit:"10GMS",category:"TEAR SUBSTITUTE",group:"TS"},
    { sno:6,productName:"ENVISA",description:"ASTAXANTHIN + LUTEIN + L GLUTATHION",saleUnit:"10 CAPS",category:"ANTI-OXIDANT",group:"AO"},
    { sno:7,productName:"FOMIRA",description:"POLYETHYLENE GLYCOL + PROPYLENE GLYCOL",saleUnit:"10 ML",category:"TEAR SUBSTITUTE",group:"TS"},
    { sno:8,productName:"HYNIZA",description:"HYLURONIDASE INJECTION",saleUnit:"10",category:"SPREADING AGENT",group:"TS"},
    { sno:9,productName:"LATOBEST",description:"LATANOPROST",saleUnit:"5ML",category:"ANTI-GLAUCOMA",group:"AG"},
    { sno:10,productName:"LOTIVIZ",description:"LOTEPREDNOL",saleUnit:"5 ML",category:"CORTICOSTEROID",group:"INFLM"},
    { sno:11,productName:"MACUMER",description:"MACULAR ISOMERS",saleUnit:"10s",category:"ANTI-OXIDANT",group:"AO"},
    { sno:12,productName:"NEPAWEL",description:"NEPAFENAC",saleUnit:"5 ML",category:"NSAID",group:"INFLM"},
    { sno:13,productName:"PATVIRA",description:"OLOPATADINE",saleUnit:"3 ML",category:"ANTI-ALLERGY",group:"AA"},
    { sno:14,productName:"PREDIRA",description:"PREDNISOLONE ACETATE",saleUnit:"10 ML",category:"CORTICOSTEROID",group:"INFLM"},
    { sno:15,productName:"STRIOS",description:"STERILE CLEANSING WIPES",saleUnit:"24",category:"STERILE WIPES",group:"WIPES"},
    { sno:16,productName:"TIMOBEST",description:"TIMOLOL",saleUnit:"5 ML",category:"ANTI-GLAUCOMA",group:"AG"},
    { sno:17,productName:"TIZTA 10ML",description:"SODIUM HYALURONATE",saleUnit:"10ML",category:"TEAR SUBSTITUTE",group:"TS"},
    { sno:18,productName:"TIZTA 5ML",description:"SODIUM HYALURONATE",saleUnit:"5ML",category:"TEAR SUBSTITUTE",group:"TS"},
    { sno:19,productName:"TOBRAWIN",description:"TOBRAMYCIN",saleUnit:"5ML",category:"ANTI-INFECTIVE",group:"AI"},
    { sno:20,productName:"TOBRAWIN LP",description:"TOBRAMYCIN AND LOTEPREDNOL ETABONATE",saleUnit:"5ML",category:"ANTI-INFECTIVE+STEROID COMB",group:"AIC"},
    { sno:21,productName:"VITTLES JELLY",description:"SUPPLIMENT JELLY",saleUnit:"30S",category:"ANTI-OXIDANT",group:"AO"},
    { sno:22,productName:"XIATRA",description:"TRAVOPROST",saleUnit:"2.5 ML",category:"ANTI-GLAUCOMA",group:"AG"},
    { sno:23,productName:"ZIVIFRESH",description:"CARBOXYMETHYL CELLULOSE",saleUnit:"10 ML",category:"TEAR SUBSTITUTE",group:"TS"},
    { sno:24,productName:"ZIVIFRESH GEL",description:"CARBOXYMETHYL CELLULOSE",saleUnit:"10 ML",category:"TEAR SUBSTITUTE",group:"TS"},
    { sno:25,productName:"ZIVIMOX",description:"MOXIFLOXACIN",saleUnit:"5 ML",category:"ANTI-INFECTIVE",group:"AI"},
    { sno:26,productName:"ZIVIMOX LP",description:"MOXIFLOXACIN LOTEPREDNOL",saleUnit:"5ML",category:"ANTI-INFECTIVE+STEROID COMB",group:"AIC"},
    { sno:27,productName:"ZIVIMOX-D",description:"MOXIFLOXACIN + DEXAMETHASONE",saleUnit:"5 ML",category:"ANTI-INFECTIVE+STEROID COMB",group:"AIC"}
  ],
  "Astra": [
    { sno:1,productName:"BEPIREX",description:"BEPOTASTINE BESILATE",saleUnit:"5ML",category:"ANTI-ALLERGY",group:"AA"},
    { sno:2,productName:"BRITIVIN",description:"BRIMONIDINE + TIMOLOL",saleUnit:"5 ML",category:"ANTI-GLAUCOMA",group:"AG"},
    { sno:3,productName:"DUCI DROP",description:"HPMC DROPS",saleUnit:"10ml",category:"TEAR SUBSTITUTE",group:"TS"},
    { sno:4,productName:"DUCIRA GEL",description:"HPMC GEL",saleUnit:"10GMS",category:"TEAR SUBSTITUTE",group:"TS"},
    { sno:5,productName:"ENVISA",description:"ASTAXANTHIN + LUTEIN + L GLUTATHION",saleUnit:"10 CAPS",category:"ANTI-OXIDANT",group:"AO"},
    { sno:6,productName:"LATOBEST",description:"LATANOPROST",saleUnit:"5ML",category:"ANTI-GLAUCOMA",group:"AG"},
    { sno:7,productName:"LOTIVIZ",description:"LOTEPREDNOL",saleUnit:"5 ML",category:"CORTICOSTEROID",group:"INFLM"},
    { sno:8,productName:"PREDIRA",description:"PREDNISOLONE ACETATE",saleUnit:"10 ML",category:"CORTICOSTEROID",group:"INFLM"},
    { sno:9,productName:"STRIOS",description:"STERILE CLEANSING WIPES",saleUnit:"24",category:"STERILE WIPES",group:"WIPES"},
    { sno:10,productName:"TIMOBEST",description:"TIMOLOL",saleUnit:"5 ML",category:"ANTI-GLAUCOMA",group:"AG"},
    { sno:11,productName:"TIZTA 10ML",description:"SODIUM HYALURONATE",saleUnit:"10ML",category:"TEAR SUBSTITUTE",group:"TS"},
    { sno:12,productName:"TIZTA 5ML",description:"SODIUM HYALURONATE",saleUnit:"5ML",category:"TEAR SUBSTITUTE",group:"TS"},
    { sno:13,productName:"TOBRAWIN",description:"TOBRAMYCIN",saleUnit:"5ML",category:"ANTI-INFECTIVE",group:"AI"},
    { sno:14,productName:"TOBRAWIN LP",description:"TOBRAMYCIN AND LOTEPREDNOL ETABONATE",saleUnit:"5ML",category:"ANTI-INFECTIVE+STEROID COMB",group:"AIC"},
    { sno:15,productName:"ZIVIMOX-D",description:"MOXIFLOXACIN + DEXAMETHASONE",saleUnit:"5 ML",category:"ANTI-INFECTIVE+STEROID COMB",group:"AIC"}
  ],
  "Aura": [
    { sno:1,productName:"BRINZIA",description:"Brinzolamide and Brimonidine",saleUnit:"10ML",category:"ANTI-GLAUCOMA",group:"AG"},
    { sno:2,productName:"DEXNOVA",description:"DEXAMETHASONE",saleUnit:"10ml",category:"NSAID",group:"INFLM"},
    { sno:3,productName:"FOMIRA",description:"POLYETHYLENE GLYCOL + PROPYLENE GLYCOL",saleUnit:"10 ML",category:"TEAR SUBSTITUTE",group:"TS"},
    { sno:4,productName:"MACUMER",description:"MACULAR ISOMERS",saleUnit:"10s",category:"ANTI-OXIDANT",group:"AO"},
    { sno:5,productName:"NEPAWEL",description:"NEPAFENAC",saleUnit:"5 ML",category:"NSAID",group:"INFLM"},
    { sno:6,productName:"PATVIRA",description:"OLOPATADINE",saleUnit:"3 ML",category:"ANTI-ALLERGY",group:"AA"},
    { sno:7,productName:"VITTLES JELLY",description:"SUPPLIMENT JELLY",saleUnit:"30S",category:"ANTI-OXIDANT",group:"AO"},
    { sno:8,productName:"XIATRA",description:"TRAVOPROST",saleUnit:"2.5 ML",category:"ANTI-GLAUCOMA",group:"AG"},
    { sno:9,productName:"ZIVIFRESH",description:"CARBOXYMETHYL CELLULOSE",saleUnit:"10 ML",category:"TEAR SUBSTITUTE",group:"TS"},
    { sno:10,productName:"ZIVIFRESH GEL",description:"CARBOXYMETHYL CELLULOSE",saleUnit:"10 ML",category:"TEAR SUBSTITUTE",group:"TS"},
    { sno:11,productName:"ZIVIMOX",description:"MOXIFLOXACIN",saleUnit:"5 ML",category:"ANTI-INFECTIVE",group:"AI"},
    { sno:12,productName:"ZIVIMOX LP",description:"MOXIFLOXACIN LOTEPREDNOL",saleUnit:"5ML",category:"ANTI-INFECTIVE+STEROID COMB",group:"AIC"}
  ]
};

const fieldforcewiseData: Record<string, FieldForceRow[]> = {
  "ZIVIRA LABS": [
    {sno:1,name:"ISAMADI ABDUL ISAMADI",designation:"AREA BUSINESS MANAGER",hq:"HUBLI",reportingTo:"ARUN KUMAR BOSE"},
    {sno:2,name:"AHAMMAD ALI",designation:"AREA BUSINESS MANAGER",hq:"GUWAHATI",reportingTo:"BIDESH BASAK"},
    {sno:3,name:"AJIT MISHRA",designation:"BUSINESS EXECUTIVE",hq:"VARANASI",reportingTo:"GAURAV SINGH"},
    {sno:4,name:"AKSHAY KUMAR",designation:"BUSINESS EXECUTIVE",hq:"PATNA",reportingTo:"SHUBHAM KUMAR PANDEY"},
    {sno:5,name:"AMEER",designation:"AREA BUSINESS MANAGER",hq:"BANGALORE",reportingTo:"ARUN KUMAR BOSE"},
    {sno:6,name:"AMIT SWAR",designation:"BUSINESS EXECUTIVE",hq:"SILIGURI",reportingTo:"RAJIB KONER"},
    {sno:7,name:"ANIL KUMAR D",designation:"BUSINESS EXECUTIVE",hq:"BANGALORE",reportingTo:"AMEER"},
    {sno:8,name:"ANKUR PAL",designation:"BUSINESS EXECUTIVE",hq:"MIDINAPORE",reportingTo:"SANTU KUMAR DAS"},
    {sno:9,name:"ANUJ KUMAR",designation:"REGIONAL BUSINESS MANAGER",hq:"DELHI",reportingTo:"GURDEEP ARORA"},
    {sno:10,name:"ARUN KUMAR BOSE",designation:"REGIONAL BUSINESS MANAGER",hq:"BANGALORE",reportingTo:"admin"},
    {sno:11,name:"ARUNAVA CHAKRABORTY",designation:"AREA BUSINESS MANAGER",hq:"KOLKATA",reportingTo:"BARUN ROY CHOWDHURY"},
    {sno:12,name:"ASHISH CHAWLA",designation:"BUSINESS EXECUTIVE",hq:"BATINDA",reportingTo:"RAJAN SHARMA ABM"},
    {sno:13,name:"ATMALING GURULING SUTAR",designation:"BUSINESS EXECUTIVE",hq:"PUNE",reportingTo:"SHARAD LAXMAN THORVE"},
    {sno:14,name:"BALARAM SINGH YADAV",designation:"BUSINESS EXECUTIVE",hq:"SAGAR",reportingTo:"KALOO MANSORE"},
    {sno:15,name:"BARUN ROY CHOWDHURY",designation:"REGIONAL BUSINESS MANAGER",hq:"KOLKATA",reportingTo:"JOYDEEP BANERJEE"},
    {sno:16,name:"BHUKTAR SACHIN KONDIRAM",designation:"BUSINESS EXECUTIVE",hq:"Aurangabad",reportingTo:"SAMEER HIWARKAR"},
    {sno:17,name:"BIDESH BASAK",designation:"REGIONAL BUSINESS MANAGER",hq:"GUWAHATI",reportingTo:"JOYDEEP BANERJEE"},
    {sno:18,name:"CATHERINE DANAN",designation:"MARKETING HEAD",hq:"adminzivira",reportingTo:"PT KUMARAN"},
    {sno:19,name:"CHITRASEN BISEN",designation:"BUSINESS EXECUTIVE",hq:"RAIPUR",reportingTo:"SANDEEP KUMAR SINGH"},
    {sno:20,name:"DAVOOD KHAN V",designation:"BUSINESS EXECUTIVE",hq:"BANGALORE",reportingTo:"AMEER"},
    {sno:21,name:"DEEPAK KUMAR JHA",designation:"BUSINESS EXECUTIVE",hq:"DELHI (CENTRAL)",reportingTo:"SHUBHAM SHARMA ABM"},
    {sno:22,name:"DIBAKAR KUMAR DAS",designation:"BUSINESS EXECUTIVE",hq:"BARRACKPORE",reportingTo:"KOYEL CHAKRA"},
    {sno:23,name:"GAURAV PRAVIN YEWALE",designation:"BUSINESS EXECUTIVE",hq:"NASHIK",reportingTo:"SAMEER HIWARKAR"},
    {sno:24,name:"GAURAV SINGH",designation:"AREA BUSINESS MANAGER",hq:"LUCKNOW",reportingTo:"RAKESH RANJAN JHA"},
    {sno:25,name:"GURDEEP ARORA",designation:"ZONAL BUSINESS MANAGER",hq:"DELHI",reportingTo:"PT KUMARAN"},
    {sno:26,name:"GURSHARAN SINGH CHEEMA",designation:"AREA BUSINESS MANAGER",hq:"LUDHIANA",reportingTo:"GURDEEP ARORA"},
    {sno:27,name:"HASSAIN BAIG",designation:"BUSINESS EXECUTIVE",hq:"VIJAYAWADA",reportingTo:"SHAFIULLA QURESHI"},
    {sno:28,name:"HEAD OFFICE",designation:"MARKETING HEAD",hq:"MUMBAI",reportingTo:"admin"},
    {sno:29,name:"JALANDHARA VIJAYBHAI CHHAGANBHAI",designation:"BUSINESS EXECUTIVE",hq:"AHEMADABAD",reportingTo:"MEHUL AJAYKUMAR PAREKH"},
    {sno:30,name:"JASPREET SINGH",designation:"BUSINESS EXECUTIVE",hq:"LUDHIANA",reportingTo:"GURSHARAN SINGH CHEEMA"},
    {sno:31,name:"JIGNESH RAMESHBHAI JADAV",designation:"REGIONAL BUSINESS MANAGER",hq:"AHMEDABAD",reportingTo:"MAHESH YADAV"},
    {sno:32,name:"JOYDEEP BANERJEE",designation:"SALES MANAGER",hq:"KOLKATA",reportingTo:"PT KUMARAN"},
    {sno:33,name:"KALKANI NIKUNJKUMAR JAYSUKHBHAI",designation:"BUSINESS EXECUTIVE",hq:"SURAT",reportingTo:"RAVI K PAMNANI"},
    {sno:34,name:"KALOO MANSORE",designation:"AREA BUSINESS MANAGER",hq:"INDORE",reportingTo:"SANDEEP KUMAR SINGH"},
    {sno:35,name:"KAMLESH THAKUR",designation:"BUSINESS EXECUTIVE",hq:"BARODA",reportingTo:"RAVI K PAMNANI"},
    {sno:36,name:"KIRAN KUMAR SUBUDHI",designation:"AREA BUSINESS MANAGER",hq:"BHUBANESWAR",reportingTo:"BARUN ROY CHOWDHURY"},
    {sno:37,name:"KOYEL CHAKRA",designation:"AREA BUSINESS MANAGER",hq:"KOLKATA",reportingTo:"BARUN ROY CHOWDHURY"},
    {sno:38,name:"KUSHU BHOWMIK",designation:"BUSINESS EXECUTIVE",hq:"GUWAHATI",reportingTo:"AHAMMAD ALI"},
    {sno:39,name:"LALIT RANJAN BHATTACHARYA",designation:"BUSINESS EXECUTIVE",hq:"BHUBANESWAR",reportingTo:"KIRAN KUMAR SUBUDHI"},
    {sno:40,name:"MAHESH R",designation:"BUSINESS EXECUTIVE",hq:"BANGALORE",reportingTo:"AMEER"},
    {sno:41,name:"MALIKJAN SHEKH",designation:"BUSINESS EXECUTIVE",hq:"HUBLI",reportingTo:"ISAMADI ABDUL ISAMADI"},
    {sno:42,name:"MANAS KUMAR SWAIN",designation:"BUSINESS EXECUTIVE",hq:"BHUBANESWAR",reportingTo:"KIRAN KUMAR SUBUDHI"},
    {sno:43,name:"MANIK NANDA",designation:"BUSINESS EXECUTIVE",hq:"CHANDIGARH",reportingTo:"GURSHARAN SINGH CHEEMA"},
    {sno:44,name:"MANOJ JANGID",designation:"SENIOR BUSINESS EXECUTIVE",hq:"AJMER",reportingTo:"RAMAKANT SHARMA"},
    {sno:45,name:"MEHUL AJAYKUMAR PAREKH",designation:"AREA BUSINESS MANAGER",hq:"AHEMADABAD",reportingTo:"JIGNESH RAMESHBHAI JADAV"},
    {sno:46,name:"MOHIT SHARMA",designation:"BUSINESS EXECUTIVE",hq:"JAIPUR",reportingTo:"RAMAKANT SHARMA"},
    {sno:47,name:"PANKAJ KUMAR YADAV",designation:"BUSINESS EXECUTIVE",hq:"LUCKNOW",reportingTo:"GAURAV SINGH"},
    {sno:48,name:"PIYUSH KUMAR",designation:"BUSINESS EXECUTIVE",hq:"DELHI",reportingTo:"SHIVANSHU CHITKARA"},
    {sno:49,name:"POLEPALLI OMKAR",designation:"BUSINESS EXECUTIVE",hq:"BANGALORE",reportingTo:"THARUN CHOWDARY M S"},
    {sno:50,name:"PRANGYA PARAMITA DASH",designation:"BUSINESS EXECUTIVE",hq:"CUTTACK",reportingTo:"KIRAN KUMAR SUBUDHI"},
    {sno:51,name:"PRASHANTH B J",designation:"BUSINESS EXECUTIVE",hq:"DAVANGERE",reportingTo:"ISAMADI ABDUL ISAMADI"},
    {sno:52,name:"PRASHANTHA NAIK H G",designation:"BUSINESS EXECUTIVE",hq:"BANGALORE",reportingTo:"THARUN CHOWDARY M S"},
    {sno:53,name:"PRATIK SHARMA",designation:"BUSINESS EXECUTIVE",hq:"GWALIOR",reportingTo:"KALOO MANSORE"},
    {sno:54,name:"PRAVEEN KUMAR S",designation:"BUSINESS EXECUTIVE",hq:"MYSORE",reportingTo:"THARUN CHOWDARY M S"},
    {sno:55,name:"PRIYANKA",designation:"BUSINESS EXECUTIVE",hq:"JALANDHAR",reportingTo:"GURSHARAN SINGH CHEEMA"},
    {sno:56,name:"PT KUMARAN",designation:"BUSINESS HEAD",hq:"MUMBAI",reportingTo:"admin"},
    {sno:57,name:"PTK KANNAN",designation:"BUSINESS RELATIONSHIP MANAGER SOUTH INDIA",hq:"CHENNAI",reportingTo:"admin"},
    {sno:58,name:"RAHUL BHARAT RAUT",designation:"BUSINESS EXECUTIVE",hq:"PUNE",reportingTo:"SHARAD LAXMAN THORVE"},
    {sno:59,name:"RAHUL MISHRA",designation:"BUSINESS EXECUTIVE",hq:"DELHI",reportingTo:"SHUBHAM SHARMA ABM"},
    {sno:60,name:"RAHUL SINHA",designation:"BUSINESS EXECUTIVE",hq:"DHANBAD",reportingTo:"RAJIB KONER"},
    {sno:61,name:"RAJAN SHARMA ABM",designation:"AREA BUSINESS MANAGER",hq:"AMRITSAR",reportingTo:"GURDEEP ARORA"},
    {sno:62,name:"RAJAN SHARMA BE",designation:"BUSINESS EXECUTIVE",hq:"AMRITSAR",reportingTo:"RAJAN SHARMA ABM"},
    {sno:63,name:"RAJIB KONER",designation:"AREA BUSINESS MANAGER",hq:"BURDWAN",reportingTo:"BIDESH BASAK"},
    {sno:64,name:"RAKESH RANJAN JHA",designation:"REGIONAL BUSINESS MANAGER",hq:"DELHI",reportingTo:"GURDEEP ARORA"},
    {sno:65,name:"RAMAKANT SHARMA",designation:"AREA BUSINESS MANAGER",hq:"JAIPUR",reportingTo:"GURDEEP ARORA"},
    {sno:66,name:"RANJEET GOUR",designation:"BUSINESS EXECUTIVE",hq:"BHOPAL",reportingTo:"SANDEEP KUMAR SINGH"},
    {sno:67,name:"RAUSHAN KUMAR",designation:"BUSINESS EXECUTIVE",hq:"PATNA",reportingTo:"SHUBHAM KUMAR PANDEY"},
    {sno:68,name:"RAVI K PAMNANI",designation:"AREA BUSINESS MANAGER",hq:"SURAT",reportingTo:"JIGNESH RAMESHBHAI JADAV"},
    {sno:69,name:"RAVI R LATHIYA",designation:"BUSINESS EXECUTIVE",hq:"RAJKOT",reportingTo:"MEHUL AJAYKUMAR PAREKH"},
    {sno:70,name:"RITAM GHOSH",designation:"BUSINESS EXECUTIVE",hq:"KOLKATA",reportingTo:"ARUNAVA CHAKRABORTY"},
    {sno:71,name:"RIYAJUL ISLAM",designation:"BUSINESS EXECUTIVE",hq:"GUWAHATI",reportingTo:"AHAMMAD ALI"},
    {sno:72,name:"ROHAN MUKHERJEE",designation:"BUSINESS EXECUTIVE",hq:"BERHAMPUR",reportingTo:"RAJIB KONER"},
    {sno:73,name:"ROHIT SAHU",designation:"BUSINESS EXECUTIVE",hq:"Jabalpur",reportingTo:"SANDEEP KUMAR SINGH"},
    {sno:74,name:"RONY MANDAL",designation:"BUSINESS EXECUTIVE",hq:"KOLKATA",reportingTo:"KOYEL CHAKRA"},
    {sno:75,name:"SACHIN H KULKARNI",designation:"BUSINESS EXECUTIVE",hq:"Nanded",reportingTo:"SAMEER HIWARKAR"},
    {sno:76,name:"SACHIN KUMAR SHARMA",designation:"BUSINESS EXECUTIVE",hq:"GURGAON",reportingTo:"SHUBHAM SHARMA ABM"},
    {sno:77,name:"SACHIN RAJPUROHIT",designation:"BUSINESS EXECUTIVE",hq:"JODHPUR",reportingTo:"RAMAKANT SHARMA"},
    {sno:78,name:"SAMEER HIWARKAR",designation:"AREA BUSINESS MANAGER",hq:"Aurangabad",reportingTo:"SUNIL VISHWAKARMA"},
    {sno:79,name:"SAMUEL PUSHPARAJ P",designation:"ZONAL BUSINESS MANAGER",hq:"CHENNAI",reportingTo:"PTK KANNAN"},
    {sno:80,name:"SANDEEP KUMAR SINGH",designation:"REGIONAL BUSINESS MANAGER",hq:"BHOPAL",reportingTo:"MAHESH YADAV"},
    {sno:81,name:"SANGITA BRAHMA",designation:"BUSINESS EXECUTIVE",hq:"KOLKATA",reportingTo:"SANTU KUMAR DAS"},
    {sno:82,name:"SANTHOH NAIK",designation:"BUSINESS EXECUTIVE",hq:"BANGALORE",reportingTo:"THARUN CHOWDARY M S"},
    {sno:83,name:"SANTU KUMAR DAS",designation:"AREA BUSINESS MANAGER",hq:"KOLKATA",reportingTo:"BARUN ROY CHOWDHURY"},
    {sno:84,name:"SAURABH WALIA",designation:"BUSINESS EXECUTIVE",hq:"DELHI (NORTH)",reportingTo:"SHUBHAM SHARMA ABM"},
    {sno:85,name:"SAURABH KUMAR",designation:"BUSINESS EXECUTIVE",hq:"RANCHI",reportingTo:"KIRAN KUMAR SUBUDHI"},
    {sno:86,name:"SHAHJI PATIL",designation:"BUSINESS EXECUTIVE",hq:"KOLHAPUR",reportingTo:"SHARAD LAXMAN THORVE"},
    {sno:87,name:"SHAHNAWAZ SIDIQ KHAN",designation:"BUSINESS EXECUTIVE",hq:"SRINAGAR",reportingTo:"RAJAN SHARMA ABM"},
    {sno:88,name:"SHARAD LAXMAN THORVE",designation:"AREA BUSINESS MANAGER",hq:"PUNE",reportingTo:"SUNIL VISHWAKARMA"},
    {sno:89,name:"SHIVAM RAO",designation:"BUSINESS EXECUTIVE",hq:"GORAKHPUR",reportingTo:"GAURAV SINGH"},
    {sno:90,name:"SHIVANSHU CHITKARA",designation:"AREA BUSINESS MANAGER",hq:"DELHI",reportingTo:"ANUJ KUMAR"},
    {sno:91,name:"SHUBHAM KUMAR PANDEY",designation:"AREA BUSINESS MANAGER",hq:"PATNA",reportingTo:"BIDESH BASAK"},
    {sno:92,name:"SHUBHAM SHARMA ABM",designation:"AREA BUSINESS MANAGER",hq:"DELHI (NORTH)",reportingTo:"ANUJ KUMAR"},
    {sno:93,name:"SHUBHAM SHARMA BE",designation:"BUSINESS EXECUTIVE",hq:"INDORE",reportingTo:"KALOO MANSORE"},
    {sno:94,name:"SOHAM ROY",designation:"BUSINESS EXECUTIVE",hq:"BURDWAN",reportingTo:"RAJIB KONER"},
    {sno:95,name:"SOMNATH DAS",designation:"BUSINESS EXECUTIVE",hq:"SILCHAR",reportingTo:"AHAMMAD ALI"},
    {sno:96,name:"SOURAV DAS",designation:"BUSINESS EXECUTIVE",hq:"KOLKATA",reportingTo:"SANTU KUMAR DAS"},
    {sno:97,name:"SOUVIK PAUL",designation:"BUSINESS EXECUTIVE",hq:"KOLKATA",reportingTo:"ARUNAVA CHAKRABORTY"},
    {sno:98,name:"SSIVANESAN",designation:"SALES MANAGER",hq:"CHENNAI",reportingTo:"PTK KANNAN"},
    {sno:99,name:"SUBANHAFIZ",designation:"BUSINESS EXECUTIVE",hq:"GULBARGA",reportingTo:"ISAMADI ABDUL ISAMADI"},
    {sno:100,name:"SUBHANKAR DAS",designation:"BUSINESS EXECUTIVE",hq:"HOWRAH",reportingTo:"ARUNAVA CHAKRABORTY"},
    {sno:101,name:"SUBHANKAR SINGH",designation:"BUSINESS EXECUTIVE",hq:"HOOGHLY",reportingTo:"ARUNAVA CHAKRABORTY"},
    {sno:102,name:"SUMIT MITRA",designation:"BUSINESS EXECUTIVE",hq:"KOLKATA",reportingTo:"KOYEL CHAKRA"},
    {sno:103,name:"SUNIL VISHWAKARMA",designation:"REGIONAL BUSINESS MANAGER",hq:"PUNE",reportingTo:"MAHESH YADAV"},
    {sno:104,name:"SWARAJ KUMAR SAMANTA",designation:"BUSINESS EXECUTIVE",hq:"MIDINAPORE",reportingTo:"SANTU KUMAR DAS"},
    {sno:105,name:"THARUN CHOWDARY M S",designation:"AREA BUSINESS MANAGER",hq:"BANGALORE",reportingTo:"ARUN KUMAR BOSE"},
    {sno:106,name:"TOOSEEF MALLIK",designation:"BUSINESS EXECUTIVE",hq:"DEHRADUN",reportingTo:"RAKESH RANJAN JHA"},
    {sno:107,name:"Vacant",designation:"BUSINESS EXECUTIVE",hq:"MUZAFFARPUR",reportingTo:"SHUBHAM KUMAR PANDEY"},
    {sno:108,name:"VARUN",designation:"BUSINESS EXECUTIVE",hq:"MEERUT",reportingTo:"RAKESH RANJAN JHA"},
    {sno:109,name:"VIPIN KUMAR DUBEY",designation:"REGIONAL BUSINESS MANAGER",hq:"MUMBAI",reportingTo:"PT KUMARAN"},
    {sno:110,name:"VISHAL GIRI",designation:"BUSINESS EXECUTIVE",hq:"CHANDIGARH",reportingTo:"GURSHARAN SINGH CHEEMA"},
    {sno:111,name:"VIVEK THAKUR",designation:"BUSINESS EXECUTIVE",hq:"DELHI (SOUTH)",reportingTo:"SHIVANSHU CHITKARA"},
    {sno:112,name:"VIVEKANAND N A",designation:"ZONAL BUSINESS MANAGER",hq:"ERNAKULAM",reportingTo:"PT KUMARAN"}
  ],
  "Astra": [
    {sno:1,name:"JITHESH K",designation:"AREA BUSINESS MANAGER",hq:"CALICUT",reportingTo:"VINAYAK BHAT"},
    {sno:2,name:"MARIAPPAN K",designation:"REGIONAL BUSINESS MANAGER",hq:"MADURAI",reportingTo:"SSIVANESAN"},
    {sno:3,name:"ABHISHEK P",designation:"BUSINESS EXECUTIVE",hq:"PERINTHALMANNA",reportingTo:"JITHESH K"},
    {sno:4,name:"AJMAL B",designation:"BUSINESS EXECUTIVE",hq:"KOLLAM",reportingTo:"SIBIN N"},
    {sno:5,name:"AKASH MISHRA",designation:"BUSINESS EXECUTIVE",hq:"MUMBAI-BORIVALI UP TRACK",reportingTo:"DHARMENDRA RAJENDRA PRASAD VISHWAKARMA"},
    {sno:6,name:"AMITH K",designation:"BUSINESS EXECUTIVE",hq:"KANNUR",reportingTo:"JITHESH K"},
    {sno:7,name:"ANIKET SINGH",designation:"BUSINESS EXECUTIVE",hq:"MUMBAI-CENTRAL TRACK",reportingTo:"GANESH SURESH PAWAR"},
    {sno:8,name:"AROCKIA RAJ L",designation:"BUSINESS EXECUTIVE",hq:"TIRUNELVELI",reportingTo:"M RENGANATHAN"},
    {sno:9,name:"ARUL SELVAM ARCHUNAN",designation:"BUSINESS EXECUTIVE",hq:"PONDICHERRY",reportingTo:"SRIDHAR R"},
    {sno:10,name:"ASHISH KUMAR YADAV",designation:"BUSINESS EXECUTIVE",hq:"MUMBAI",reportingTo:"DHARMENDRA RAJENDRA PRASAD VISHWAKARMA"},
    {sno:11,name:"BADDAM ANIL",designation:"BUSINESS EXECUTIVE",hq:"HYDERABAD",reportingTo:"NAGARAJU K"},
    {sno:12,name:"BALAKRISHNA SHENOY",designation:"BUSINESS EXECUTIVE",hq:"ERNAKULAM",reportingTo:"SANDEEP R SHENOY"},
    {sno:13,name:"DHARMENDRA RAJENDRA PRASAD VISHWAKARMA",designation:"AREA BUSINESS MANAGER",hq:"MUMBAI",reportingTo:"VIPIN KUMAR DUBEY"},
    {sno:14,name:"GANESH SURESH PAWAR",designation:"AREA BUSINESS MANAGER",hq:"THANE",reportingTo:"VIPIN KUMAR DUBEY"},
    {sno:15,name:"GIREESH KAMMATH",designation:"BUSINESS EXECUTIVE",hq:"KOTTAYAM",reportingTo:"SIBIN N"},
    {sno:16,name:"HASSAIN BAIG",designation:"BUSINESS EXECUTIVE",hq:"VIJAYAWADA",reportingTo:"SHAFIULLA QURESHI"},
    {sno:17,name:"HEMANTH KUMAR K",designation:"AREA BUSINESS MANAGER",hq:"TIRUPATHY",reportingTo:"RAVISANKAR DUVVA"},
    {sno:18,name:"IMTHIYAZ AHMED M Y",designation:"BUSINESS EXECUTIVE",hq:"CHENNAI",reportingTo:"SRIDHAR R"},
    {sno:19,name:"INUMARTHI VENKATA SATISH",designation:"BUSINESS EXECUTIVE",hq:"VISAKHAPATNAM",reportingTo:"SHAFIULLA QURESHI"},
    {sno:20,name:"JAYARAM J PAI",designation:"BUSINESS EXECUTIVE",hq:"ERNAKULAM",reportingTo:"SANDEEP R SHENOY"},
    {sno:21,name:"KATHIRVEL S",designation:"BUSINESS EXECUTIVE",hq:"MADURAI",reportingTo:"M RENGANATHAN"},
    {sno:22,name:"KOMIRE HARSHAVARDHAN",designation:"BUSINESS EXECUTIVE",hq:"HYDERABAD",reportingTo:"NAGARAJU K"},
    {sno:23,name:"KUMAR S",designation:"BUSINESS EXECUTIVE",hq:"MADURAI",reportingTo:"M RENGANATHAN"},
    {sno:24,name:"LALIT GOUD",designation:"BUSINESS EXECUTIVE",hq:"MUMBAI-WESTERN TRACK",reportingTo:"DHARMENDRA RAJENDRA PRASAD VISHWAKARMA"},
    {sno:25,name:"M RENGANATHAN",designation:"AREA BUSINESS MANAGER",hq:"MADURAI",reportingTo:"MARIAPPAN K"},
    {sno:26,name:"M SIVAKUMAR",designation:"AREA BUSINESS MANAGER",hq:"COIMBATORE",reportingTo:"MARIAPPAN K"},
    {sno:27,name:"MANISH KUMAR SINGH",designation:"BUSINESS EXECUTIVE",hq:"THANE",reportingTo:"GANESH SURESH PAWAR"},
    {sno:28,name:"MEKALA SRIKANTH",designation:"BUSINESS EXECUTIVE",hq:"GUNTUR",reportingTo:"HEMANTH KUMAR K"},
    {sno:29,name:"MURALI",designation:"BUSINESS EXECUTIVE",hq:"TRICHY",reportingTo:"M SIVAKUMAR"},
    {sno:30,name:"NAGARAJU K",designation:"AREA BUSINESS MANAGER",hq:"HYDERABAD",reportingTo:"RAVISANKAR DUVVA"},
    {sno:31,name:"NEERAJ M",designation:"BUSINESS EXECUTIVE",hq:"TRICHUR",reportingTo:"SANDEEP R SHENOY"},
    {sno:32,name:"P BALAKRISHNA",designation:"BUSINESS EXECUTIVE",hq:"WARANGAL",reportingTo:"SSIVANESAN"},
    {sno:33,name:"RAGHAVAN M",designation:"BUSINESS EXECUTIVE",hq:"SALEM",reportingTo:"M SIVAKUMAR"},
    {sno:34,name:"RAHUL KUMAR YADAV",designation:"BUSINESS EXECUTIVE",hq:"MUMBAI SOUTH",reportingTo:"DHARMENDRA RAJENDRA PRASAD VISHWAKARMA"},
    {sno:35,name:"RAVISANKAR DUVVA",designation:"REGIONAL BUSINESS MANAGER",hq:"HYDERABAD",reportingTo:"SSIVANESAN"},
    {sno:36,name:"ROHIT SHUKLA",designation:"BUSINESS EXECUTIVE",hq:"MUMBAI-NAVIMUMBAI",reportingTo:"GANESH SURESH PAWAR"},
    {sno:37,name:"SANDEEP R SHENOY",designation:"AREA BUSINESS MANAGER",hq:"ERNAKULAM",reportingTo:"VINAYAK BHAT"},
    {sno:38,name:"SANTHANU V S",designation:"BUSINESS EXECUTIVE",hq:"COIMBATORE",reportingTo:"M SIVAKUMAR"},
    {sno:39,name:"SANTHOSH KUMAR",designation:"BUSINESS EXECUTIVE",hq:"CHENNAI",reportingTo:"SRIDHAR R"},
    {sno:40,name:"SARIDEY PHANEESWAR",designation:"BUSINESS EXECUTIVE",hq:"KAKINADA",reportingTo:"SHAFIULLA QURESHI"},
    {sno:41,name:"SHAFIULLA QURESHI",designation:"AREA BUSINESS MANAGER",hq:"VIJAYAWADA",reportingTo:"RAVISANKAR DUVVA"},
    {sno:42,name:"SIBIN N",designation:"AREA BUSINESS MANAGER",hq:"TRIVANDRUM",reportingTo:"VINAYAK BHAT"},
    {sno:43,name:"SIRIMALLA PREM KUMAR",designation:"BUSINESS EXECUTIVE",hq:"HYDERABAD",reportingTo:"NAGARAJU K"},
    {sno:44,name:"SREESHAG T P",designation:"BUSINESS EXECUTIVE",hq:"CALICUT",reportingTo:"JITHESH K"},
    {sno:45,name:"SRIDHAR R",designation:"AREA BUSINESS MANAGER",hq:"CHENNAI",reportingTo:"MARIAPPAN K"},
    {sno:46,name:"SSIVANESAN",designation:"SALES MANAGER",hq:"CHENNAI",reportingTo:"PTK KANNAN"},
    {sno:47,name:"SULAIMAN",designation:"BUSINESS EXECUTIVE",hq:"CHENNAI",reportingTo:"SRIDHAR R"},
    {sno:48,name:"SURYANK T",designation:"BUSINESS EXECUTIVE",hq:"KURNOOL",reportingTo:"HEMANTH KUMAR K"},
    {sno:49,name:"THANDLAM JASWANTH REDDY",designation:"BUSINESS EXECUTIVE",hq:"TIRUPATHY",reportingTo:"HEMANTH KUMAR K"},
    {sno:50,name:"VAISHNAV V",designation:"BUSINESS EXECUTIVE",hq:"TRIVANDRUM",reportingTo:"SIBIN N"},
    {sno:51,name:"VINAYAK BHAT",designation:"REGIONAL BUSINESS MANAGER",hq:"ERNAKULAM",reportingTo:"VIVEKANAND N A"},
    {sno:52,name:"VIPIN KUMAR DUBEY",designation:"REGIONAL BUSINESS MANAGER",hq:"MUMBAI",reportingTo:"PT KUMARAN"}
  ],
  "Aura": [
    {sno:1,name:"ANIL ANJAYA",designation:"BUSINESS EXECUTIVE",hq:"HYDERABAD",reportingTo:"THULSIRAM"},
    {sno:2,name:"ADHARSH T P",designation:"BUSINESS EXECUTIVE",hq:"CALICUT",reportingTo:"ROOVITH P V"},
    {sno:3,name:"AJEET KUMAR PANDEY",designation:"BUSINESS EXECUTIVE",hq:"MUMBAI",reportingTo:"VARUN KUMAR PANDEY"},
    {sno:4,name:"Akhil Thankachan",designation:"BUSINESS EXECUTIVE",hq:"Alleppey",reportingTo:"VISHNU HARIDAS"},
    {sno:5,name:"AMAL PG",designation:"BUSINESS EXECUTIVE",hq:"ERNAKULAM",reportingTo:"KIRANLAL T K"},
    {sno:6,name:"AMEERKHAN",designation:"BUSINESS EXECUTIVE",hq:"KOLLAM",reportingTo:"VISHNU HARIDAS"},
    {sno:7,name:"ANSHU VISHWAKARMA",designation:"BUSINESS EXECUTIVE",hq:"MUMBAI-BORIVALI UP TRACK",reportingTo:"JEETENDRA MAURYA"},
    {sno:8,name:"ARAVINTH SENTHIL KUMAR",designation:"BUSINESS EXECUTIVE",hq:"MADURAI",reportingTo:"JAGAN RAJA"},
    {sno:9,name:"ARUL ANANTH KUMAR",designation:"BUSINESS EXECUTIVE",hq:"SALEM",reportingTo:"S BASKAR"},
    {sno:10,name:"BIBIN K M",designation:"BUSINESS EXECUTIVE",hq:"TRICHUR",reportingTo:"KIRANLAL T K"},
    {sno:11,name:"DEVENDRA KUMAR SHUKLA",designation:"BUSINESS EXECUTIVE",hq:"THANE",reportingTo:"VARUN KUMAR PANDEY"},
    {sno:12,name:"DHEETI JAGAN",designation:"BUSINESS EXECUTIVE",hq:"HYDERABAD",reportingTo:"THULSIRAM"},
    {sno:13,name:"GANESH D",designation:"BUSINESS EXECUTIVE",hq:"ERNAKULAM",reportingTo:"KIRANLAL T K"},
    {sno:14,name:"GUNAPARTHI RAVIKUMAR",designation:"AREA BUSINESS MANAGER",hq:"KAKINADA",reportingTo:"KRUPAKAR REDDY"},
    {sno:15,name:"JAGAN RAJA",designation:"AREA BUSINESS MANAGER",hq:"MADURAI",reportingTo:"S SRINIVASA RAMANAN"},
    {sno:16,name:"JAYASANKAR L",designation:"SENIOR BUSINESS EXECUTIVE",hq:"PONDICHERRY",reportingTo:"TAMIZHVENDAN D"},
    {sno:17,name:"JEETENDRA MAURYA",designation:"AREA BUSINESS MANAGER",hq:"MUMBAI",reportingTo:"RAMAKANT PANDEY"},
    {sno:18,name:"JYOTHISH KUMAR PB",designation:"BUSINESS EXECUTIVE",hq:"TRIVANDRUM",reportingTo:"VISHNU HARIDAS"},
    {sno:19,name:"KAGITALA PAPA RAO",designation:"BUSINESS EXECUTIVE",hq:"VIJAYAWADA",reportingTo:"GUNAPARTHI RAVIKUMAR"},
    {sno:20,name:"KAJA CHANDRA MOULI",designation:"BUSINESS EXECUTIVE",hq:"VISAKHAPATNAM",reportingTo:"GUNAPARTHI RAVIKUMAR"},
    {sno:21,name:"KANNAN RAMASAMY",designation:"BUSINESS EXECUTIVE",hq:"TRICHY",reportingTo:"S BASKAR"},
    {sno:22,name:"KIRANLAL T K",designation:"AREA BUSINESS MANAGER",hq:"ERNAKULAM",reportingTo:"VISHNU HARIDAS"},
    {sno:23,name:"KRUPAKAR REDDY",designation:"REGIONAL BUSINESS MANAGER",hq:"HYDERABAD",reportingTo:"SAMUEL PUSHPARAJ P"},
    {sno:24,name:"MAHESH YADAV",designation:"ZONAL BUSINESS MANAGER",hq:"MUMBAI",reportingTo:"admin"},
    {sno:25,name:"MITHUN M P",designation:"BUSINESS EXECUTIVE",hq:"KANNUR",reportingTo:"ROOVITH P V"},
    {sno:26,name:"OGULAVENI VAMSHI",designation:"BUSINESS EXECUTIVE",hq:"HYDERABAD",reportingTo:"THULSIRAM"},
    {sno:27,name:"PADMA SAIKUMAR",designation:"BUSINESS EXECUTIVE",hq:"WARANGAL",reportingTo:"THULSIRAM"},
    {sno:28,name:"PASUPULA MURALI",designation:"BUSINESS EXECUTIVE",hq:"KURNOOL",reportingTo:"VENKATA RAVI KIRAN"},
    {sno:29,name:"PRADHAP P",designation:"BUSINESS EXECUTIVE",hq:"COIMBATORE",reportingTo:"S BASKAR"},
    {sno:30,name:"PRANAV RAMESAN",designation:"BUSINESS EXECUTIVE",hq:"KOTTAYAM",reportingTo:"VISHNU HARIDAS"},
    {sno:31,name:"PREETAM KUMAR NIRMAL",designation:"BUSINESS EXECUTIVE",hq:"MUMBAI SOUTH",reportingTo:"JEETENDRA MAURYA"},
    {sno:32,name:"RAGUL V",designation:"BUSINESS EXECUTIVE",hq:"CHENNAI",reportingTo:"TAMIZHVENDAN D"},
    {sno:33,name:"RAMAKANT PANDEY",designation:"REGIONAL BUSINESS MANAGER",hq:"MUMBAI",reportingTo:"MAHESH YADAV"},
    {sno:34,name:"RAMASAMY M",designation:"BUSINESS EXECUTIVE",hq:"TIRUNELVELI",reportingTo:"JAGAN RAJA"},
    {sno:35,name:"RAMASHANKAR DWARIKANATH GUPTA",designation:"BUSINESS EXECUTIVE",hq:"MUMBAI-ANDHERI DOWN TRACK",reportingTo:"JEETENDRA MAURYA"},
    {sno:36,name:"RAMU NIRMAL",designation:"BUSINESS EXECUTIVE",hq:"MUMBAI",reportingTo:"JEETENDRA MAURYA"},
    {sno:37,name:"RANJITH KUMAR",designation:"BUSINESS EXECUTIVE",hq:"TIRUPATHY",reportingTo:"VENKATA RAVI KIRAN"},
    {sno:38,name:"ROOVITH P V",designation:"AREA BUSINESS MANAGER",hq:"CALICUT",reportingTo:"VISHNU HARIDAS"},
    {sno:39,name:"S BASKAR",designation:"AREA BUSINESS MANAGER",hq:"COIMBATORE",reportingTo:"S SRINIVASA RAMANAN"},
    {sno:40,name:"S SRINIVASA RAMANAN",designation:"REGIONAL BUSINESS MANAGER",hq:"CHENNAI",reportingTo:"SAMUEL PUSHPARAJ P"},
    {sno:41,name:"SAMUEL PUSHPARAJ P",designation:"ZONAL BUSINESS MANAGER",hq:"CHENNAI",reportingTo:"PTK KANNAN"},
    {sno:42,name:"SHAIK SUBAHANI BASHA",designation:"BUSINESS EXECUTIVE",hq:"GUNTUR",reportingTo:"VENKATA RAVI KIRAN"},
    {sno:43,name:"SIVANANTHAM",designation:"BUSINESS EXECUTIVE",hq:"MADURAI",reportingTo:"JAGAN RAJA"},
    {sno:44,name:"SOORAJ VP",designation:"BUSINESS EXECUTIVE",hq:"PERINTHALMANNA",reportingTo:"ROOVITH P V"},
    {sno:45,name:"SRIPANI UPENDRA",designation:"BUSINESS EXECUTIVE",hq:"KAKINADA",reportingTo:"GUNAPARTHI RAVIKUMAR"},
    {sno:46,name:"SUDHAKAR JADHAV",designation:"BUSINESS EXECUTIVE",hq:"MUMBAI-NAVIMUMBAI",reportingTo:"VARUN KUMAR PANDEY"},
    {sno:47,name:"TAMIL ARASAN R",designation:"BUSINESS EXECUTIVE",hq:"CHENNAI",reportingTo:"TAMIZHVENDAN D"},
    {sno:48,name:"TAMIZHVENDAN D",designation:"AREA BUSINESS MANAGER",hq:"CHENNAI",reportingTo:"S SRINIVASA RAMANAN"},
    {sno:49,name:"THULSIRAM",designation:"AREA BUSINESS MANAGER",hq:"HYDERABAD",reportingTo:"KRUPAKAR REDDY"},
    {sno:50,name:"UDHAYAKUMAR KUBERAN",designation:"BUSINESS EXECUTIVE",hq:"CHENNAI",reportingTo:"TAMIZHVENDAN D"},
    {sno:51,name:"VARUN KUMAR PANDEY",designation:"AREA BUSINESS MANAGER",hq:"MUMBAI",reportingTo:"RAMAKANT PANDEY"},
    {sno:52,name:"VENKATA RAVI KIRAN",designation:"AREA BUSINESS MANAGER",hq:"TIRUPATHY",reportingTo:"KRUPAKAR REDDY"},
    {sno:53,name:"VISHNU HARIDAS",designation:"REGIONAL BUSINESS MANAGER",hq:"ERNAKULAM",reportingTo:"VIVEKANAND N A"}
  ]
};

const designationColors: Record<string, string> = {
  "ZONAL BUSINESS MANAGER": "#7c3aed",
  "REGIONAL BUSINESS MANAGER": "#2563eb",
  "AREA BUSINESS MANAGER": "#0891b2",
  "BUSINESS EXECUTIVE": "#10b981",
  "SENIOR BUSINESS EXECUTIVE": "#059669",
  "SALES MANAGER": "#d97706",
  "MARKETING HEAD": "#db2777",
  "BUSINESS HEAD": "#dc2626",
  "BUSINESS RELATIONSHIP MANAGER SOUTH INDIA": "#9333ea"
};

const categoryColors: Record<string, string> = {
  "ANTI-ALLERGY":"#3b82f6","ANTI-GLAUCOMA":"#10b981","TEAR SUBSTITUTE":"#06b6d4",
  "NSAID":"#f59e0b","CORTICOSTEROID":"#8b5cf6","ANTI-OXIDANT":"#ec4899",
  "ANTI-INFECTIVE":"#ef4444","ANTI-INFECTIVE+STEROID COMB":"#f97316",
  "STERILE WIPES":"#6b7280","SPREADING AGENT":"#84cc16"
};

function DesignationBadge({ designation }: { designation: string }) {
  const short = designation.replace("BUSINESS EXECUTIVE","BE").replace("AREA BUSINESS MANAGER","ABM").replace("REGIONAL BUSINESS MANAGER","RBM").replace("ZONAL BUSINESS MANAGER","ZBM").replace("SALES MANAGER","SM").replace("MARKETING HEAD","MH").replace("BUSINESS HEAD","BH").replace("SENIOR BUSINESS EXECUTIVE","Sr. BE");
  const color = designationColors[designation] ?? "#6b7280";
  return (
    <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:"999px", fontSize:"11px", fontWeight:600, background:`${color}15`, color, border:`1px solid ${color}25`, whiteSpace:"nowrap" }}>
      {short}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const color = categoryColors[category] ?? "#6b7280";
  return <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:"999px", fontSize:"11px", fontWeight:600, background:`${color}18`, color, border:`1px solid ${color}30` }}>{category}</span>;
}

function FieldForceView({ subdivisionName, onBack }: { subdivisionName: string; onBack: () => void }) {
  const rows = fieldforcewiseData[subdivisionName] ?? [];
  const [search, setSearch] = useState("");
  const designations = [...new Set(rows.map(r => r.designation))];
  const filtered = rows.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.hq.toLowerCase().includes(search.toLowerCase()) || r.designation.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Subdivision — FieldForce View</p>
          <h2>{subdivisionName}</h2>
          <p>{rows.length} field force members across {designations.length} designations</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-stats" style={{ marginBottom:"20px" }}>
        <article><span>Total Field Force</span><strong>{rows.length}</strong></article>
        <article><span>Designation Types</span><strong>{designations.length}</strong></article>
        <article><span>Sub-Division</span><strong>{subdivisionName}</strong></article>
      </div>
      <div style={{ marginBottom:"16px" }}>
        <input
          placeholder="Search by name, HQ or designation..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width:"100%", maxWidth:"360px", padding:"8px 14px", borderRadius:"8px", border:"1px solid #e5e7eb", fontSize:"14px", outline:"none" }}
        />
      </div>
      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr><th>S.No</th><th>FieldForce Name</th><th>Designation</th><th>HQ</th><th>Reporting To</th></tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.sno}>
                <td style={{ color:"#9ca3af", fontWeight:500 }}>{r.sno}</td>
                <td><strong style={{ color:"#111827" }}>{r.name}</strong></td>
                <td><DesignationBadge designation={r.designation} /></td>
                <td><span style={{ display:"inline-block", padding:"2px 8px", borderRadius:"6px", background:"#f3f4f6", fontSize:"12px", fontWeight:600, color:"#374151" }}>{r.hq}</span></td>
                <td style={{ fontSize:"13px", color:"#6b7280" }}>{r.reportingTo}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} style={{ textAlign:"center", color:"#9ca3af", padding:"32px" }}>No results found</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ProductwiseView({ subdivisionName, onBack }: { subdivisionName: string; onBack: () => void }) {
  const products = productwiseData[subdivisionName] ?? [];
  const categories = [...new Set(products.map(p => p.category))];
  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Subdivision — Productwise View</p>
          <h2>{subdivisionName}</h2>
          <p>{products.length} products across {categories.length} categories</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-stats" style={{ marginBottom:"20px" }}>
        <article><span>Total Products</span><strong>{products.length}</strong></article>
        <article><span>Categories</span><strong>{categories.length}</strong></article>
        <article><span>Sub-Division</span><strong>{subdivisionName}</strong></article>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"16px" }}>
        {categories.map(cat => <CategoryBadge key={cat} category={cat} />)}
      </div>
      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead><tr><th>S.No</th><th>Product Name</th><th>Description</th><th>Sale Unit</th><th>Category</th><th>Group</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.sno}>
                <td style={{ color:"#9ca3af", fontWeight:500 }}>{p.sno}</td>
                <td><strong style={{ color:"#111827" }}>{p.productName}</strong></td>
                <td style={{ color:"#6b7280", fontSize:"13px" }}>{p.description}</td>
                <td><span style={{ display:"inline-block", padding:"2px 8px", borderRadius:"6px", background:"#f3f4f6", fontSize:"12px", fontWeight:600, color:"#374151" }}>{p.saleUnit}</span></td>
                <td><CategoryBadge category={p.category} /></td>
                <td><span style={{ display:"inline-block", padding:"2px 8px", borderRadius:"6px", background:"#eff6ff", fontSize:"12px", fontWeight:700, color:"#2563eb" }}>{p.group}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DeleteConfirmDialog({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#fff", borderRadius:"16px", padding:"32px 28px", maxWidth:"400px", width:"90%", boxShadow:"0 20px 60px rgba(0,0,0,0.18)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"12px" }}>
          <span style={{ background:"#fef2f2", borderRadius:"50%", width:"44px", height:"44px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Trash2 size={20} color="#ef4444" />
          </span>
          <div>
            <h3 style={{ margin:0, fontSize:"17px", fontWeight:700, color:"#111827" }}>Deactivate Sub-Division?</h3>
            <p style={{ margin:"4px 0 0", fontSize:"13px", color:"#6b7280" }}>This action cannot be undone.</p>
          </div>
        </div>
        <p style={{ fontSize:"14px", color:"#374151", margin:"0 0 24px", lineHeight:1.6 }}>
          Are you sure you want to deactivate <strong>{name}</strong>? All associated product and fieldforce mappings will be affected.
        </p>
        <div style={{ display:"flex", gap:"10px", justifyContent:"flex-end" }}>
          <button className="button button-secondary" onClick={onCancel} type="button">Cancel</button>
          <button onClick={onConfirm} type="button" style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 18px", borderRadius:"8px", border:"none", background:"#ef4444", color:"#fff", fontWeight:600, fontSize:"14px", cursor:"pointer" }}>
            <Trash2 size={14} /> Yes, Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}

export function SubdivisionMaster() {
  const [rows, setRows] = useState(initialRows);
  const [inlineEditId, setInlineEditId] = useState<number | null>(null);
  const [draftRow, setDraftRow] = useState<SubdivisionRow | null>(null);
  const [formRow, setFormRow] = useState<SubdivisionRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SubdivisionRow | null>(null);
  const [productwiseTarget, setProductwiseTarget] = useState<string | null>(null);
  const [fieldforcewiseTarget, setFieldforcewiseTarget] = useState<string | null>(null);

  function beginInlineEdit(row: SubdivisionRow) { setInlineEditId(row.id); setDraftRow({ ...row }); setFormRow(null); }
  function cancelInlineEdit() { setInlineEditId(null); setDraftRow(null); }
  function updateInlineEdit() { if (!draftRow) return; setRows(c => c.map(r => r.id === draftRow.id ? draftRow : r)); cancelInlineEdit(); }
  function openEditForm(row: SubdivisionRow) { setFormRow({ ...row }); cancelInlineEdit(); }
  function openAddForm() { setFormRow({ id: Math.max(...rows.map(r => r.id)) + 1, code:"", shortName:"", subdivisionName:"", productwiseCount:0, fieldforcewiseCount:0 }); cancelInlineEdit(); }
  function saveForm() { if (!formRow) return; setRows(c => { const exists = c.some(r => r.id === formRow.id); return exists ? c.map(r => r.id === formRow.id ? formRow : r) : [...c, formRow]; }); setFormRow(null); }
  function confirmDelete() { if (!deleteTarget) return; setRows(c => c.filter(r => r.id !== deleteTarget.id)); setDeleteTarget(null); }

  if (fieldforcewiseTarget) return <FieldForceView subdivisionName={fieldforcewiseTarget} onBack={() => setFieldforcewiseTarget(null)} />;
  if (productwiseTarget) return <ProductwiseView subdivisionName={productwiseTarget} onBack={() => setProductwiseTarget(null)} />;

  if (formRow) {
    return (
      <section className="subdivision-console">
        <div className="subdivision-head">
          <div><p className="subdivision-eyebrow">Master Setup</p><h2>{formRow.code ? "Edit Sub-Division" : "Add Sub-Division"}</h2><p>Maintain short names and display names used across product and fieldforce mappings.</p></div>
          <button className="button button-secondary" onClick={() => setFormRow(null)} type="button"><RotateCcw size={16} /> Back</button>
        </div>
        <div className="subdivision-form-card">
          <label className="field"><span>Short Name</span><input autoFocus value={formRow.shortName} onChange={e => setFormRow({ ...formRow, shortName: e.target.value })} /></label>
          <label className="field"><span>Sub-Division Name</span><input value={formRow.subdivisionName} onChange={e => setFormRow({ ...formRow, subdivisionName: e.target.value })} /></label>
          <button className="button" onClick={saveForm} type="button"><Check size={16} /> Save</button>
        </div>
      </section>
    );
  }

  return (
    <>
      {deleteTarget && <DeleteConfirmDialog name={deleteTarget.subdivisionName} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />}
      <section className="subdivision-console">
        <div className="subdivision-head">
          <div><p className="subdivision-eyebrow">Master Setup</p><h2>Sub-Division</h2><p>Create and manage business subdivisions used for product and fieldforce mapping.</p></div>
          <div className="subdivision-actions">
            <button className="button button-secondary" type="button"><SlidersHorizontal size={16} /> Filters</button>
            <button className="button" onClick={openAddForm} type="button"><Plus size={16} /> Add</button>
          </div>
        </div>
        <div className="subdivision-stats">
          <article><span>Total Sub-Divisions</span><strong>{rows.length}</strong></article>
          <article><span>Productwise Count</span><strong>{rows.reduce((s,r) => s+r.productwiseCount, 0)}</strong></article>
          <article><span>Fieldforcewise Count</span><strong>{rows.reduce((s,r) => s+r.fieldforcewiseCount, 0)}</strong></article>
        </div>
        <div className="subdivision-table-card">
          <table className="subdivision-table">
            <thead>
              <tr><th>S.No</th><th>Short Name</th><th>Sub Division Name</th><th>Productwise Count</th><th>Fieldforcewise Count</th><th>Inline Edit</th><th>Edit</th><th>Products</th><th>Field Force</th><th>Deactivate</th></tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const editing = inlineEditId === row.id && draftRow;
                return (
                  <tr key={row.id}>
                    <td>{index + 1}</td>
                    <td>{editing ? <input className="subdivision-inline-input" value={draftRow.shortName} onChange={e => setDraftRow({ ...draftRow, shortName: e.target.value })} /> : row.shortName}</td>
                    <td>{editing ? <input className="subdivision-inline-input" value={draftRow.subdivisionName} onChange={e => setDraftRow({ ...draftRow, subdivisionName: e.target.value })} /> : row.subdivisionName}</td>
                    <td>{row.productwiseCount}</td>
                    <td>{row.fieldforcewiseCount}</td>
                    <td>
                      {editing ? (
                        <span className="subdivision-inline-actions">
                          <button aria-label="Update" onClick={updateInlineEdit} title="Update" type="button"><Check size={15} /></button>
                          <button aria-label="Cancel" onClick={cancelInlineEdit} title="Cancel" type="button"><X size={15} /></button>
                        </span>
                      ) : (
                        <button className="subdivision-icon-button" onClick={() => beginInlineEdit(row)} title="Inline Edit" type="button"><Pencil size={15} /></button>
                      )}
                    </td>
                    <td><button className="subdivision-icon-button" onClick={() => openEditForm(row)} title="Edit" type="button"><Pencil size={15} /></button></td>
                    <td>
                      <button className="subdivision-icon-button" onClick={() => setProductwiseTarget(row.subdivisionName)} title="View Products" type="button" style={{ color:"#2563eb", display:"flex", alignItems:"center", gap:"2px" }}>
                        <Package size={15} /><ChevronRight size={13} />
                      </button>
                    </td>
                    <td>
                      <button className="subdivision-icon-button" onClick={() => setFieldforcewiseTarget(row.subdivisionName)} title="View Field Force" type="button" style={{ color:"#7c3aed", display:"flex", alignItems:"center", gap:"2px" }}>
                        <Users size={15} /><ChevronRight size={13} />
                      </button>
                    </td>
                    <td><button className="subdivision-danger-button" onClick={() => setDeleteTarget(row)} title="Deactivate" type="button"><Trash2 size={15} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

// ─── Standalone Productwise View (for direct tab routing) ───────────────────

export function SubdivisionProductwise() {
  const [selected, setSelected] = useState<string>("ZIVIRA LABS");
  const subdivisions = Object.keys(productwiseData);
  const products = productwiseData[selected] ?? [];
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Subdivision — Productwise View</p>
          <h2>View - Productwise</h2>
          <p>Select a sub-division to view its product listing.</p>
        </div>
      </div>

      {/* Sub-division selector */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {subdivisions.map(name => (
          <button
            key={name}
            onClick={() => setSelected(name)}
            type="button"
            style={{
              padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer",
              fontWeight: 600, fontSize: "13px",
              background: selected === name ? "#10b981" : "#f3f4f6",
              color: selected === name ? "#fff" : "#374151"
            }}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="subdivision-stats" style={{ marginBottom: "20px" }}>
        <article><span>Total Products</span><strong>{products.length}</strong></article>
        <article><span>Categories</span><strong>{categories.length}</strong></article>
        <article><span>Sub-Division</span><strong>{selected}</strong></article>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
        {categories.map(cat => <CategoryBadge key={cat} category={cat} />)}
      </div>

      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr><th>S.No</th><th>Product Name</th><th>Description</th><th>Sale Unit</th><th>Category</th><th>Group</th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.sno}>
                <td style={{ color: "#9ca3af", fontWeight: 500 }}>{p.sno}</td>
                <td><strong style={{ color: "#111827" }}>{p.productName}</strong></td>
                <td style={{ color: "#6b7280", fontSize: "13px" }}>{p.description}</td>
                <td><span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "6px", background: "#f3f4f6", fontSize: "12px", fontWeight: 600, color: "#374151" }}>{p.saleUnit}</span></td>
                <td><CategoryBadge category={p.category} /></td>
                <td><span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "6px", background: "#eff6ff", fontSize: "12px", fontWeight: 700, color: "#2563eb" }}>{p.group}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Standalone Fieldforcewise View (for direct tab routing) ─────────────────

export function SubdivisionFieldforcewise() {
  const [selected, setSelected] = useState<string>("ZIVIRA LABS");
  const [search, setSearch] = useState("");
  const subdivisions = Object.keys(fieldforcewiseData);
  const rows = fieldforcewiseData[selected] ?? [];
  const designations = [...new Set(rows.map(r => r.designation))];
  const filtered = rows.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.hq.toLowerCase().includes(search.toLowerCase()) ||
    r.designation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Subdivision — FieldForce View</p>
          <h2>View - Field Forcewise</h2>
          <p>Select a sub-division to view its field force members.</p>
        </div>
      </div>

      {/* Sub-division selector */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {subdivisions.map(name => (
          <button
            key={name}
            onClick={() => { setSelected(name); setSearch(""); }}
            type="button"
            style={{
              padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer",
              fontWeight: 600, fontSize: "13px",
              background: selected === name ? "#10b981" : "#f3f4f6",
              color: selected === name ? "#fff" : "#374151"
            }}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="subdivision-stats" style={{ marginBottom: "20px" }}>
        <article><span>Total Field Force</span><strong>{rows.length}</strong></article>
        <article><span>Designation Types</span><strong>{designations.length}</strong></article>
        <article><span>Sub-Division</span><strong>{selected}</strong></article>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by name, HQ or designation..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", maxWidth: "360px", padding: "8px 14px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none" }}
        />
      </div>

      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr><th>S.No</th><th>FieldForce Name</th><th>Designation</th><th>HQ</th><th>Reporting To</th></tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.sno}>
                <td style={{ color: "#9ca3af", fontWeight: 500 }}>{r.sno}</td>
                <td><strong style={{ color: "#111827" }}>{r.name}</strong></td>
                <td><DesignationBadge designation={r.designation} /></td>
                <td><span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "6px", background: "#f3f4f6", fontSize: "12px", fontWeight: 600, color: "#374151" }}>{r.hq}</span></td>
                <td style={{ fontSize: "13px", color: "#6b7280" }}>{r.reportingTo}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "#9ca3af", padding: "32px" }}>No results found</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
