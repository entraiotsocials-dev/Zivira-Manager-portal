"use client";

import type { Employee } from "@zivira/types";
import { Bell, CalendarDays, Check, ChevronDown, Download, Eye, Pencil, Phone, Plus, RefreshCw, Target, UserRound, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/api-client";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 2016 + 1 }, (_, index) => String(currentYear - index));
const fieldForceOptions = `
admin | admin - Admin -
MGR1023 | PT KUMARAN - BH - MUMBAI
MGR1028 | VIVEKANAND N A - ZBM - ERNAKULAM
MGR2250 | VISHNU HARIDAS - RBM - ERNAKULAM
MGR1669 | KIRANLAL T K - ABM - ERNAKULAM
MR4924 | GANESH D - BE - ERNAKULAM
MR7693 | BIBIN K M - BE - TRICHUR
MR7716 | AMAL PG - BE - ERNAKULAM
MGR2674 | ROOVITH P V - ABM - CALICUT
MR2947 | MITHUN M P - BE - KANNUR
MR5570 | ADHARSH T P - BE - CALICUT
MR6169 | SOORAJ VP - BE - PERINTHALMANNA
MR2948 | PRANAV RAMESAN - BE - KOTTAYAM
MR5037 | JYOTHISH KUMAR PB - BE - TRIVANDRUM
MR7670 | AMEERKHAN  - BE - KOLLAM
MR8394 | Akhil Thankachan  - BE - Alleppey
MGR2672 | VINAYAK BHAT - RBM - ERNAKULAM
MGR2953 | SIBIN N - ABM - TRIVANDRUM
MR6319 | AJMAL B - BE - KOLLAM
MR7711 | GIREESH KAMMATH  - BE - KOTTAYAM
MR7712 | VAISHNAV V - BE - TRIVANDRUM
MGR2954 | SANDEEP R SHENOY - ABM - ERNAKULAM
MR2949 | NEERAJ M - BE - TRICHUR
MR4925 | BALAKRISHNA SHENOY  - BE - ERNAKULAM
MR7702 | JAYARAM J PAI - BE - ERNAKULAM
MGR2955 | JITHESH K  - ABM - CALICUT
MR7696 | ABHISHEK P  - BE - PERINTHALMANNA
MR7710 | SREESHAG T P  - BE - CALICUT
MR7746 | AMITH K - BE - KANNUR
MGR1906 | MADHUSUDAN SAHNI - NBM - DELHI
MGR1907 | GURDEEP ARORA - ZBM - DELHI
MGR1908 | RAKESH RANJAN JHA - RBM - DELHI
MGR2654 | GAURAV SINGH - ABM - LUCKNOW
MR7644 | AJIT  MISHRA - BE - VARANASI
MR7683 | RAKESH KUMAR - BE - LUCKNOW
MR7739 | SHIVAM RAO - BE - GORAKHPUR
MR7797 | PANKAJ KUMAR YADAV - BE - LUCKNOW
MR6029 | TOOSEEF MALLIK - BE - DEHRADUN
MR6222 | VARUN - BE - MEERUT
MGR1909 | ANUJ KUMAR - RBM - DELHI
MGR2677 | SHUBHAM SHARMA ABM - ABM - DELHI (NORTH)
MR5573 | RAHUL MISHRA - BE - DELHI
MR5575 | SAURABH  WALIA - BE - DELHI (NORTH)
MR5632 | DEEPAK KUMAR JHA - BE - DELHI (CENTRAL)
MR5688 | SACHIN KUMAR SHARMA - BE - GURGAON
MGR2879 | SHIVANSHU CHITKARA - ABM - DELHI
MR5574 | JATIN - BE - ROHTAK
MR5576 | PIYUSH KUMAR  - BE - DELHI
MR5631 | VIPIN KUMAR - BE - DELHI (AIMS)
MR5637 | VIVEK THAKUR - BE - DELHI (SOUTH)
MGR1911 | RAJAN SHARMA ABM - ABM - AMRITSAR
MR6356 | RAJAN SHARMA BE - BE - AMRITSAR
MR7732 | ASHISH CHAWLA - BE - BATINDA
MR7768 | SHAHNAWAZ SIDIQ KHAN - BE - SRINAGAR
MGR2624 | RAMAKANT SHARMA  - ABM - JAIPUR
MR7561 | SACHIN RAJPUROHIT - BE - JODHPUR
MR7562 | MANOJ JANGID - Sr BE  - AJMER
MR8293 | MOHIT SHARMA - BE - JAIPUR
MGR2678 | GURSHARAN SINGH CHEEMA - ABM - LUDHIANA
MR5577 | JASPREET SINGH  - BE - LUDHIANA
MR6458 | PRIYANKA - BE - JALANDHAR
MR7365 | VISHAL GIRI - BE - CHANDIGARH
MR7700 | MANIK NANDA - BE - CHANDIGARH
MGR1948 | VIPIN KUMAR DUBEY - RBM - MUMBAI
MGR2547 | GANESH SURESH PAWAR  - ABM - THANE
MR7315 | MANISH KUMAR SINGH - BE - THANE
MR7640 | ANIKET SINGH - BE - MUMBAI-CENTRAL TRACK
MR7641 | ROHIT  SHUKLA  - BE - MUMBAI-NAVIMUMBAI
MGR2549 | DHARMENDRA RAJENDRA PRASAD  VISHWAKARMA - ABM - MUMBAI
MR5641 | LALIT GOUD - BE - MUMBAI-WESTERN TRACK
MR7639 | AKASH MISHRA  - BE - MUMBAI-BORIVALI UP TRACK
MR7660 | ASHISH KUMAR YADAV  - BE - MUMBAI
MR7685 | RAHUL KUMAR YADAV - BE - MUMBAI SOUTH
MGR2763 | CATHERINE DANAN  - MH - adminzivira
MGR2768 | JOYDEEP BANERJEE - SM - KOLKATA
MGR2769 | BARUN ROY CHOWDHURY - RBM - KOLKATA
MGR2770 | SANTU KUMAR DAS  - ABM - KOLKATA
MR7925 | SANGITA BRAHMA  - BE - KOLKATA
MR7934 | ANKUR  PAL - BE - MIDINAPORE
MR7939 | SOURAV DAS - BE - KOLKATA
MR8329 | SWARAJ KUMAR SAMANTA - BE - MIDINAPORE
MGR2773 | KIRAN KUMAR SUBUDHI - ABM - BHUBANESWAR
MR7938 | MANAS KUMAR SWAIN - BE - BHUBANESWAR
MR8141 | LALIT RANJAN BHATTACHARYA - BE - BHUBANESWAR
MR8155 | SAURABH KUMAR - BE - RANCHI
MR8244 | PRANGYA PARAMITA DASH - BE - CUTTACK
MGR2774 | KOYEL CHAKRA  - ABM - KOLKATA
MR7940 | SUMIT MITRA  - BE - KOLKATA
MR8163 | DIBAKAR KUMAR DAS - BE - BARRACKPORE
MR8318 | RONY MANDAL  - BE - KOLKATA
MGR2921 | ARUNAVA CHAKRABORTY - ABM - KOLKATA
MR7932 | SUBHANKAR SINGH  - BE - HOOGHLY
MR7936 | SOUVIK PAUL  - BE - KOLKATA
MR7937 | SUBHANKAR DAS - BE - HOWRAH
MR8314 | RITAM GHOSH - BE - KOLKATA
MGR2775 | BIDESH BASAK  - RBM - GUWAHATI
MGR2771 | RAJIB KONER  - ABM - BURDWAN
MR7933 | RAHUL SINHA  - BE - DHANBAD
MR7935 | ROHAN MUKHERJEE - BE - BERHAMPUR
MR7942 | SOHAM ROY - BE - BURDWAN
MR8210 | AMIT SWAR - BE - SILIGURI
MR8326 | ROHAN MUKHERJEE - BE - BERHAMPUR
MGR2846 | AHAMMAD ALI - ABM - GUWAHATI
MR7941 | SOMNATH DAS - BE - SILCHAR
MR8142 | RIYAJUL  ISLAM - BE - GUWAHATI
MR8214 | KUSHU BHOWMIK  - BE - GUWAHATI
MR8255 | Somnath Das - BE - SILCHAR
MGR2911 | SHUBHAM KUMAR PANDEY - ABM - PATNA
MR8309 | AKSHAY KUMAR - BE - PATNA
MR8313 | RAUSHAN KUMAR - BE - PATNA
MR8389 | Vacant - BE - MUZAFFARPUR
MGR1024 | PTK KANNAN - BRM - CHENNAI
MGR1025 | SSIVANESAN - SM - CHENNAI
MGR1027 | MARIAPPAN K - RBM - MADURAI
MGR2393 | M RENGANATHAN - ABM - MADURAI
MR2939 | AROCKIA RAJ L - BE - TIRUNELVELI
MR2940 | KATHIRVEL S - BE - MADURAI
MR2945 | KUMAR S - BE - MADURAI
MGR2668 | SRIDHAR R - ABM - CHENNAI
MR4797 | IMTHIYAZ AHMED  M Y  - BE - CHENNAI
MR7649 | SANTHOSH KUMAR - BE - CHENNAI
MR7650 | SULAIMAN - BE - CHENNAI
MR7715 | ARUL SELVAM ARCHUNAN - BE - PONDICHERRY
MGR2669 | M SIVAKUMAR - ABM - COIMBATORE
MR2942 | SIVAKUMAR.M - Promoted - BE - COIMBATORE
MR7652 | SANTHANU V S - BE - COIMBATORE
MR7657 | RAGHAVAN M - BE - SALEM
MR7661 | MURALI  - BE - TRICHY
MGR1714 | RAVISANKAR DUVVA - RBM - HYDERABAD
MGR2164 | HEMANTH KUMAR K - ABM - TIRUPATHY
MR4922 | THANDLAM JASWANTH REDDY - BE - TIRUPATHY
MR5197 | MEKALA SRIKANTH - BE - GUNTUR
MR7758 | SURYANK T - BE - KURNOOL
MGR2666 | NAGARAJU K   - ABM - HYDERABAD
MR5193 | KOMIRE  HARSHAVARDHAN  - BE - HYDERABAD
MR7651 | SIRIMALLA PREM KUMAR - BE - HYDERABAD
MR7677 | BADDAM ANIL  - BE - HYDERABAD
MGR2670 | SHAFIULLA QURESHI - ABM - VIJAYAWADA
MR4923 | INUMARTHI VENKATA SATISH - BE - VISAKHAPATNAM
MR5036 | SARIDEY PHANEESWAR - BE - KAKINADA
MR5038 | HASSAIN BAIG - BE - VIJAYAWADA
MR5234 | P BALAKRISHNA - BE - WARANGAL
MGR1026 | SAMUEL PUSHPARAJ P - ZBM - CHENNAI
MGR1029 | S SRINIVASA RAMANAN - RBM - CHENNAI
MGR1030 | TAMIZHVENDAN D - ABM - CHENNAI
MR2941 | UDHAYAKUMAR KUBERAN - BE - CHENNAI
MR2944 | JAYASANKAR  L - Sr BE  - PONDICHERRY
MR4796 | RAGUL V  - BE - CHENNAI
MR7668 | TAMIL ARASAN R - BE - CHENNAI
MGR2671 | S BASKAR - ABM - COIMBATORE
MR3158 | KANNAN RAMASAMY - BE - TRICHY
MR7647 | PRADHAP P - BE - COIMBATORE
MR7658 | ARUL ANANTH KUMAR - BE - SALEM
MGR2679 | JAGAN RAJA  - ABM - MADURAI
MR7646 | ARAVINTH SENTHIL KUMAR - BE - MADURAI
MR7694 | RAMASAMY M - BE - TIRUNELVELI
MR7695 | SIVANANTHAM - BE - MADURAI
MGR2833 | KRUPAKAR REDDY - RBM - HYDERABAD
MGR2113 | THULSIRAM - ABM - HYDERABAD
MR5199 | OGULAVENI  VAMSHI  - BE - HYDERABAD
MR7665 | PADMA SAIKUMAR - BE - WARANGAL
MR7667 | DHEETI JAGAN - BE - HYDERABAD
MR7682 | ANIL ANJAYA - BE - HYDERABAD
MGR2282 | GUNAPARTHI RAVIKUMAR - ABM - KAKINADA
MR7643 | KAJA CHANDRA MOULI - BE - VISAKHAPATNAM
MR7645 | KAGITALA PAPA RAO - BE - VIJAYAWADA
MR7666 | SRIPANI UPENDRA - BE - KAKINADA
MGR2665 | VENKATA RAVI KIRAN - ABM - TIRUPATHY
MR4921 | PASUPULA MURALI   - BE - KURNOOL
MR5122 | SHAIK SUBAHANI BASHA - BE - GUNTUR
MR7684 | RANJITH KUMAR - BE - TIRUPATHY
MGR1918 | HEAD OFFICE - MH - MUMBAI
MGR1946 | MAHESH YADAV - ZBM - MUMBAI
MGR1947 | SUNIL VISHWAKARMA - RBM - PUNE
MGR2438 | SHARAD LAXMAN THORVE - ABM - PUNE
MR5889 | ATMALING GURULING SUTAR - BE - PUNE
MR7093 | RAHUL BHARAT RAUT - BE - PUNE
MR7116 | SHAHJI PATIL - BE - KOLHAPUR
MR8377 | KISHORE MACHINDRA PANGARE - BE - adminzivira
MGR2736 | SAMEER HIWARKAR - ABM - Aurangabad
MR6409 | GAURAV PRAVIN YEWALE - BE - NASHIK
MR6899 | BHUKTAR SACHIN KONDIRAM - BE - Aurangabad
MR6915 | SACHIN H KULKARNI - BE - Nanded
MGR2378 | RAMAKANT PANDEY - RBM - MUMBAI
MGR2675 | JEETENDRA MAURYA - ABM - MUMBAI
MR5638 | ANSHU VISHWAKARMA - BE - MUMBAI-BORIVALI UP TRACK
MR5639 | RAMASHANKAR DWARIKANATH GUPTA - BE - MUMBAI-ANDHERI DOWN TRACK
MR5640 | RAMU NIRMAL - BE - MUMBAI
MR7687 | PREETAM KUMAR NIRMAL - BE - MUMBAI SOUTH
MGR2676 | VARUN KUMAR PANDEY - ABM - MUMBAI
MR6006 | SUDHAKAR JADHAV - BE - MUMBAI-NAVIMUMBAI
MR7659 | AJEET KUMAR PANDEY - BE - MUMBAI
MR7669 | DEVENDRA KUMAR SHUKLA - BE - THANE
MGR2548 | SANDEEP KUMAR SINGH - RBM - BHOPAL
MGR2963 | KALOO MANSORE - ABM - INDORE
MR3712 | SHUBHAM SHARMA BE - BE - INDORE
MR7342 | PRATIK SHARMA - BE - GWALIOR
MR8328 | BALARAM SINGH YADAV - BE - SAGAR
MR6355 | RANJEET GOUR - BE - BHOPAL
MR6904 | ROHIT SAHU - BE - Jabalpur
MR8339 | CHITRASEN BISEN - BE - RAIPUR
MGR2776 | JIGNESH RAMESHBHAI JADAV - RBM - AHMEDABAD
MGR2553 | RAVI K PAMNANI - ABM - SURAT
MGR2652 | MEHUL AJAYKUMAR PAREKH - ABM - AHEMADABAD
MR7610 | JALANDHARA VIJAYBHAI CHHAGANBHAI - BE - AHEMADABAD
MR7731 | RAVI R LATHIYA  - BE - RAJKOT
MR7734 | MEET PANCHAL - BE - AHEMADABAD
MGR2872 | RAVI K PAMNANI - ABM - SURAT
MR7357 | KAMLESH THAKUR - BE - BARODA
MR7460 | KALKANI NIKUNJKUMAR JAYSUKHBHAI - BE - SURAT
MGR2565 | ARUN KUMAR BOSE - RBM - BANGALORE
MGR1668 | ISAMADI  ABDUL ISAMADI  - ABM - HUBLI
MR4801 | PRASHANTH B J - BE - DAVANGERE
MR4802 | SUBANHAFIZ  - BE - GULBARGA
MR4810 | MALIKJAN SHEKH - BE - HUBLI
MGR2379 | THARUN CHOWDARY M S - ABM - BANGALORE
MR6259 | POLEPALLI OMKAR - BE - BANGALORE
MR7286 | PRAVEEN KUMAR S - BE - MYSORE
MR7648 | SANTHOH NAIK - BE - BANGALORE
MR8150 | PRASHANTHA NAIK H G - BE - BANGALORE
MGR2754 | AMEER  - ABM - BANGALORE
MR4799 | DAVOOD KHAN V - BE - BANGALORE
MR4803 | BRIJESH TM - BE - MANGALORE
MR7312 | ANIL KUMAR D - BE - BANGALORE
MR7893 | MAHESH R - BE - BANGALORE
`
  .trim()
  .split("\n")
  .map((line) => {
    const [code, label] = line.split("|").map((part) => part.trim());
    return { code, label };
  });

type SelectOption = {
  label: string;
  value: string;
};

function valueFromCode(code: string, offset: number, min: number, max: number) {
  const total = [...code].reduce((sum, char) => sum + char.charCodeAt(0), offset);
  return min + (total % (max - min + 1));
}

function StatusPill({ tone, children }: { tone: "success" | "warning" | "danger" | "neutral"; children: ReactNode }) {
  return <span className={`command-pill command-pill-${tone}`}>{children}</span>;
}

function CommandMetric({
  label,
  value,
  helper,
  tone,
  icon
}: {
  label: string;
  value: string;
  helper: string;
  tone: "violet" | "teal" | "amber" | "blue" | "purple";
  icon: ReactNode;
}) {
  return (
    <article className={`command-metric command-metric-${tone}`}>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{helper}</span>
      </div>
      <i>{icon}</i>
      <div className="command-meter"><span /></div>
    </article>
  );
}

function WeeklyTrend({ rows }: { rows: Array<{ label: string; value: number }> }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  const min = Math.min(...rows.map((r) => r.value), 0);
  const W = 520;
  const H = 120;
  const pad = { t: 10, r: 16, b: 32, l: 36 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const range = max - min || 1;

  const pts = rows.map((row, i) => ({
    x: pad.l + (i / (rows.length - 1)) * innerW,
    y: pad.t + (1 - (row.value - min) / range) * innerH,
    label: row.label,
    value: row.value
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${pts[pts.length - 1]!.x},${H - pad.b} L${pts[0]!.x},${H - pad.b} Z`;

  const yTicks = [min, Math.round((min + max) / 2), max];

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <linearGradient id="dcrGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Y grid lines */}
        {yTicks.map((tick) => {
          const y = pad.t + (1 - (tick - min) / range) * innerH;
          return (
            <g key={tick}>
              <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 3" />
              <text x={pad.l - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{tick}%</text>
            </g>
          );
        })}
        {/* Area fill */}
        <path d={areaPath} fill="url(#dcrGrad)" />
        {/* Line */}
        <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {/* Dots + labels */}
        {pts.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="4" fill="#10b981" stroke="#fff" strokeWidth="2" />
            <text x={p.x} y={H - pad.b + 14} textAnchor="middle" fontSize="11" fill="#6b7280">{p.label}</text>
            <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="10" fill="#10b981" fontWeight="600">{p.value}%</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function AttendanceSplit({ value }: { value: number }) {
  const leave = 100 - value;

  return (
    <div className="attendance-split">
      <div className="attendance-ring" style={{ background: `conic-gradient(#10b981 0 ${value}%, #f59e0b ${value}% 100%)` }}>
        <span>{value}%</span>
      </div>
      <div className="attendance-legend">
        <span><i /> Present ({value}%)</span>
        <span><i /> Leave ({leave}%)</span>
      </div>
    </div>
  );
}

function CommandSelect({
  id,
  options,
  value,
  onChange,
  openMenu,
  setOpenMenu,
  compact = false
}: {
  id: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  openMenu: string | null;
  setOpenMenu: (value: string | null) => void;
  compact?: boolean;
}) {
  const selected = options.find((option) => option.value === value) ?? options[0];
  const open = openMenu === id;

  return (
    <div className={`command-select ${compact ? "command-select-compact" : ""}`}>
      <button
        aria-expanded={open}
        className="command-select-button"
        onClick={() => setOpenMenu(open ? null : id)}
        type="button"
      >
        <span>{selected?.label}</span>
        <ChevronDown size={15} />
      </button>
      {open ? (
        <div className="command-select-menu">
          {options.map((option) => (
            <button
              className={option.value === value ? "command-select-option command-select-option-active" : "command-select-option"}
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpenMenu(null);
              }}
              type="button"
            >
              <span>{option.label}</span>
              {option.value === value ? <Check size={14} /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function AdminHomeDashboard() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeCode, setEmployeeCode] = useState(fieldForceOptions[0]?.code ?? "");
  const [month, setMonth] = useState("Apr");
  const [year, setYear] = useState(String(currentYear));
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const employeeResponse = await apiClient.employees();
      setEmployees(employeeResponse.data);
      setEmployeeCode((current) => current || fieldForceOptions[0]?.code || employeeResponse.data[0]?.employeeCode || "");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const selectedEmployee = employees.find((employee) => employee.employeeCode === employeeCode);
  const chartSeed = selectedEmployee?.employeeCode ?? employeeCode ?? "admin";

  const fieldWorkDays = useMemo(
    () => [
      { label: "ABM", value: valueFromCode(chartSeed, 1, 18, 25) },
      { label: "BE", value: valueFromCode(chartSeed, 2, 19, 26) },
      { label: "RBM", value: valueFromCode(chartSeed, 3, 14, 24) },
      { label: "SM", value: valueFromCode(chartSeed, 4, 15, 25) },
      { label: "ZBM", value: valueFromCode(chartSeed, 5, 16, 25) }
    ],
    [chartSeed]
  );

  const callAverage = useMemo(
    () => [
      { label: "ABM", value: valueFromCode(chartSeed, 7, 5, 10) },
      { label: "BE", value: valueFromCode(chartSeed, 8, 4, 10) },
      { label: "BRM", value: valueFromCode(chartSeed, 9, 3, 9) },
      { label: "RBM", value: valueFromCode(chartSeed, 10, 5, 10) },
      { label: "ZBM", value: valueFromCode(chartSeed, 11, 4, 10) }
    ],
    [chartSeed]
  );

  const callAdherence = useMemo(
    () => [
      { label: "CORE", value: valueFromCode(chartSeed, 12, 48, 82) },
      { label: "N CORE", value: valueFromCode(chartSeed, 13, 42, 70) },
      { label: "Nil", value: valueFromCode(chartSeed, 14, 30, 55) },
      { label: "S CORE", value: valueFromCode(chartSeed, 15, 60, 88) }
    ],
    [chartSeed]
  );

  const productDetailed = useMemo(
    () => ["BEP", "BRI", "DEN", "DRO", "GEL", "ENV", "FOM", "HYN", "LOT", "MAC"].map((label, index) => ({
      label,
      value: valueFromCode(chartSeed, index + 20, 500, 3200)
    })),
    [chartSeed]
  );

  const visitCalls = useMemo(
    () => [
      { label: "1 Visit", value: valueFromCode(chartSeed, 30, 18, 42) },
      { label: "2 Visit", value: valueFromCode(chartSeed, 31, 24, 58) },
      { label: "3 Visit", value: valueFromCode(chartSeed, 32, 30, 66) },
      { label: "3+ Visit", value: valueFromCode(chartSeed, 33, 12, 38) }
    ],
    [chartSeed]
  );

  const dcrTrend = useMemo(
    () => [
      { label: "W1", value: 72 },
      { label: "W2", value: 78 },
      { label: "W3", value: 85 },
      { label: "W4", value: 81 },
      { label: "W5", value: 88 },
      { label: "W6", value: 91 }
    ],
    []
  );

  const fieldForceRows = useMemo(
    () => [
      ["Rajesh Kumar", "Chennai South", "SUBMITTED", "APPROVED", 9, "Adyar, 10:42am", "ACTIVE"],
      ["Priya Sharma", "Coimbatore", "PENDING", "APPROVED", 6, "RS Puram, 11:15am", "ACTIVE"],
      ["Vikram Nair", "Madurai", "NOT SUBMITTED", "PENDING", 0, "--", "ABSENT"],
      ["Ananya Rajan", "Trichy", "SUBMITTED", "APPROVED", 11, "Anna Nagar, 12:01pm", "ACTIVE"],
      ["Suresh Menon", "Vellore", "SUBMITTED", "APPROVED", 8, "Gandhi Rd, 9:30am", "ACTIVE"]
    ] as const,
    []
  );

  const fieldWorkTotal = fieldWorkDays[0]?.value ?? 0;
  const callAverageValue = (callAverage.reduce((sum, row) => sum + row.value, 0) / Math.max(callAverage.length, 1)).toFixed(1);
  const adherenceValue = callAdherence[0]?.value ?? 0;
  const detailedDoctors = productDetailed.reduce((sum, row) => sum + row.value, 0);
  const totalVisits = visitCalls.reduce((sum, row) => sum + row.value, 0) * 24;
  const commandFieldForceOptions = useMemo(
    () => [
      { label: "All Field Force", value: "admin" },
      ...fieldForceOptions.slice(1).map((employee) => ({ label: employee.label, value: employee.code }))
    ],
    []
  );
  const monthOptions = useMemo(() => months.map((monthName) => ({ label: monthName, value: monthName })), []);
  const yearSelectOptions = useMemo(() => yearOptions.map((yearValue) => ({ label: yearValue, value: yearValue })), []);

  function viewSelectedPerson() {
    if (!employeeCode) {
      return;
    }

    router.push(`/admin/fieldforce/${employeeCode}?month=${month}&year=${year}`);
  }

  return (
    <div className="admin-dashboard command-dashboard">
      <section className="command-toolbar">
        <div>
          <p className="command-kicker">Home</p>
          <h3>Command Center</h3>
          <span>Welcome, Corporate HQ - Zivira Labs Pvt Ltd - Last sync 2 min ago</span>
        </div>
        <div className="command-filters">
          <CommandSelect id="fieldforce" options={commandFieldForceOptions} value={employeeCode} onChange={setEmployeeCode} openMenu={openMenu} setOpenMenu={setOpenMenu} />
          <CommandSelect compact id="month" options={monthOptions} value={month} onChange={setMonth} openMenu={openMenu} setOpenMenu={setOpenMenu} />
          <CommandSelect compact id="year" options={yearSelectOptions} value={year} onChange={setYear} openMenu={openMenu} setOpenMenu={setOpenMenu} />
          <button className="button button-secondary command-icon-only" onClick={viewSelectedPerson} title="View" type="button">
            <Eye size={16} />
          </button>
          <button className="button button-secondary" onClick={loadData} type="button">
            <RefreshCw size={15} />
            {loading ? "Loading" : "Refresh"}
          </button>
        </div>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      <section className="command-metrics">
        <CommandMetric label="Field Work Days" value={String(fieldWorkTotal)} helper="12 from last month" tone="violet" icon={<CalendarDays size={18} />} />
        <CommandMetric label="Call Average" value={callAverageValue} helper="Target 9.0" tone="teal" icon={<Phone size={18} />} />
        <CommandMetric label="Call Adherence" value={`${adherenceValue}%`} helper="Below 80% target" tone="amber" icon={<Target size={18} />} />
        <CommandMetric label="Drs Detailed" value={detailedDoctors.toLocaleString()} helper="194 from this month" tone="blue" icon={<UserRound size={18} />} />
        <CommandMetric label="Visit Calls (Team)" value={totalVisits.toLocaleString()} helper="8.2% vs last month" tone="purple" icon={<Users size={18} />} />
      </section>

      <section className="command-insights">
        <article className="command-panel command-panel-wide">
          <div className="command-panel-title">
            <h4>DCR Submission Trend</h4>
            <span>Weekly submission rate - {month} {year}</span>
          </div>
          <WeeklyTrend rows={dcrTrend} />
        </article>
        <article className="command-panel">
          <div className="command-panel-title">
            <h4>Attendance Split</h4>
            <span>{month} {year}</span>
          </div>
          <AttendanceSplit value={76} />
        </article>
        <article className="command-panel">
          <div className="command-panel-title">
            <h4>Live Activity</h4>
            <span>Real-time field feed</span>
          </div>
          <div className="activity-feed">
            {[
              ["teal", "DCR submitted - Rajesh K, Chennai", "2 min ago"],
              ["amber", "TP pending approval - Zone B, 12 plans", "8 min ago"],
              ["blue", "New doctor listed - Dr. Iyer, Chennai S.", "15 min ago"],
              ["violet", "Expense approved - Priya S., Rs 3,400", "22 min ago"]
            ].map(([tone, title, time]) => (
              <div className="activity-item" key={title}>
                <i className={`activity-dot activity-dot-${tone}`} />
                <div>
                  <strong>{title}</strong>
                  <span>{time}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="command-panel command-table-panel">
        <div className="command-table-head">
          <h4>Field Force Status - Today (11 May 2026)</h4>
          <div>
            <button className="button button-secondary" type="button"><Download size={15} /> Export</button>
            <button className="button" onClick={viewSelectedPerson} type="button"><Plus size={15} /> Add Field Force</button>
          </div>
        </div>
        <div className="command-table-wrap">
          <table className="command-table">
            <thead>
              <tr>
                <th><input type="checkbox" aria-label="Select all" /></th>
                <th>Name</th>
                <th>HQ / Territory</th>
                <th>DCR Status</th>
                <th>TP Status</th>
                <th>Calls Today</th>
                <th>Last Seen</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fieldForceRows.map(([name, territory, dcrStatus, tpStatus, calls, lastSeen, status]) => (
                <tr key={name}>
                  <td><input type="checkbox" aria-label={`Select ${name}`} /></td>
                  <td><strong>{name}</strong></td>
                  <td>{territory}</td>
                  <td><StatusPill tone={dcrStatus === "SUBMITTED" ? "success" : dcrStatus === "PENDING" ? "warning" : "danger"}>{dcrStatus}</StatusPill></td>
                  <td><StatusPill tone={tpStatus === "APPROVED" ? "success" : "warning"}>{tpStatus}</StatusPill></td>
                  <td>{calls}</td>
                  <td>{lastSeen}</td>
                  <td><StatusPill tone={status === "ACTIVE" ? "success" : "danger"}>{status}</StatusPill></td>
                  <td>
                    <span className="command-row-actions">
                      <button title="View" type="button"><Eye size={14} /></button>
                      <button title="Edit" type="button"><Pencil size={14} /></button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="command-bottom-grid">
        <article className="command-panel">
          <div className="command-table-head">
            <h4>Notice Board</h4>
            <button className="button" type="button"><Plus size={15} /> Post Notice</button>
          </div>
          <div className="notice-list">
            {[
              ["Q2 Review - Mandatory attendance", "Corporate HQ - 10 May 2026", "All divisions"],
              ["New product launch - Cardiometx 10mg", "Product Team - 8 May 2026", "Product"],
              ["Delayed Report Status - Action Required", "Admin - 6 May 2026", "Urgent"]
            ].map(([title, meta, tag]) => (
              <div className="notice-item" key={title}>
                <Bell size={17} />
                <div><strong>{title}</strong><span>{meta}</span></div>
                <StatusPill tone={tag === "Urgent" ? "warning" : "neutral"}>{tag}</StatusPill>
              </div>
            ))}
          </div>
        </article>
        <article className="command-panel">
          <div className="command-table-head">
            <h4>Delayed DCR Summary</h4>
            <button className="button button-secondary" type="button">View All</button>
          </div>
          <div className="command-table-wrap">
            <table className="command-table command-table-compact">
              <thead>
                <tr><th>MR Name</th><th>Territory</th><th>Days Delayed</th><th>Status</th></tr>
              </thead>
              <tbody>
                {[
                  ["Vikram Nair", "Madurai", "3 days", "INACTIVE"],
                  ["Suresh P.", "Salem", "1 day", "PENDING"],
                  ["Meera K.", "Puducherry", "2 days", "PENDING"]
                ].map(([name, territory, delayed, status]) => (
                  <tr key={name}>
                    <td><strong>{name}</strong></td>
                    <td>{territory}</td>
                    <td className="command-warning-text">{delayed}</td>
                    <td><StatusPill tone={status === "INACTIVE" ? "danger" : "warning"}>{status}</StatusPill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
