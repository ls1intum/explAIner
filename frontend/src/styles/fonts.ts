/* eslint-disable @typescript-eslint/no-unused-vars */
import { Montserrat } from "next/font/google";
import { Outfit } from "next/font/google";
import { DM_Sans } from "next/font/google";
import { Sora } from "next/font/google";
import { Questrial } from "next/font/google";
import { Urbanist } from "next/font/google";
import { Archivo } from "next/font/google";
import { Lexend } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });
const sora = Sora({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const questrial = Questrial({ subsets: ["latin"], weight: ["400"] });
const urbanist = Urbanist({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const archivo = Archivo({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const lexend = Lexend({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

////////////////////////////////////////////////////////////////////////////
// Choose your font here: simply uncomment the line you want to use :)
////////////////////////////////////////////////////////////////////////////

// export const selectedFont = montserrat.className;
// export const selectedFont = outfit.className;
// export const selectedFont = dmSans.className;
// export const selectedFont = sora.className;
// export const selectedFont = questrial.className;
// export const selectedFont = urbanist.className;
// export const selectedFont = archivo.className;
export const selectedFont = lexend.className;
