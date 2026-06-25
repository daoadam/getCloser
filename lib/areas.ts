// Indicative rental + cost-of-living data for cities worldwide.
// weeklyRent2br and medianHouse are in each area's LOCAL currency.
// colIndex scales everyday living costs, with ~1.0 = Adelaide baseline.
// Figures are indicative, not live.

export type Area = {
  id: string;
  city: string; // suburb / district shown to the user
  region: string; // metro / city it belongs to
  country: string; // ISO-3166 alpha-2
  currency: string; // ISO-4217, local currency
  weeklyRent2br: number; // indicative weekly rent, 2br, LOCAL currency
  medianHouse: number; // indicative median home price, LOCAL currency
  colIndex: number; // everyday cost-of-living index, 1.0 = Adelaide
  lat: number;
  lng: number;
};

export const AREAS: Area[] = [
  // ===== AUSTRALIA — ADELAIDE (AUD) =====
  { id: "au-adl-cbd", city: "Adelaide CBD", region: "Adelaide", country: "AU", currency: "AUD", weeklyRent2br: 620, medianHouse: 720000, colIndex: 1.05, lat: -34.9285, lng: 138.6007 },
  { id: "au-adl-north-adelaide", city: "North Adelaide", region: "Adelaide", country: "AU", currency: "AUD", weeklyRent2br: 650, medianHouse: 1250000, colIndex: 1.08, lat: -34.9066, lng: 138.5944 },
  { id: "au-adl-prospect", city: "Prospect", region: "Adelaide", country: "AU", currency: "AUD", weeklyRent2br: 560, medianHouse: 980000, colIndex: 1.03, lat: -34.8813, lng: 138.5939 },
  { id: "au-adl-norwood", city: "Norwood", region: "Adelaide", country: "AU", currency: "AUD", weeklyRent2br: 590, medianHouse: 1100000, colIndex: 1.05, lat: -34.9214, lng: 138.6300 },
  { id: "au-adl-glenelg", city: "Glenelg", region: "Adelaide", country: "AU", currency: "AUD", weeklyRent2br: 600, medianHouse: 1050000, colIndex: 1.06, lat: -34.9803, lng: 138.5135 },
  { id: "au-adl-marion", city: "Marion", region: "Adelaide", country: "AU", currency: "AUD", weeklyRent2br: 510, medianHouse: 760000, colIndex: 0.99, lat: -35.0150, lng: 138.5570 },
  { id: "au-adl-mawson-lakes", city: "Mawson Lakes", region: "Adelaide", country: "AU", currency: "AUD", weeklyRent2br: 520, medianHouse: 670000, colIndex: 0.98, lat: -34.8100, lng: 138.6100 },
  { id: "au-adl-port-adelaide", city: "Port Adelaide", region: "Adelaide", country: "AU", currency: "AUD", weeklyRent2br: 480, medianHouse: 620000, colIndex: 0.95, lat: -34.8480, lng: 138.5030 },
  { id: "au-adl-salisbury", city: "Salisbury", region: "Adelaide", country: "AU", currency: "AUD", weeklyRent2br: 450, medianHouse: 540000, colIndex: 0.92, lat: -34.7600, lng: 138.6400 },
  { id: "au-adl-elizabeth", city: "Elizabeth", region: "Adelaide", country: "AU", currency: "AUD", weeklyRent2br: 400, medianHouse: 420000, colIndex: 0.88, lat: -34.7150, lng: 138.6720 },

  // ===== AUSTRALIA — MELBOURNE =====
  { id: "au-mel-cbd", city: "Melbourne CBD", region: "Melbourne", country: "AU", currency: "AUD", weeklyRent2br: 680, medianHouse: 640000, colIndex: 1.12, lat: -37.8136, lng: 144.9631 },
  { id: "au-mel-fitzroy", city: "Fitzroy", region: "Melbourne", country: "AU", currency: "AUD", weeklyRent2br: 700, medianHouse: 1180000, colIndex: 1.14, lat: -37.7990, lng: 144.9780 },
  { id: "au-mel-st-kilda", city: "St Kilda", region: "Melbourne", country: "AU", currency: "AUD", weeklyRent2br: 640, medianHouse: 1050000, colIndex: 1.10, lat: -37.8678, lng: 144.9810 },
  { id: "au-mel-brunswick", city: "Brunswick", region: "Melbourne", country: "AU", currency: "AUD", weeklyRent2br: 600, medianHouse: 980000, colIndex: 1.08, lat: -37.7670, lng: 144.9600 },
  { id: "au-mel-footscray", city: "Footscray", region: "Melbourne", country: "AU", currency: "AUD", weeklyRent2br: 520, medianHouse: 760000, colIndex: 1.02, lat: -37.8000, lng: 144.9000 },
  { id: "au-mel-dandenong", city: "Dandenong", region: "Melbourne", country: "AU", currency: "AUD", weeklyRent2br: 450, medianHouse: 640000, colIndex: 0.95, lat: -37.9870, lng: 145.2150 },
  { id: "au-mel-werribee", city: "Werribee", region: "Melbourne", country: "AU", currency: "AUD", weeklyRent2br: 430, medianHouse: 560000, colIndex: 0.92, lat: -37.9000, lng: 144.6600 },

  // ===== AUSTRALIA — SYDNEY =====
  { id: "au-syd-cbd", city: "Sydney CBD", region: "Sydney", country: "AU", currency: "AUD", weeklyRent2br: 950, medianHouse: 1250000, colIndex: 1.25, lat: -33.8688, lng: 151.2093 },
  { id: "au-syd-bondi", city: "Bondi", region: "Sydney", country: "AU", currency: "AUD", weeklyRent2br: 980, medianHouse: 2400000, colIndex: 1.28, lat: -33.8915, lng: 151.2767 },
  { id: "au-syd-newtown", city: "Newtown", region: "Sydney", country: "AU", currency: "AUD", weeklyRent2br: 850, medianHouse: 1650000, colIndex: 1.22, lat: -33.8980, lng: 151.1790 },
  { id: "au-syd-parramatta", city: "Parramatta", region: "Sydney", country: "AU", currency: "AUD", weeklyRent2br: 680, medianHouse: 1150000, colIndex: 1.12, lat: -33.8150, lng: 151.0000 },
  { id: "au-syd-blacktown", city: "Blacktown", region: "Sydney", country: "AU", currency: "AUD", weeklyRent2br: 560, medianHouse: 920000, colIndex: 1.02, lat: -33.7710, lng: 150.9060 },
  { id: "au-syd-penrith", city: "Penrith", region: "Sydney", country: "AU", currency: "AUD", weeklyRent2br: 520, medianHouse: 850000, colIndex: 0.98, lat: -33.7510, lng: 150.6940 },
  { id: "au-syd-liverpool", city: "Liverpool", region: "Sydney", country: "AU", currency: "AUD", weeklyRent2br: 540, medianHouse: 880000, colIndex: 1.00, lat: -33.9200, lng: 150.9240 },

  // ===== AUSTRALIA — BRISBANE =====
  { id: "au-bne-cbd", city: "Brisbane CBD", region: "Brisbane", country: "AU", currency: "AUD", weeklyRent2br: 640, medianHouse: 720000, colIndex: 1.06, lat: -27.4698, lng: 153.0251 },
  { id: "au-bne-new-farm", city: "New Farm", region: "Brisbane", country: "AU", currency: "AUD", weeklyRent2br: 700, medianHouse: 1450000, colIndex: 1.10, lat: -27.4670, lng: 153.0480 },
  { id: "au-bne-west-end", city: "West End", region: "Brisbane", country: "AU", currency: "AUD", weeklyRent2br: 620, medianHouse: 1050000, colIndex: 1.05, lat: -27.4830, lng: 153.0100 },
  { id: "au-bne-chermside", city: "Chermside", region: "Brisbane", country: "AU", currency: "AUD", weeklyRent2br: 540, medianHouse: 820000, colIndex: 0.99, lat: -27.3850, lng: 153.0320 },
  { id: "au-bne-ipswich", city: "Ipswich", region: "Brisbane", country: "AU", currency: "AUD", weeklyRent2br: 440, medianHouse: 560000, colIndex: 0.92, lat: -27.6160, lng: 152.7600 },
  { id: "au-bne-logan", city: "Logan Central", region: "Brisbane", country: "AU", currency: "AUD", weeklyRent2br: 460, medianHouse: 600000, colIndex: 0.93, lat: -27.6390, lng: 153.1090 },

  // ===== AUSTRALIA — PERTH =====
  { id: "au-per-cbd", city: "Perth CBD", region: "Perth", country: "AU", currency: "AUD", weeklyRent2br: 600, medianHouse: 680000, colIndex: 1.04, lat: -31.9523, lng: 115.8613 },
  { id: "au-per-fremantle", city: "Fremantle", region: "Perth", country: "AU", currency: "AUD", weeklyRent2br: 620, medianHouse: 950000, colIndex: 1.05, lat: -32.0560, lng: 115.7470 },
  { id: "au-per-subiaco", city: "Subiaco", region: "Perth", country: "AU", currency: "AUD", weeklyRent2br: 640, medianHouse: 1150000, colIndex: 1.07, lat: -31.9480, lng: 115.8260 },
  { id: "au-per-joondalup", city: "Joondalup", region: "Perth", country: "AU", currency: "AUD", weeklyRent2br: 520, medianHouse: 640000, colIndex: 0.97, lat: -31.7440, lng: 115.7660 },
  { id: "au-per-armadale", city: "Armadale", region: "Perth", country: "AU", currency: "AUD", weeklyRent2br: 450, medianHouse: 480000, colIndex: 0.90, lat: -32.1490, lng: 116.0140 },
  { id: "au-per-rockingham", city: "Rockingham", region: "Perth", country: "AU", currency: "AUD", weeklyRent2br: 480, medianHouse: 540000, colIndex: 0.93, lat: -32.2770, lng: 115.7290 },

  // ===== AUSTRALIA — CANBERRA =====
  { id: "au-cbr-civic", city: "City (Civic)", region: "Canberra", country: "AU", currency: "AUD", weeklyRent2br: 600, medianHouse: 720000, colIndex: 1.08, lat: -35.2809, lng: 149.1300 },
  { id: "au-cbr-braddon", city: "Braddon", region: "Canberra", country: "AU", currency: "AUD", weeklyRent2br: 620, medianHouse: 880000, colIndex: 1.10, lat: -35.2710, lng: 149.1340 },
  { id: "au-cbr-belconnen", city: "Belconnen", region: "Canberra", country: "AU", currency: "AUD", weeklyRent2br: 540, medianHouse: 740000, colIndex: 1.03, lat: -35.2380, lng: 149.0660 },
  { id: "au-cbr-gungahlin", city: "Gungahlin", region: "Canberra", country: "AU", currency: "AUD", weeklyRent2br: 560, medianHouse: 780000, colIndex: 1.04, lat: -35.1840, lng: 149.1330 },
  { id: "au-cbr-tuggeranong", city: "Tuggeranong", region: "Canberra", country: "AU", currency: "AUD", weeklyRent2br: 520, medianHouse: 700000, colIndex: 1.01, lat: -35.4160, lng: 149.0660 },

  // ===== AUSTRALIA — GOLD COAST =====
  { id: "au-gld-surfers-paradise", city: "Surfers Paradise", region: "Gold Coast", country: "AU", currency: "AUD", weeklyRent2br: 680, medianHouse: 950000, colIndex: 1.06, lat: -28.0023, lng: 153.4145 },
  { id: "au-gld-broadbeach", city: "Broadbeach", region: "Gold Coast", country: "AU", currency: "AUD", weeklyRent2br: 700, medianHouse: 1050000, colIndex: 1.07, lat: -28.0290, lng: 153.4310 },
  { id: "au-gld-southport", city: "Southport", region: "Gold Coast", country: "AU", currency: "AUD", weeklyRent2br: 580, medianHouse: 820000, colIndex: 1.02, lat: -27.9670, lng: 153.4000 },
  { id: "au-gld-robina", city: "Robina", region: "Gold Coast", country: "AU", currency: "AUD", weeklyRent2br: 600, medianHouse: 880000, colIndex: 1.02, lat: -28.0760, lng: 153.3920 },
  { id: "au-gld-coomera", city: "Coomera", region: "Gold Coast", country: "AU", currency: "AUD", weeklyRent2br: 540, medianHouse: 740000, colIndex: 0.98, lat: -27.8540, lng: 153.3320 },

  // ===== AUSTRALIA — HOBART =====
  { id: "au-hba-cbd", city: "Hobart CBD", region: "Hobart", country: "AU", currency: "AUD", weeklyRent2br: 520, medianHouse: 700000, colIndex: 1.02, lat: -42.8821, lng: 147.3272 },
  { id: "au-hba-battery-point", city: "Battery Point", region: "Hobart", country: "AU", currency: "AUD", weeklyRent2br: 560, medianHouse: 980000, colIndex: 1.05, lat: -42.8890, lng: 147.3340 },
  { id: "au-hba-sandy-bay", city: "Sandy Bay", region: "Hobart", country: "AU", currency: "AUD", weeklyRent2br: 540, medianHouse: 920000, colIndex: 1.03, lat: -42.9020, lng: 147.3300 },
  { id: "au-hba-glenorchy", city: "Glenorchy", region: "Hobart", country: "AU", currency: "AUD", weeklyRent2br: 450, medianHouse: 560000, colIndex: 0.95, lat: -42.8330, lng: 147.2740 },
  { id: "au-hba-kingston", city: "Kingston", region: "Hobart", country: "AU", currency: "AUD", weeklyRent2br: 480, medianHouse: 680000, colIndex: 0.97, lat: -42.9760, lng: 147.3080 },

  // ===== AUSTRALIA — DARWIN =====
  { id: "au-drw-cbd", city: "Darwin CBD", region: "Darwin", country: "AU", currency: "AUD", weeklyRent2br: 560, medianHouse: 560000, colIndex: 1.10, lat: -12.4634, lng: 130.8456 },
  { id: "au-drw-fannie-bay", city: "Fannie Bay", region: "Darwin", country: "AU", currency: "AUD", weeklyRent2br: 600, medianHouse: 720000, colIndex: 1.12, lat: -12.4220, lng: 130.8350 },
  { id: "au-drw-nightcliff", city: "Nightcliff", region: "Darwin", country: "AU", currency: "AUD", weeklyRent2br: 540, medianHouse: 620000, colIndex: 1.08, lat: -12.3850, lng: 130.8530 },
  { id: "au-drw-palmerston", city: "Palmerston", region: "Darwin", country: "AU", currency: "AUD", weeklyRent2br: 500, medianHouse: 480000, colIndex: 1.04, lat: -12.4860, lng: 130.9830 },
  { id: "au-drw-casuarina", city: "Casuarina", region: "Darwin", country: "AU", currency: "AUD", weeklyRent2br: 520, medianHouse: 540000, colIndex: 1.06, lat: -12.3760, lng: 130.8740 },

  // ===== NEW ZEALAND (NZD) =====
  { id: "nz-akl-cbd", city: "Auckland CBD", region: "Auckland", country: "NZ", currency: "NZD", weeklyRent2br: 650, medianHouse: 980000, colIndex: 1.12, lat: -36.8485, lng: 174.7633 },
  { id: "nz-akl-ponsonby", city: "Ponsonby", region: "Auckland", country: "NZ", currency: "NZD", weeklyRent2br: 720, medianHouse: 1650000, colIndex: 1.16, lat: -36.8590, lng: 174.7440 },
  { id: "nz-akl-mt-eden", city: "Mount Eden", region: "Auckland", country: "NZ", currency: "NZD", weeklyRent2br: 680, medianHouse: 1450000, colIndex: 1.13, lat: -36.8770, lng: 174.7640 },
  { id: "nz-akl-manukau", city: "Manukau", region: "Auckland", country: "NZ", currency: "NZD", weeklyRent2br: 560, medianHouse: 880000, colIndex: 1.04, lat: -36.9930, lng: 174.8790 },
  { id: "nz-wlg-cbd", city: "Wellington CBD", region: "Wellington", country: "NZ", currency: "NZD", weeklyRent2br: 620, medianHouse: 860000, colIndex: 1.10, lat: -41.2865, lng: 174.7762 },
  { id: "nz-wlg-newtown", city: "Newtown", region: "Wellington", country: "NZ", currency: "NZD", weeklyRent2br: 580, medianHouse: 780000, colIndex: 1.06, lat: -41.3110, lng: 174.7790 },
  { id: "nz-chc-cbd", city: "Christchurch Central", region: "Christchurch", country: "NZ", currency: "NZD", weeklyRent2br: 520, medianHouse: 620000, colIndex: 1.00, lat: -43.5321, lng: 172.6362 },
  { id: "nz-chc-riccarton", city: "Riccarton", region: "Christchurch", country: "NZ", currency: "NZD", weeklyRent2br: 500, medianHouse: 580000, colIndex: 0.98, lat: -43.5300, lng: 172.5900 },

  // ===== FIJI (FJD) =====
  { id: "fj-suv-central", city: "Suva Central", region: "Suva", country: "FJ", currency: "FJD", weeklyRent2br: 350, medianHouse: 320000, colIndex: 0.72, lat: -18.1416, lng: 178.4419 },
  { id: "fj-suv-nasese", city: "Nasese", region: "Suva", country: "FJ", currency: "FJD", weeklyRent2br: 420, medianHouse: 420000, colIndex: 0.76, lat: -18.1560, lng: 178.4400 },
  { id: "fj-nad-town", city: "Nadi Town", region: "Nadi", country: "FJ", currency: "FJD", weeklyRent2br: 300, medianHouse: 280000, colIndex: 0.70, lat: -17.8000, lng: 177.4160 },

  // ===== PAPUA NEW GUINEA (PGK) =====
  { id: "pg-pom-town", city: "Port Moresby Town", region: "Port Moresby", country: "PG", currency: "PGK", weeklyRent2br: 900, medianHouse: 850000, colIndex: 0.95, lat: -9.4438, lng: 147.1803 },
  { id: "pg-pom-boroko", city: "Boroko", region: "Port Moresby", country: "PG", currency: "PGK", weeklyRent2br: 750, medianHouse: 700000, colIndex: 0.90, lat: -9.4680, lng: 147.1900 },
  { id: "pg-lae-top-town", city: "Lae Top Town", region: "Lae", country: "PG", currency: "PGK", weeklyRent2br: 600, medianHouse: 520000, colIndex: 0.85, lat: -6.7220, lng: 146.9990 },

  // ===== JAPAN (JPY) =====
  { id: "jp-tokyo-shibuya", city: "Shibuya", region: "Tokyo", country: "JP", currency: "JPY", weeklyRent2br: 65000, medianHouse: 95000000, colIndex: 1.28, lat: 35.6580, lng: 139.7016 },
  { id: "jp-tokyo-shinjuku", city: "Shinjuku", region: "Tokyo", country: "JP", currency: "JPY", weeklyRent2br: 60000, medianHouse: 88000000, colIndex: 1.26, lat: 35.6938, lng: 139.7034 },
  { id: "jp-tokyo-setagaya", city: "Setagaya", region: "Tokyo", country: "JP", currency: "JPY", weeklyRent2br: 50000, medianHouse: 72000000, colIndex: 1.20, lat: 35.6460, lng: 139.6530 },
  { id: "jp-tokyo-adachi", city: "Adachi", region: "Tokyo", country: "JP", currency: "JPY", weeklyRent2br: 36000, medianHouse: 48000000, colIndex: 1.10, lat: 35.7750, lng: 139.8050 },
  { id: "jp-osaka-kita", city: "Kita", region: "Osaka", country: "JP", currency: "JPY", weeklyRent2br: 42000, medianHouse: 52000000, colIndex: 1.12, lat: 34.7050, lng: 135.4980 },
  { id: "jp-osaka-namba", city: "Namba", region: "Osaka", country: "JP", currency: "JPY", weeklyRent2br: 44000, medianHouse: 56000000, colIndex: 1.14, lat: 34.6660, lng: 135.5010 },
  { id: "jp-kyoto-nakagyo", city: "Nakagyo", region: "Kyoto", country: "JP", currency: "JPY", weeklyRent2br: 38000, medianHouse: 50000000, colIndex: 1.10, lat: 35.0110, lng: 135.7680 },

  // ===== CHINA (CNY) =====
  { id: "cn-sha-jingan", city: "Jing'an", region: "Shanghai", country: "CN", currency: "CNY", weeklyRent2br: 2300, medianHouse: 7800000, colIndex: 1.05, lat: 31.2290, lng: 121.4480 },
  { id: "cn-sha-pudong", city: "Pudong", region: "Shanghai", country: "CN", currency: "CNY", weeklyRent2br: 2000, medianHouse: 6500000, colIndex: 1.02, lat: 31.2210, lng: 121.5440 },
  { id: "cn-sha-minhang", city: "Minhang", region: "Shanghai", country: "CN", currency: "CNY", weeklyRent2br: 1400, medianHouse: 4200000, colIndex: 0.92, lat: 31.1120, lng: 121.3810 },
  { id: "cn-bj-chaoyang", city: "Chaoyang", region: "Beijing", country: "CN", currency: "CNY", weeklyRent2br: 2100, medianHouse: 7200000, colIndex: 1.03, lat: 39.9210, lng: 116.4430 },
  { id: "cn-bj-haidian", city: "Haidian", region: "Beijing", country: "CN", currency: "CNY", weeklyRent2br: 1900, medianHouse: 6800000, colIndex: 1.01, lat: 39.9590, lng: 116.2980 },
  { id: "cn-sz-futian", city: "Futian", region: "Shenzhen", country: "CN", currency: "CNY", weeklyRent2br: 1800, medianHouse: 6200000, colIndex: 1.00, lat: 22.5410, lng: 114.0550 },

  // ===== SOUTH KOREA (KRW) =====
  { id: "kr-seoul-gangnam", city: "Gangnam", region: "Seoul", country: "KR", currency: "KRW", weeklyRent2br: 480000, medianHouse: 1900000000, colIndex: 1.18, lat: 37.5172, lng: 127.0473 },
  { id: "kr-seoul-mapo", city: "Mapo", region: "Seoul", country: "KR", currency: "KRW", weeklyRent2br: 380000, medianHouse: 1200000000, colIndex: 1.10, lat: 37.5560, lng: 126.9100 },
  { id: "kr-seoul-nowon", city: "Nowon", region: "Seoul", country: "KR", currency: "KRW", weeklyRent2br: 280000, medianHouse: 750000000, colIndex: 1.00, lat: 37.6540, lng: 127.0560 },
  { id: "kr-busan-haeundae", city: "Haeundae", region: "Busan", country: "KR", currency: "KRW", weeklyRent2br: 300000, medianHouse: 720000000, colIndex: 0.98, lat: 35.1630, lng: 129.1640 },
  { id: "kr-busan-seo", city: "Seo-gu", region: "Busan", country: "KR", currency: "KRW", weeklyRent2br: 220000, medianHouse: 480000000, colIndex: 0.92, lat: 35.0980, lng: 129.0240 },

  // ===== SINGAPORE (SGD) =====
  { id: "sg-orchard", city: "Orchard", region: "Singapore", country: "SG", currency: "SGD", weeklyRent2br: 1500, medianHouse: 2800000, colIndex: 1.45, lat: 1.3040, lng: 103.8320 },
  { id: "sg-tiong-bahru", city: "Tiong Bahru", region: "Singapore", country: "SG", currency: "SGD", weeklyRent2br: 1250, medianHouse: 2100000, colIndex: 1.38, lat: 1.2860, lng: 103.8270 },
  { id: "sg-tampines", city: "Tampines", region: "Singapore", country: "SG", currency: "SGD", weeklyRent2br: 850, medianHouse: 650000, colIndex: 1.25, lat: 1.3496, lng: 103.9568 },
  { id: "sg-jurong-east", city: "Jurong East", region: "Singapore", country: "SG", currency: "SGD", weeklyRent2br: 800, medianHouse: 600000, colIndex: 1.22, lat: 1.3330, lng: 103.7420 },
  { id: "sg-woodlands", city: "Woodlands", region: "Singapore", country: "SG", currency: "SGD", weeklyRent2br: 720, medianHouse: 560000, colIndex: 1.20, lat: 1.4360, lng: 103.7860 },

  // ===== MALAYSIA (MYR) =====
  { id: "my-kl-klcc", city: "KLCC", region: "Kuala Lumpur", country: "MY", currency: "MYR", weeklyRent2br: 850, medianHouse: 1200000, colIndex: 0.62, lat: 3.1570, lng: 101.7120 },
  { id: "my-kl-bangsar", city: "Bangsar", region: "Kuala Lumpur", country: "MY", currency: "MYR", weeklyRent2br: 750, medianHouse: 1000000, colIndex: 0.60, lat: 3.1290, lng: 101.6700 },
  { id: "my-kl-cheras", city: "Cheras", region: "Kuala Lumpur", country: "MY", currency: "MYR", weeklyRent2br: 480, medianHouse: 550000, colIndex: 0.52, lat: 3.1040, lng: 101.7440 },
  { id: "my-pen-georgetown", city: "George Town", region: "Penang", country: "MY", currency: "MYR", weeklyRent2br: 460, medianHouse: 600000, colIndex: 0.54, lat: 5.4140, lng: 100.3290 },
  { id: "my-jb-central", city: "Johor Bahru Central", region: "Johor Bahru", country: "MY", currency: "MYR", weeklyRent2br: 400, medianHouse: 480000, colIndex: 0.50, lat: 1.4927, lng: 103.7414 },

  // ===== THAILAND (THB) =====
  { id: "th-bkk-sukhumvit", city: "Sukhumvit", region: "Bangkok", country: "TH", currency: "THB", weeklyRent2br: 6500, medianHouse: 8500000, colIndex: 0.62, lat: 13.7380, lng: 100.5600 },
  { id: "th-bkk-silom", city: "Silom", region: "Bangkok", country: "TH", currency: "THB", weeklyRent2br: 6000, medianHouse: 7800000, colIndex: 0.60, lat: 13.7250, lng: 100.5340 },
  { id: "th-bkk-lat-phrao", city: "Lat Phrao", region: "Bangkok", country: "TH", currency: "THB", weeklyRent2br: 3500, medianHouse: 3800000, colIndex: 0.52, lat: 13.8060, lng: 100.6010 },
  { id: "th-cnx-nimman", city: "Nimman", region: "Chiang Mai", country: "TH", currency: "THB", weeklyRent2br: 3000, medianHouse: 3200000, colIndex: 0.48, lat: 18.8000, lng: 98.9670 },
  { id: "th-phuket-patong", city: "Patong", region: "Phuket", country: "TH", currency: "THB", weeklyRent2br: 4000, medianHouse: 4500000, colIndex: 0.55, lat: 7.8960, lng: 98.2960 },

  // ===== INDONESIA (IDR) =====
  { id: "id-jkt-menteng", city: "Menteng", region: "Jakarta", country: "ID", currency: "IDR", weeklyRent2br: 3500000, medianHouse: 4500000000, colIndex: 0.55, lat: -6.1960, lng: 106.8320 },
  { id: "id-jkt-kuningan", city: "Kuningan", region: "Jakarta", country: "ID", currency: "IDR", weeklyRent2br: 3000000, medianHouse: 3800000000, colIndex: 0.53, lat: -6.2350, lng: 106.8290 },
  { id: "id-jkt-kebayoran", city: "Kebayoran Baru", region: "Jakarta", country: "ID", currency: "IDR", weeklyRent2br: 2200000, medianHouse: 2800000000, colIndex: 0.50, lat: -6.2440, lng: 106.7980 },
  { id: "id-bali-seminyak", city: "Seminyak", region: "Bali", country: "ID", currency: "IDR", weeklyRent2br: 2800000, medianHouse: 3500000000, colIndex: 0.52, lat: -8.6900, lng: 115.1680 },
  { id: "id-bali-canggu", city: "Canggu", region: "Bali", country: "ID", currency: "IDR", weeklyRent2br: 2500000, medianHouse: 3200000000, colIndex: 0.50, lat: -8.6480, lng: 115.1370 },

  // ===== PHILIPPINES (PHP) =====
  { id: "ph-mnl-makati", city: "Makati", region: "Manila", country: "PH", currency: "PHP", weeklyRent2br: 9000, medianHouse: 12000000, colIndex: 0.52, lat: 14.5547, lng: 121.0244 },
  { id: "ph-mnl-bgc", city: "BGC", region: "Manila", country: "PH", currency: "PHP", weeklyRent2br: 11000, medianHouse: 15000000, colIndex: 0.55, lat: 14.5510, lng: 121.0500 },
  { id: "ph-mnl-quezon", city: "Quezon City", region: "Manila", country: "PH", currency: "PHP", weeklyRent2br: 6000, medianHouse: 7500000, colIndex: 0.46, lat: 14.6760, lng: 121.0440 },
  { id: "ph-cebu-it-park", city: "Cebu IT Park", region: "Cebu", country: "PH", currency: "PHP", weeklyRent2br: 5500, medianHouse: 6500000, colIndex: 0.44, lat: 10.3290, lng: 123.9060 },

  // ===== VIETNAM (VND) =====
  { id: "vn-hcm-district-1", city: "District 1", region: "Ho Chi Minh City", country: "VN", currency: "VND", weeklyRent2br: 4500000, medianHouse: 6500000000, colIndex: 0.50, lat: 10.7770, lng: 106.7000 },
  { id: "vn-hcm-district-2", city: "District 2 (Thao Dien)", region: "Ho Chi Minh City", country: "VN", currency: "VND", weeklyRent2br: 4000000, medianHouse: 5800000000, colIndex: 0.48, lat: 10.8040, lng: 106.7400 },
  { id: "vn-hcm-binh-thanh", city: "Binh Thanh", region: "Ho Chi Minh City", country: "VN", currency: "VND", weeklyRent2br: 2500000, medianHouse: 3500000000, colIndex: 0.42, lat: 10.8040, lng: 106.7100 },
  { id: "vn-hanoi-hoan-kiem", city: "Hoan Kiem", region: "Hanoi", country: "VN", currency: "VND", weeklyRent2br: 3500000, medianHouse: 5000000000, colIndex: 0.46, lat: 21.0290, lng: 105.8520 },
  { id: "vn-hanoi-cau-giay", city: "Cau Giay", region: "Hanoi", country: "VN", currency: "VND", weeklyRent2br: 2200000, medianHouse: 3200000000, colIndex: 0.42, lat: 21.0310, lng: 105.7980 },

  // ===== INDIA (INR) =====
  { id: "in-mumbai-bandra", city: "Bandra", region: "Mumbai", country: "IN", currency: "INR", weeklyRent2br: 22000, medianHouse: 45000000, colIndex: 0.58, lat: 19.0596, lng: 72.8295 },
  { id: "in-mumbai-andheri", city: "Andheri", region: "Mumbai", country: "IN", currency: "INR", weeklyRent2br: 16000, medianHouse: 28000000, colIndex: 0.52, lat: 19.1190, lng: 72.8470 },
  { id: "in-mumbai-thane", city: "Thane", region: "Mumbai", country: "IN", currency: "INR", weeklyRent2br: 9000, medianHouse: 14000000, colIndex: 0.44, lat: 19.2180, lng: 72.9780 },
  { id: "in-blr-koramangala", city: "Koramangala", region: "Bangalore", country: "IN", currency: "INR", weeklyRent2br: 12000, medianHouse: 18000000, colIndex: 0.48, lat: 12.9350, lng: 77.6240 },
  { id: "in-blr-whitefield", city: "Whitefield", region: "Bangalore", country: "IN", currency: "INR", weeklyRent2br: 9000, medianHouse: 13000000, colIndex: 0.44, lat: 12.9700, lng: 77.7500 },
  { id: "in-delhi-saket", city: "Saket", region: "Delhi", country: "IN", currency: "INR", weeklyRent2br: 11000, medianHouse: 20000000, colIndex: 0.46, lat: 28.5240, lng: 77.2100 },
  { id: "in-delhi-dwarka", city: "Dwarka", region: "Delhi", country: "IN", currency: "INR", weeklyRent2br: 7000, medianHouse: 11000000, colIndex: 0.40, lat: 28.5920, lng: 77.0460 },

  // ===== HONG KONG (HKD) =====
  { id: "hk-central", city: "Central", region: "Hong Kong", country: "HK", currency: "HKD", weeklyRent2br: 9500, medianHouse: 18000000, colIndex: 1.42, lat: 22.2810, lng: 114.1580 },
  { id: "hk-causeway-bay", city: "Causeway Bay", region: "Hong Kong", country: "HK", currency: "HKD", weeklyRent2br: 8500, medianHouse: 15000000, colIndex: 1.38, lat: 22.2800, lng: 114.1850 },
  { id: "hk-sha-tin", city: "Sha Tin", region: "Hong Kong", country: "HK", currency: "HKD", weeklyRent2br: 5500, medianHouse: 9500000, colIndex: 1.25, lat: 22.3820, lng: 114.1880 },
  { id: "hk-tuen-mun", city: "Tuen Mun", region: "Hong Kong", country: "HK", currency: "HKD", weeklyRent2br: 4500, medianHouse: 7200000, colIndex: 1.18, lat: 22.3910, lng: 113.9770 },

  // ===== TAIWAN (TWD) =====
  { id: "tw-taipei-daan", city: "Da'an", region: "Taipei", country: "TW", currency: "TWD", weeklyRent2br: 9000, medianHouse: 32000000, colIndex: 0.85, lat: 25.0260, lng: 121.5430 },
  { id: "tw-taipei-xinyi", city: "Xinyi", region: "Taipei", country: "TW", currency: "TWD", weeklyRent2br: 9500, medianHouse: 36000000, colIndex: 0.88, lat: 25.0330, lng: 121.5670 },
  { id: "tw-taipei-banqiao", city: "Banqiao", region: "Taipei", country: "TW", currency: "TWD", weeklyRent2br: 6500, medianHouse: 20000000, colIndex: 0.78, lat: 25.0140, lng: 121.4670 },
  { id: "tw-kaohsiung-lingya", city: "Lingya", region: "Kaohsiung", country: "TW", currency: "TWD", weeklyRent2br: 4500, medianHouse: 13000000, colIndex: 0.70, lat: 22.6230, lng: 120.3200 },

  // ===== UNITED KINGDOM (GBP) =====
  { id: "gb-london-hackney", city: "Hackney", region: "London", country: "GB", currency: "GBP", weeklyRent2br: 480, medianHouse: 620000, colIndex: 1.40, lat: 51.5450, lng: -0.0550 },
  { id: "gb-london-camden", city: "Camden", region: "London", country: "GB", currency: "GBP", weeklyRent2br: 560, medianHouse: 780000, colIndex: 1.45, lat: 51.5390, lng: -0.1430 },
  { id: "gb-london-croydon", city: "Croydon", region: "London", country: "GB", currency: "GBP", weeklyRent2br: 360, medianHouse: 420000, colIndex: 1.28, lat: 51.3720, lng: -0.0990 },
  { id: "gb-london-greenwich", city: "Greenwich", region: "London", country: "GB", currency: "GBP", weeklyRent2br: 420, medianHouse: 530000, colIndex: 1.34, lat: 51.4820, lng: -0.0080 },
  { id: "gb-manchester-cc", city: "City Centre", region: "Manchester", country: "GB", currency: "GBP", weeklyRent2br: 320, medianHouse: 320000, colIndex: 1.12, lat: 53.4808, lng: -2.2426 },
  { id: "gb-manchester-salford", city: "Salford", region: "Manchester", country: "GB", currency: "GBP", weeklyRent2br: 280, medianHouse: 250000, colIndex: 1.06, lat: 53.4880, lng: -2.2900 },
  { id: "gb-edinburgh-leith", city: "Leith", region: "Edinburgh", country: "GB", currency: "GBP", weeklyRent2br: 320, medianHouse: 300000, colIndex: 1.15, lat: 55.9760, lng: -3.1700 },
  { id: "gb-edinburgh-newtown", city: "New Town", region: "Edinburgh", country: "GB", currency: "GBP", weeklyRent2br: 400, medianHouse: 520000, colIndex: 1.22, lat: 55.9560, lng: -3.1980 },

  // ===== IRELAND (EUR) =====
  { id: "ie-dublin-city-centre", city: "City Centre", region: "Dublin", country: "IE", currency: "EUR", weeklyRent2br: 580, medianHouse: 520000, colIndex: 1.32, lat: 53.3498, lng: -6.2603 },
  { id: "ie-dublin-rathmines", city: "Rathmines", region: "Dublin", country: "IE", currency: "EUR", weeklyRent2br: 620, medianHouse: 580000, colIndex: 1.34, lat: 53.3210, lng: -6.2650 },
  { id: "ie-cork-city", city: "Cork City", region: "Cork", country: "IE", currency: "EUR", weeklyRent2br: 440, medianHouse: 380000, colIndex: 1.18, lat: 51.8985, lng: -8.4756 },

  // ===== FRANCE (EUR) =====
  { id: "fr-paris-marais", city: "Le Marais", region: "Paris", country: "FR", currency: "EUR", weeklyRent2br: 520, medianHouse: 980000, colIndex: 1.30, lat: 48.8590, lng: 2.3620 },
  { id: "fr-paris-montmartre", city: "Montmartre", region: "Paris", country: "FR", currency: "EUR", weeklyRent2br: 460, medianHouse: 820000, colIndex: 1.26, lat: 48.8870, lng: 2.3410 },
  { id: "fr-paris-belleville", city: "Belleville", region: "Paris", country: "FR", currency: "EUR", weeklyRent2br: 400, medianHouse: 680000, colIndex: 1.20, lat: 48.8720, lng: 2.3830 },
  { id: "fr-lyon-presquile", city: "Presqu'île", region: "Lyon", country: "FR", currency: "EUR", weeklyRent2br: 320, medianHouse: 480000, colIndex: 1.08, lat: 45.7600, lng: 4.8330 },
  { id: "fr-marseille-vieux-port", city: "Vieux-Port", region: "Marseille", country: "FR", currency: "EUR", weeklyRent2br: 270, medianHouse: 360000, colIndex: 1.00, lat: 43.2950, lng: 5.3740 },

  // ===== GERMANY (EUR) =====
  { id: "de-berlin-mitte", city: "Mitte", region: "Berlin", country: "DE", currency: "EUR", weeklyRent2br: 360, medianHouse: 620000, colIndex: 1.16, lat: 52.5200, lng: 13.4050 },
  { id: "de-berlin-kreuzberg", city: "Kreuzberg", region: "Berlin", country: "DE", currency: "EUR", weeklyRent2br: 340, medianHouse: 560000, colIndex: 1.14, lat: 52.4990, lng: 13.4030 },
  { id: "de-berlin-neukolln", city: "Neukölln", region: "Berlin", country: "DE", currency: "EUR", weeklyRent2br: 300, medianHouse: 460000, colIndex: 1.08, lat: 52.4810, lng: 13.4350 },
  { id: "de-munich-schwabing", city: "Schwabing", region: "Munich", country: "DE", currency: "EUR", weeklyRent2br: 460, medianHouse: 980000, colIndex: 1.28, lat: 48.1660, lng: 11.5870 },
  { id: "de-munich-sendling", city: "Sendling", region: "Munich", country: "DE", currency: "EUR", weeklyRent2br: 420, medianHouse: 820000, colIndex: 1.24, lat: 48.1170, lng: 11.5460 },
  { id: "de-hamburg-altona", city: "Altona", region: "Hamburg", country: "DE", currency: "EUR", weeklyRent2br: 350, medianHouse: 580000, colIndex: 1.15, lat: 53.5510, lng: 9.9350 },

  // ===== SPAIN (EUR) =====
  { id: "es-madrid-salamanca", city: "Salamanca", region: "Madrid", country: "ES", currency: "EUR", weeklyRent2br: 380, medianHouse: 720000, colIndex: 1.04, lat: 40.4300, lng: -3.6790 },
  { id: "es-madrid-lavapies", city: "Lavapiés", region: "Madrid", country: "ES", currency: "EUR", weeklyRent2br: 290, medianHouse: 420000, colIndex: 0.96, lat: 40.4090, lng: -3.7000 },
  { id: "es-barcelona-eixample", city: "Eixample", region: "Barcelona", country: "ES", currency: "EUR", weeklyRent2br: 360, medianHouse: 620000, colIndex: 1.06, lat: 41.3880, lng: 2.1620 },
  { id: "es-barcelona-gracia", city: "Gràcia", region: "Barcelona", country: "ES", currency: "EUR", weeklyRent2br: 330, medianHouse: 540000, colIndex: 1.02, lat: 41.4030, lng: 2.1560 },
  { id: "es-valencia-ruzafa", city: "Ruzafa", region: "Valencia", country: "ES", currency: "EUR", weeklyRent2br: 250, medianHouse: 320000, colIndex: 0.90, lat: 39.4600, lng: -0.3760 },

  // ===== ITALY (EUR) =====
  { id: "it-milan-navigli", city: "Navigli", region: "Milan", country: "IT", currency: "EUR", weeklyRent2br: 420, medianHouse: 680000, colIndex: 1.14, lat: 45.4520, lng: 9.1750 },
  { id: "it-milan-isola", city: "Isola", region: "Milan", country: "IT", currency: "EUR", weeklyRent2br: 400, medianHouse: 640000, colIndex: 1.12, lat: 45.4880, lng: 9.1880 },
  { id: "it-rome-trastevere", city: "Trastevere", region: "Rome", country: "IT", currency: "EUR", weeklyRent2br: 360, medianHouse: 580000, colIndex: 1.06, lat: 41.8890, lng: 12.4690 },
  { id: "it-rome-monti", city: "Monti", region: "Rome", country: "IT", currency: "EUR", weeklyRent2br: 380, medianHouse: 620000, colIndex: 1.08, lat: 41.8950, lng: 12.4910 },

  // ===== NETHERLANDS (EUR) =====
  { id: "nl-amsterdam-jordaan", city: "Jordaan", region: "Amsterdam", country: "NL", currency: "EUR", weeklyRent2br: 520, medianHouse: 720000, colIndex: 1.26, lat: 52.3740, lng: 4.8810 },
  { id: "nl-amsterdam-de-pijp", city: "De Pijp", region: "Amsterdam", country: "NL", currency: "EUR", weeklyRent2br: 490, medianHouse: 660000, colIndex: 1.24, lat: 52.3540, lng: 4.8920 },
  { id: "nl-rotterdam-centrum", city: "Centrum", region: "Rotterdam", country: "NL", currency: "EUR", weeklyRent2br: 380, medianHouse: 420000, colIndex: 1.14, lat: 51.9220, lng: 4.4790 },
  { id: "nl-utrecht-centrum", city: "Centrum", region: "Utrecht", country: "NL", currency: "EUR", weeklyRent2br: 400, medianHouse: 480000, colIndex: 1.16, lat: 52.0900, lng: 5.1210 },

  // ===== PORTUGAL (EUR) =====
  { id: "pt-lisbon-chiado", city: "Chiado", region: "Lisbon", country: "PT", currency: "EUR", weeklyRent2br: 350, medianHouse: 580000, colIndex: 0.94, lat: 38.7100, lng: -9.1420 },
  { id: "pt-lisbon-alfama", city: "Alfama", region: "Lisbon", country: "PT", currency: "EUR", weeklyRent2br: 300, medianHouse: 460000, colIndex: 0.90, lat: 38.7120, lng: -9.1290 },
  { id: "pt-porto-cedofeita", city: "Cedofeita", region: "Porto", country: "PT", currency: "EUR", weeklyRent2br: 250, medianHouse: 360000, colIndex: 0.84, lat: 41.1530, lng: -8.6200 },

  // ===== SWEDEN (SEK) =====
  { id: "se-stockholm-sodermalm", city: "Södermalm", region: "Stockholm", country: "SE", currency: "SEK", weeklyRent2br: 4200, medianHouse: 6800000, colIndex: 1.22, lat: 59.3140, lng: 18.0700 },
  { id: "se-stockholm-vasastan", city: "Vasastan", region: "Stockholm", country: "SE", currency: "SEK", weeklyRent2br: 4500, medianHouse: 7400000, colIndex: 1.24, lat: 59.3430, lng: 18.0500 },
  { id: "se-gothenburg-centrum", city: "Centrum", region: "Gothenburg", country: "SE", currency: "SEK", weeklyRent2br: 3400, medianHouse: 4800000, colIndex: 1.12, lat: 57.7000, lng: 11.9700 },

  // ===== NORWAY (NOK) =====
  { id: "no-oslo-frogner", city: "Frogner", region: "Oslo", country: "NO", currency: "NOK", weeklyRent2br: 5500, medianHouse: 8500000, colIndex: 1.34, lat: 59.9210, lng: 10.7050 },
  { id: "no-oslo-grunerlokka", city: "Grünerløkka", region: "Oslo", country: "NO", currency: "NOK", weeklyRent2br: 4800, medianHouse: 7200000, colIndex: 1.30, lat: 59.9230, lng: 10.7600 },
  { id: "no-bergen-sentrum", city: "Sentrum", region: "Bergen", country: "NO", currency: "NOK", weeklyRent2br: 4000, medianHouse: 5800000, colIndex: 1.24, lat: 60.3910, lng: 5.3240 },

  // ===== DENMARK (DKK) =====
  { id: "dk-copenhagen-norrebro", city: "Nørrebro", region: "Copenhagen", country: "DK", currency: "DKK", weeklyRent2br: 3000, medianHouse: 4200000, colIndex: 1.28, lat: 55.6970, lng: 12.5530 },
  { id: "dk-copenhagen-vesterbro", city: "Vesterbro", region: "Copenhagen", country: "DK", currency: "DKK", weeklyRent2br: 3300, medianHouse: 4800000, colIndex: 1.30, lat: 55.6680, lng: 12.5470 },
  { id: "dk-aarhus-midtby", city: "Midtbyen", region: "Aarhus", country: "DK", currency: "DKK", weeklyRent2br: 2400, medianHouse: 3200000, colIndex: 1.16, lat: 56.1530, lng: 10.2030 },

  // ===== SWITZERLAND (CHF) =====
  { id: "ch-zurich-kreis-4", city: "Kreis 4", region: "Zurich", country: "CH", currency: "CHF", weeklyRent2br: 720, medianHouse: 1650000, colIndex: 1.62, lat: 47.3740, lng: 8.5260 },
  { id: "ch-zurich-kreis-6", city: "Kreis 6", region: "Zurich", country: "CH", currency: "CHF", weeklyRent2br: 780, medianHouse: 1850000, colIndex: 1.65, lat: 47.3870, lng: 8.5450 },
  { id: "ch-geneva-eaux-vives", city: "Eaux-Vives", region: "Geneva", country: "CH", currency: "CHF", weeklyRent2br: 760, medianHouse: 1750000, colIndex: 1.60, lat: 46.2010, lng: 6.1620 },
  { id: "ch-zurich-oerlikon", city: "Oerlikon", region: "Zurich", country: "CH", currency: "CHF", weeklyRent2br: 640, medianHouse: 1350000, colIndex: 1.56, lat: 47.4110, lng: 8.5450 },

  // ===== POLAND (PLN) =====
  { id: "pl-warsaw-srodmiescie", city: "Śródmieście", region: "Warsaw", country: "PL", currency: "PLN", weeklyRent2br: 950, medianHouse: 1100000, colIndex: 0.70, lat: 52.2300, lng: 21.0110 },
  { id: "pl-warsaw-praga", city: "Praga", region: "Warsaw", country: "PL", currency: "PLN", weeklyRent2br: 750, medianHouse: 820000, colIndex: 0.64, lat: 52.2520, lng: 21.0400 },
  { id: "pl-krakow-stare-miasto", city: "Stare Miasto", region: "Krakow", country: "PL", currency: "PLN", weeklyRent2br: 800, medianHouse: 900000, colIndex: 0.66, lat: 50.0620, lng: 19.9380 },

  // ===== CZECH REPUBLIC (CZK) =====
  { id: "cz-prague-vinohrady", city: "Vinohrady", region: "Prague", country: "CZ", currency: "CZK", weeklyRent2br: 6000, medianHouse: 9500000, colIndex: 0.82, lat: 50.0770, lng: 14.4470 },
  { id: "cz-prague-zizkov", city: "Žižkov", region: "Prague", country: "CZ", currency: "CZK", weeklyRent2br: 5200, medianHouse: 8200000, colIndex: 0.78, lat: 50.0870, lng: 14.4500 },
  { id: "cz-brno-stred", city: "Brno-střed", region: "Brno", country: "CZ", currency: "CZK", weeklyRent2br: 4200, medianHouse: 6500000, colIndex: 0.72, lat: 49.1950, lng: 16.6080 },

  // ===== UNITED STATES (USD) =====
  { id: "us-nyc-brooklyn", city: "Brooklyn", region: "New York", country: "US", currency: "USD", weeklyRent2br: 950, medianHouse: 950000, colIndex: 1.50, lat: 40.6782, lng: -73.9442 },
  { id: "us-nyc-manhattan", city: "Manhattan", region: "New York", country: "US", currency: "USD", weeklyRent2br: 1300, medianHouse: 1450000, colIndex: 1.62, lat: 40.7831, lng: -73.9712 },
  { id: "us-nyc-queens", city: "Queens", region: "New York", country: "US", currency: "USD", weeklyRent2br: 780, medianHouse: 720000, colIndex: 1.40, lat: 40.7282, lng: -73.7949 },
  { id: "us-nyc-jersey-city", city: "Jersey City", region: "New York", country: "US", currency: "USD", weeklyRent2br: 720, medianHouse: 640000, colIndex: 1.34, lat: 40.7178, lng: -74.0431 },
  { id: "us-sf-mission", city: "Mission District", region: "San Francisco", country: "US", currency: "USD", weeklyRent2br: 1150, medianHouse: 1450000, colIndex: 1.66, lat: 37.7599, lng: -122.4148 },
  { id: "us-sf-oakland", city: "Oakland", region: "San Francisco", country: "US", currency: "USD", weeklyRent2br: 820, medianHouse: 880000, colIndex: 1.46, lat: 37.8044, lng: -122.2712 },
  { id: "us-sf-san-jose", city: "San Jose", region: "San Francisco", country: "US", currency: "USD", weeklyRent2br: 900, medianHouse: 1350000, colIndex: 1.52, lat: 37.3382, lng: -121.8863 },
  { id: "us-austin-downtown", city: "Downtown", region: "Austin", country: "US", currency: "USD", weeklyRent2br: 620, medianHouse: 620000, colIndex: 1.18, lat: 30.2672, lng: -97.7431 },
  { id: "us-austin-east", city: "East Austin", region: "Austin", country: "US", currency: "USD", weeklyRent2br: 560, medianHouse: 540000, colIndex: 1.14, lat: 30.2640, lng: -97.7140 },
  { id: "us-austin-round-rock", city: "Round Rock", region: "Austin", country: "US", currency: "USD", weeklyRent2br: 480, medianHouse: 420000, colIndex: 1.06, lat: 30.5083, lng: -97.6789 },

  // ===== CANADA (CAD) =====
  { id: "ca-toronto-downtown", city: "Downtown", region: "Toronto", country: "CA", currency: "CAD", weeklyRent2br: 780, medianHouse: 1050000, colIndex: 1.24, lat: 43.6532, lng: -79.3832 },
  { id: "ca-toronto-scarborough", city: "Scarborough", region: "Toronto", country: "CA", currency: "CAD", weeklyRent2br: 600, medianHouse: 820000, colIndex: 1.12, lat: 43.7730, lng: -79.2580 },
  { id: "ca-toronto-mississauga", city: "Mississauga", region: "Toronto", country: "CA", currency: "CAD", weeklyRent2br: 640, medianHouse: 880000, colIndex: 1.14, lat: 43.5890, lng: -79.6440 },
  { id: "ca-vancouver-downtown", city: "Downtown", region: "Vancouver", country: "CA", currency: "CAD", weeklyRent2br: 820, medianHouse: 1250000, colIndex: 1.28, lat: 49.2827, lng: -123.1207 },
  { id: "ca-vancouver-burnaby", city: "Burnaby", region: "Vancouver", country: "CA", currency: "CAD", weeklyRent2br: 700, medianHouse: 1050000, colIndex: 1.20, lat: 49.2480, lng: -122.9800 },
  { id: "ca-montreal-plateau", city: "Le Plateau", region: "Montreal", country: "CA", currency: "CAD", weeklyRent2br: 520, medianHouse: 620000, colIndex: 1.08, lat: 45.5240, lng: -73.5820 },
  { id: "ca-montreal-verdun", city: "Verdun", region: "Montreal", country: "CA", currency: "CAD", weeklyRent2br: 480, medianHouse: 560000, colIndex: 1.04, lat: 45.4580, lng: -73.5680 },

  // ===== MEXICO (MXN) =====
  { id: "mx-cdmx-roma", city: "Roma Norte", region: "Mexico City", country: "MX", currency: "MXN", weeklyRent2br: 6500, medianHouse: 7500000, colIndex: 0.58, lat: 19.4170, lng: -99.1620 },
  { id: "mx-cdmx-condesa", city: "Condesa", region: "Mexico City", country: "MX", currency: "MXN", weeklyRent2br: 6800, medianHouse: 8000000, colIndex: 0.60, lat: 19.4110, lng: -99.1730 },
  { id: "mx-cdmx-coyoacan", city: "Coyoacán", region: "Mexico City", country: "MX", currency: "MXN", weeklyRent2br: 4500, medianHouse: 5200000, colIndex: 0.52, lat: 19.3500, lng: -99.1620 },
  { id: "mx-guadalajara-centro", city: "Centro", region: "Guadalajara", country: "MX", currency: "MXN", weeklyRent2br: 3500, medianHouse: 3800000, colIndex: 0.46, lat: 20.6760, lng: -103.3470 },

  // ===== BRAZIL (BRL) =====
  { id: "br-sp-pinheiros", city: "Pinheiros", region: "São Paulo", country: "BR", currency: "BRL", weeklyRent2br: 950, medianHouse: 1100000, colIndex: 0.62, lat: -23.5610, lng: -46.6820 },
  { id: "br-sp-moema", city: "Moema", region: "São Paulo", country: "BR", currency: "BRL", weeklyRent2br: 1050, medianHouse: 1300000, colIndex: 0.64, lat: -23.6000, lng: -46.6650 },
  { id: "br-sp-tatuape", city: "Tatuapé", region: "São Paulo", country: "BR", currency: "BRL", weeklyRent2br: 650, medianHouse: 720000, colIndex: 0.54, lat: -23.5400, lng: -46.5760 },
  { id: "br-rio-copacabana", city: "Copacabana", region: "Rio de Janeiro", country: "BR", currency: "BRL", weeklyRent2br: 900, medianHouse: 1050000, colIndex: 0.60, lat: -22.9710, lng: -43.1820 },
  { id: "br-rio-tijuca", city: "Tijuca", region: "Rio de Janeiro", country: "BR", currency: "BRL", weeklyRent2br: 600, medianHouse: 650000, colIndex: 0.52, lat: -22.9240, lng: -43.2330 },

  // ===== ARGENTINA (ARS) =====
  { id: "ar-ba-palermo", city: "Palermo", region: "Buenos Aires", country: "AR", currency: "ARS", weeklyRent2br: 95000, medianHouse: 140000000, colIndex: 0.48, lat: -34.5880, lng: -58.4300 },
  { id: "ar-ba-recoleta", city: "Recoleta", region: "Buenos Aires", country: "AR", currency: "ARS", weeklyRent2br: 105000, medianHouse: 160000000, colIndex: 0.50, lat: -34.5870, lng: -58.3930 },
  { id: "ar-ba-belgrano", city: "Belgrano", region: "Buenos Aires", country: "AR", currency: "ARS", weeklyRent2br: 80000, medianHouse: 120000000, colIndex: 0.44, lat: -34.5620, lng: -58.4560 },

  // ===== CHILE (CLP) =====
  { id: "cl-santiago-providencia", city: "Providencia", region: "Santiago", country: "CL", currency: "CLP", weeklyRent2br: 160000, medianHouse: 180000000, colIndex: 0.66, lat: -33.4250, lng: -70.6100 },
  { id: "cl-santiago-las-condes", city: "Las Condes", region: "Santiago", country: "CL", currency: "CLP", weeklyRent2br: 190000, medianHouse: 220000000, colIndex: 0.70, lat: -33.4090, lng: -70.5660 },
  { id: "cl-santiago-nunoa", city: "Ñuñoa", region: "Santiago", country: "CL", currency: "CLP", weeklyRent2br: 130000, medianHouse: 150000000, colIndex: 0.60, lat: -33.4560, lng: -70.5970 },

  // ===== COLOMBIA (COP) =====
  { id: "co-bogota-chapinero", city: "Chapinero", region: "Bogotá", country: "CO", currency: "COP", weeklyRent2br: 700000, medianHouse: 600000000, colIndex: 0.46, lat: 4.6450, lng: -74.0630 },
  { id: "co-bogota-usaquen", city: "Usaquén", region: "Bogotá", country: "CO", currency: "COP", weeklyRent2br: 850000, medianHouse: 750000000, colIndex: 0.50, lat: 4.6950, lng: -74.0310 },
  { id: "co-medellin-el-poblado", city: "El Poblado", region: "Medellín", country: "CO", currency: "COP", weeklyRent2br: 750000, medianHouse: 650000000, colIndex: 0.48, lat: 6.2090, lng: -75.5680 },

  // ===== PERU (PEN) =====
  { id: "pe-lima-miraflores", city: "Miraflores", region: "Lima", country: "PE", currency: "PEN", weeklyRent2br: 850, medianHouse: 900000, colIndex: 0.52, lat: -12.1210, lng: -77.0290 },
  { id: "pe-lima-barranco", city: "Barranco", region: "Lima", country: "PE", currency: "PEN", weeklyRent2br: 780, medianHouse: 820000, colIndex: 0.50, lat: -12.1490, lng: -77.0210 },
  { id: "pe-lima-san-isidro", city: "San Isidro", region: "Lima", country: "PE", currency: "PEN", weeklyRent2br: 1000, medianHouse: 1100000, colIndex: 0.56, lat: -12.0970, lng: -77.0360 },

  // ===== UAE (AED) =====
  { id: "ae-dubai-marina", city: "Dubai Marina", region: "Dubai", country: "AE", currency: "AED", weeklyRent2br: 3200, medianHouse: 2400000, colIndex: 1.08, lat: 25.0800, lng: 55.1400 },
  { id: "ae-dubai-jlt", city: "JLT", region: "Dubai", country: "AE", currency: "AED", weeklyRent2br: 2700, medianHouse: 1900000, colIndex: 1.02, lat: 25.0690, lng: 55.1410 },
  { id: "ae-dubai-deira", city: "Deira", region: "Dubai", country: "AE", currency: "AED", weeklyRent2br: 1800, medianHouse: 1200000, colIndex: 0.92, lat: 25.2710, lng: 55.3140 },
  { id: "ae-abudhabi-corniche", city: "Corniche", region: "Abu Dhabi", country: "AE", currency: "AED", weeklyRent2br: 2600, medianHouse: 1800000, colIndex: 1.00, lat: 24.4750, lng: 54.3340 },

  // ===== SAUDI ARABIA (SAR) =====
  { id: "sa-riyadh-olaya", city: "Olaya", region: "Riyadh", country: "SA", currency: "SAR", weeklyRent2br: 1700, medianHouse: 1400000, colIndex: 0.78, lat: 24.6900, lng: 46.6850 },
  { id: "sa-riyadh-malaz", city: "Al Malaz", region: "Riyadh", country: "SA", currency: "SAR", weeklyRent2br: 1300, medianHouse: 1000000, colIndex: 0.72, lat: 24.6650, lng: 46.7300 },
  { id: "sa-jeddah-corniche", city: "Corniche", region: "Jeddah", country: "SA", currency: "SAR", weeklyRent2br: 1500, medianHouse: 1200000, colIndex: 0.74, lat: 21.5430, lng: 39.1730 },

  // ===== QATAR (QAR) =====
  { id: "qa-doha-west-bay", city: "West Bay", region: "Doha", country: "QA", currency: "QAR", weeklyRent2br: 2200, medianHouse: 1900000, colIndex: 1.05, lat: 25.3210, lng: 51.5310 },
  { id: "qa-doha-pearl", city: "The Pearl", region: "Doha", country: "QA", currency: "QAR", weeklyRent2br: 2600, medianHouse: 2300000, colIndex: 1.10, lat: 25.3690, lng: 51.5510 },
  { id: "qa-doha-al-sadd", city: "Al Sadd", region: "Doha", country: "QA", currency: "QAR", weeklyRent2br: 1700, medianHouse: 1400000, colIndex: 0.98, lat: 25.2820, lng: 51.4900 },

  // ===== ISRAEL (ILS) =====
  { id: "il-tel-aviv-center", city: "City Center", region: "Tel Aviv", country: "IL", currency: "ILS", weeklyRent2br: 1850, medianHouse: 3200000, colIndex: 1.30, lat: 32.0700, lng: 34.7800 },
  { id: "il-tel-aviv-florentin", city: "Florentin", region: "Tel Aviv", country: "IL", currency: "ILS", weeklyRent2br: 1600, medianHouse: 2700000, colIndex: 1.24, lat: 32.0560, lng: 34.7700 },
  { id: "il-jerusalem-rehavia", city: "Rehavia", region: "Jerusalem", country: "IL", currency: "ILS", weeklyRent2br: 1400, medianHouse: 2600000, colIndex: 1.16, lat: 31.7720, lng: 35.2080 },

  // ===== TURKEY (TRY) =====
  { id: "tr-istanbul-kadikoy", city: "Kadıköy", region: "Istanbul", country: "TR", currency: "TRY", weeklyRent2br: 7000, medianHouse: 6500000, colIndex: 0.42, lat: 40.9900, lng: 29.0280 },
  { id: "tr-istanbul-besiktas", city: "Beşiktaş", region: "Istanbul", country: "TR", currency: "TRY", weeklyRent2br: 8500, medianHouse: 8000000, colIndex: 0.46, lat: 41.0420, lng: 29.0070 },
  { id: "tr-istanbul-uskudar", city: "Üsküdar", region: "Istanbul", country: "TR", currency: "TRY", weeklyRent2br: 6000, medianHouse: 5500000, colIndex: 0.40, lat: 41.0260, lng: 29.0150 },
  { id: "tr-ankara-cankaya", city: "Çankaya", region: "Ankara", country: "TR", currency: "TRY", weeklyRent2br: 4500, medianHouse: 4000000, colIndex: 0.36, lat: 39.9080, lng: 32.8620 },

  // ===== SOUTH AFRICA (ZAR) =====
  { id: "za-cape-town-cbd", city: "City Bowl", region: "Cape Town", country: "ZA", currency: "ZAR", weeklyRent2br: 4000, medianHouse: 2800000, colIndex: 0.62, lat: -33.9250, lng: 18.4240 },
  { id: "za-cape-town-sea-point", city: "Sea Point", region: "Cape Town", country: "ZA", currency: "ZAR", weeklyRent2br: 4500, medianHouse: 3200000, colIndex: 0.66, lat: -33.9170, lng: 18.3840 },
  { id: "za-cape-town-observatory", city: "Observatory", region: "Cape Town", country: "ZA", currency: "ZAR", weeklyRent2br: 2800, medianHouse: 1800000, colIndex: 0.54, lat: -33.9370, lng: 18.4660 },
  { id: "za-jhb-sandton", city: "Sandton", region: "Johannesburg", country: "ZA", currency: "ZAR", weeklyRent2br: 3500, medianHouse: 2400000, colIndex: 0.58, lat: -26.1070, lng: 28.0560 },
  { id: "za-jhb-rosebank", city: "Rosebank", region: "Johannesburg", country: "ZA", currency: "ZAR", weeklyRent2br: 3200, medianHouse: 2100000, colIndex: 0.56, lat: -26.1450, lng: 28.0410 },

  // ===== EGYPT (EGP) =====
  { id: "eg-cairo-zamalek", city: "Zamalek", region: "Cairo", country: "EG", currency: "EGP", weeklyRent2br: 5500, medianHouse: 6500000, colIndex: 0.40, lat: 30.0610, lng: 31.2200 },
  { id: "eg-cairo-maadi", city: "Maadi", region: "Cairo", country: "EG", currency: "EGP", weeklyRent2br: 4500, medianHouse: 5000000, colIndex: 0.36, lat: 29.9600, lng: 31.2570 },
  { id: "eg-cairo-nasr-city", city: "Nasr City", region: "Cairo", country: "EG", currency: "EGP", weeklyRent2br: 3000, medianHouse: 3200000, colIndex: 0.30, lat: 30.0560, lng: 31.3300 },

  // ===== NIGERIA (NGN) =====
  { id: "ng-lagos-ikoyi", city: "Ikoyi", region: "Lagos", country: "NG", currency: "NGN", weeklyRent2br: 900000, medianHouse: 250000000, colIndex: 0.54, lat: 6.4520, lng: 3.4350 },
  { id: "ng-lagos-lekki", city: "Lekki", region: "Lagos", country: "NG", currency: "NGN", weeklyRent2br: 600000, medianHouse: 150000000, colIndex: 0.48, lat: 6.4410, lng: 3.5450 },
  { id: "ng-lagos-yaba", city: "Yaba", region: "Lagos", country: "NG", currency: "NGN", weeklyRent2br: 280000, medianHouse: 65000000, colIndex: 0.40, lat: 6.5070, lng: 3.3790 },

  // ===== KENYA (KES) =====
  { id: "ke-nairobi-kilimani", city: "Kilimani", region: "Nairobi", country: "KE", currency: "KES", weeklyRent2br: 19000, medianHouse: 16000000, colIndex: 0.46, lat: -1.2920, lng: 36.7860 },
  { id: "ke-nairobi-westlands", city: "Westlands", region: "Nairobi", country: "KE", currency: "KES", weeklyRent2br: 23000, medianHouse: 20000000, colIndex: 0.50, lat: -1.2670, lng: 36.8030 },
  { id: "ke-nairobi-south-b", city: "South B", region: "Nairobi", country: "KE", currency: "KES", weeklyRent2br: 12000, medianHouse: 9000000, colIndex: 0.38, lat: -1.3080, lng: 36.8350 },
];

export function getArea(id: string): Area | undefined {
  return AREAS.find((a) => a.id === id);
}

export const AREAS_BY_COUNTRY: Record<string, Area[]> = AREAS.reduce<Record<string, Area[]>>((acc, a) => {
  (acc[a.country] ??= []).push(a);
  return acc;
}, {});

// Country codes that actually have destination data, in dataset order.
export const DESTINATION_COUNTRIES: string[] = AREAS.reduce<string[]>((acc, a) => {
  if (!acc.includes(a.country)) acc.push(a.country);
  return acc;
}, []);

// Group a country's areas by their metro/region, preserving order.
export function areasByRegion(country: string): Record<string, Area[]> {
  return (AREAS_BY_COUNTRY[country] ?? []).reduce<Record<string, Area[]>>((acc, a) => {
    (acc[a.region] ??= []).push(a);
    return acc;
  }, {});
}

// Map an AU metro to its state/territory so relocation can tell a same-city
// move from interstate. Empty for non-AU destinations.
const AU_REGION_STATE: Record<string, string> = {
  Adelaide: "SA",
  Melbourne: "VIC",
  Sydney: "NSW",
  Brisbane: "QLD",
  "Gold Coast": "QLD",
  Perth: "WA",
  Canberra: "ACT",
  Hobart: "TAS",
  Darwin: "NT",
};

export function areaState(a: Area): string {
  return a.country === "AU" ? AU_REGION_STATE[a.region] ?? "" : "";
}
