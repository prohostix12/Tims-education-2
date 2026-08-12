"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import "./tims-new-about-section.css";

function CertificateIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <rect x="3.5" y="4" width="17" height="12.5" rx="2" stroke="#142B72" strokeWidth="1.6" />
      <circle cx="12" cy="17.5" r="2.6" stroke="#ED1C24" strokeWidth="1.6" />
      <path d="M10.2 19.6 9.4 22l2.6-1.3 2.6 1.3-.8-2.4" stroke="#ED1C24" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M6.5 8h11M6.5 11h7" stroke="#142B72" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function TransferIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path d="M4 8h13l-3-3M20 16H7l3 3" stroke="#142B72" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DegreeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path d="M12 4 2 8.5 12 13l10-4.5L12 4Z" stroke="#142B72" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6 10.5V15c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5" stroke="#142B72" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M21 9v5.5" stroke="#ED1C24" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="#D9A441" aria-hidden="true">
      <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.8 5.9 21l1.5-6.8-5.2-4.7 6.9-.7L12 2.5Z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
      <path
        d="M4 12h16M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Laurel wreath artwork, adapted from a monogram-wreath icon. The source
 * icon is one symmetric path (two mirrored branches around a central
 * gap sized for a monogram letter). Split here into a single right-side
 * branch, reused mirrored for the left, so the two halves can be laid
 * out independently with the "HONORED WITH EXCELLENCE..!" text placed
 * between them at whatever gap the text needs — instead of being locked
 * to the source icon's narrower built-in gap.
 */
const WREATH_BRANCH_PATH =
  "M1836.808594 608.269531C1765.070312 639.050781 1724.050781 558.808594 1724.050781 558.808594C1776.71875 542.160156 1814.320312 571.910156 1814.320312 571.910156C1820.53125 595.898438 1836.808594 608.269531 1836.808594 608.269531ZM1847.101562 603.730469C1847.101562 603.730469 1779.46875 546.761719 1850.410156 459.941406C1850.410156 459.941406 1908.429688 544.289062 1847.101562 603.730469ZM1793.480469 517.351562C1793.480469 517.351562 1664.78125 540.96875 1632.410156 378.289062C1632.410156 378.289062 1783.289062 391.390625 1793.480469 517.351562ZM1866.210938 709.648438C1866.210938 709.648438 1853.179688 693.890625 1852.628906 669.101562C1852.628906 669.101562 1822.789062 631.558594 1767.71875 635.761719C1767.71875 635.761719 1789.359375 723.25 1866.210938 709.648438ZM1877.269531 707.578125C1950.550781 663.691406 1913.300781 568.328125 1913.300781 568.328125C1824.429688 636.671875 1877.269531 707.578125 1877.269531 707.578125ZM1871.53125 822.777344C1871.53125 822.777344 1862.640625 804.390625 1867.988281 780.179688C1867.988281 780.179688 1847.980469 736.621094 1793.480469 727.558594C1793.480469 727.558594 1793.628906 817.679688 1871.53125 822.777344ZM1882.761719 823.425781C1882.761719 823.425781 1848.339844 741.960938 1950.941406 696.789062C1950.941406 696.789062 1964.378906 798.28125 1882.761719 823.425781ZM1862.851562 940.371094C1787.378906 920.476562 1804.460938 831.984375 1804.460938 831.984375C1856.199219 851.277344 1867.53125 897.871094 1867.53125 897.871094C1857.660156 920.605469 1862.851562 940.371094 1862.851562 940.371094ZM1873.761719 943.128906C1873.761719 943.128906 1855.539062 856.59375 1964.878906 831.851562C1964.878906 831.851562 1958.691406 934.035156 1873.761719 943.128906ZM1819.671875 1048.988281C1819.671875 1048.988281 1817.691406 1028.660156 1831.078125 1007.769531C1831.078125 1007.769531 1827.308594 959.984375 1779.308594 932.671875C1779.308594 932.671875 1748.351562 1017.308594 1819.671875 1048.988281ZM1830 1053.460938C1915.289062 1058.03125 1937.710938 958.144531 1937.710938 958.144531C1825.820312 965.109375 1830 1053.460938 1830 1053.460938ZM1770.378906 1134.621094C1710.28125 1084.800781 1763.019531 1011.710938 1763.019531 1011.710938C1801.828125 1050.988281 1792.519531 1098.03125 1792.519531 1098.03125C1773.96875 1114.511719 1770.378906 1134.621094 1770.378906 1134.621094ZM1779.121094 1141.710938C1779.121094 1141.710938 1799 1055.539062 1908.609375 1079.121094C1908.609375 1079.121094 1859.988281 1169.199219 1779.121094 1141.710938ZM1691.460938 1215.988281C1691.460938 1215.988281 1699.910156 1197.398438 1721.960938 1186.039062C1721.960938 1186.039062 1742.679688 1142.808594 1714.828125 1095.109375C1714.828125 1095.109375 1645.609375 1152.820312 1691.460938 1215.988281ZM1698.128906 1225.03125C1769.640625 1271.730469 1839.121094 1196.570312 1839.121094 1196.570312C1738.808594 1146.5 1698.128906 1225.03125 1698.128906 1225.03125ZM1601.75 1284.140625C1566.21875 1214.628906 1643.519531 1168.300781 1643.519531 1168.300781C1663.660156 1219.738281 1636.519531 1259.261719 1636.519531 1259.261719C1612.960938 1267.058594 1601.75 1284.140625 1601.75 1284.140625ZM1606.949219 1294.101562C1606.949219 1294.101562 1659.261719 1222.78125 1750.640625 1287.738281C1750.640625 1287.738281 1670.378906 1351.289062 1606.949219 1294.101562ZM1499.839844 1323.429688C1499.839844 1323.429688 1515.339844 1310.140625 1540.140625 1309.148438C1540.140625 1309.148438 1577.148438 1278.671875 1572.03125 1223.679688C1572.03125 1223.679688 1484.921875 1246.808594 1499.839844 1323.429688ZM1502.078125 1334.449219C1547.210938 1406.949219 1641.929688 1368.101562 1641.929688 1368.101562C1572.078125 1280.378906 1502.078125 1334.449219 1502.078125 1334.449219ZM1391.75 1347.601562C1391.75 1347.601562 1409.609375 1337.660156 1434.089844 1341.628906C1434.089844 1341.628906 1476.429688 1319.148438 1482.390625 1264.238281C1482.390625 1264.238281 1392.421875 1269.53125 1391.75 1347.601562ZM1391.75 1358.839844C1391.75 1358.839844 1471.140625 1319.820312 1522.070312 1419.699219C1522.070312 1419.699219 1421.519531 1438.890625 1391.75 1358.839844Z";

function WreathHalf({ mirrored }: { mirrored?: boolean }) {
  return (
    <svg
      className="tims-new-about-badge-wreath"
      viewBox="1375 365 600 1065"
      preserveAspectRatio="xMidYMid meet"
      style={mirrored ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <path fillRule="evenodd" fill="#D9A441" d={WREATH_BRANCH_PATH} />
    </svg>
  );
}

/** Hit points (as a fraction of the shared animation cycle) where the
 * gradient sweep crosses each icon's position along the connector path. */
const ICON_HIT_FRACTIONS = [0.2667, 0.5, 0.7333];
const CYCLE_MS = 3000;
const BUMP_WIDTH = 0.09;
const MAX_SCALE_BOOST = 0.25;

function circularDelta(t: number, target: number) {
  let d = t - target;
  d -= Math.round(d);
  return d;
}

function useConnectorSync() {
  const gradientRef = useRef<SVGLinearGradientElement | null>(null);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([null, null, null]);
  const hoveredIndexRef = useRef<number | null>(null);

  const setIconRef = (index: number) => (el: HTMLSpanElement | null) => {
    iconRefs.current[index] = el;
  };

  const setHovered = (index: number | null) => () => {
    hoveredIndexRef.current = index;
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let rafId: number;
    let startTime: number | null = null;

    function tick(timestamp: number) {
      if (startTime === null) startTime = timestamp;
      const t = ((timestamp - (startTime ?? 0)) % CYCLE_MS) / CYCLE_MS;

      const dx = -600 + 1200 * t;
      gradientRef.current?.setAttribute("gradientTransform", `translate(${dx} 0)`);

      iconRefs.current.forEach((el, index) => {
        if (!el) return;
        if (hoveredIndexRef.current === index) {
          el.style.transform = "";
          return;
        }
        const delta = circularDelta(t, ICON_HIT_FRACTIONS[index]);
        const scale =
          1 + MAX_SCALE_BOOST * Math.exp(-(delta * delta) / (2 * BUMP_WIDTH * BUMP_WIDTH));
        el.style.transform = `scale(${scale})`;
      });

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return { gradientRef, setIconRef, setHovered };
}

function LaurelBadge() {
  return (
    <div className="tims-new-about-badge">
      <span className="tims-new-about-badge-star">
        <StarIcon />
      </span>

      <div className="tims-new-about-badge-row">
        <WreathHalf mirrored />

        <div className="tims-new-about-badge-text">
          <span className="tims-new-about-badge-line1">HONORED</span>
          <span className="tims-new-about-badge-line2">WITH</span>
          <span className="tims-new-about-badge-line3">EXCELLENCE..!</span>
          {/* <span className="tims-new-about-badge-underline" aria-hidden="true" /> */}
        </div>

        <WreathHalf />
      </div>
    </div>
  );
}

export default function NewAboutSection() {
  const { gradientRef, setIconRef, setHovered } = useConnectorSync();

  return (
    <section className="tims-new-about-section">
      <div className="tims-new-about-inner">
        <div className="tims-new-about-intro">
          <span className="tims-new-about-label">GET TO KNOW US</span>
          <span className="tims-new-about-accent-line" aria-hidden="true" />
          <h2 className="tims-new-about-heading">Learning Anytime, Anywhere for Success</h2>
          <p className="tims-new-about-description">
            Providing accessible, high-quality education and guidance, Tirur Institute of
            Management Studies fosters academic excellence, professional growth, and societal
            impact for every learner.
          </p>
        </div>

        <div className="tims-new-about-features">
          <svg
            className="tims-new-about-connector"
            viewBox="0 0 600 60"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                ref={gradientRef}
                id="tnaConnectorGradient"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="600"
                y2="0"
              >
                <stop offset="0%" stopColor="#DCE5F7" />
                <stop offset="45%" stopColor="#ED1C24" />
                <stop offset="55%" stopColor="#D9A441" />
                <stop offset="100%" stopColor="#DCE5F7" />
              </linearGradient>
            </defs>

            <path
              d="M20,40 C140,0 180,60 300,30 C420,0 460,60 580,20"
              fill="none"
              stroke="url(#tnaConnectorGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <animate
                attributeName="d"
                dur="4s"
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                values="
                  M20,40 C140,0 180,60 300,30 C420,0 460,60 580,20;
                  M20,20 C140,60 180,0 300,30 C420,60 460,0 580,40;
                  M20,40 C140,0 180,60 300,30 C420,0 460,60 580,20
                "
              />
            </path>
          </svg>

          <div
            className="tims-new-feature-item"
            onMouseEnter={setHovered(0)}
            onMouseLeave={setHovered(null)}
          >
            <span className="tims-new-feature-icon" ref={setIconRef(0)}>
              <CertificateIcon />
            </span>
            <p className="tims-new-feature-title">
              Accredited Attestation and Certification Services
            </p>
          </div>

          <div
            className="tims-new-feature-item"
            onMouseEnter={setHovered(1)}
            onMouseLeave={setHovered(null)}
          >
            <span className="tims-new-feature-icon" ref={setIconRef(1)}>
              <TransferIcon />
            </span>
            <p className="tims-new-feature-title">
              Flexible Online and Credit Transfer Options
            </p>
          </div>

          <div
            className="tims-new-feature-item"
            onMouseEnter={setHovered(2)}
            onMouseLeave={setHovered(null)}
          >
            <span className="tims-new-feature-icon" ref={setIconRef(2)}>
              <DegreeIcon />
            </span>
            <p className="tims-new-feature-title">
              Comprehensive Course and Degree Programs
            </p>
          </div>
        </div>

        <div className="tims-new-about-center">
          <div className="tims-new-about-image-wrap">
            <span className="tims-new-about-decor-blue" aria-hidden="true" />

            <svg
              className="tims-new-about-arc-red"
              viewBox="0 0 440 440"
              aria-hidden="true"
            >
              <circle
                cx="220"
                cy="220"
                r="208"
                fill="none"
                stroke="#ED1C24"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="230 1100"
                transform="rotate(-55 220 220)"
              />
            </svg>

            <svg
              className="tims-new-about-arc-red-light"
              viewBox="0 0 440 440"
              aria-hidden="true"
            >
              <circle
                cx="220"
                cy="220"
                r="196"
                fill="none"
                stroke="#f6c4c6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="140 1100"
                transform="rotate(150 220 220)"
              />
            </svg>

            <div className="tims-new-about-image-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/admission_partner.png"
                alt="Tirur Institute of Management Studies award recognition"
                className="tims-new-about-image"
              />
            </div>
          </div>
        </div>

        <div className="tims-new-about-right">
          <LaurelBadge />

          <p className="tims-new-about-award-description">
            We&rsquo;ve been awarded the <strong>Best Admission Partner</strong> by{" "}
            <strong>Swami Vivekanand Subharti University</strong>, presented by{" "}
            <strong>Prof. (Dr.) Mahavir Singh</strong>, Director, Centre for Distance and
            Online Education.
          </p>

          <Link href="#" className="tims-new-about-button">
            <span>Discover More</span>
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
