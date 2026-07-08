import { ImageResponse } from "next/og";

// Site-wide share card — brand colours and the dashed flight line, so links
// pasted into chats/socials don't show up as a bare grey box.

export const alt =
  "Close the Distance — a long-distance couple's journal & move-in calculator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf6f1",
          color: "#2b2329",
        }}
      >
        {/* the flight line between two dots — the brand in one gesture */}
        <svg width="520" height="130" viewBox="0 0 520 130">
          <path
            d="M30 105 Q260 -30 490 105"
            fill="none"
            stroke="#b25c72"
            strokeWidth="4"
            strokeDasharray="6 14"
            strokeLinecap="round"
          />
          <circle cx="30" cy="105" r="9" fill="#b25c72" />
          <circle cx="490" cy="105" r="9" fill="#b25c72" />
        </svg>
        <div
          style={{
            marginTop: 36,
            fontSize: 76,
            fontWeight: 700,
            letterSpacing: "-2px",
            color: "#b25c72",
          }}
        >
          Close the Distance
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 30,
            color: "#6b6068",
            maxWidth: 820,
            textAlign: "center",
          }}
        >
          A long-distance couple&rsquo;s journal — plus the calculator that
          says when you can finally move in together.
        </div>
      </div>
    ),
    size
  );
}
