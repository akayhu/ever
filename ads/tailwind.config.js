const { colors, fontSize } = require("tailwindcss/defaultTheme");

module.exports = {
  // important: true,
  purge: {
    content: ["./src/**/*.vue", "./src/**/*.html"]
  },
  content: [],
  theme: {
    fontSize: {
      ...fontSize,
      12: [
        "12px",
        {
          letterSpacing: "1.5px",
          lineHeight: "18px"
        }
      ],
      14: [
        "14px",
        {
          letterSpacing: "1.43px",
          lineHeight: "20px"
        }
      ],
      16: [
        "16px",
        {
          letterSpacing: "1.36px",
          lineHeight: "1.38"
        }
      ],
      18: [
        "18px",
        {
          letterSpacing: "1px",
          lineHeight: "24px"
        }
      ],
      20: [
        "20px",
        {
          letterSpacing: "1.4px",
          lineHeight: "28px"
        }
      ],
      22: [
        "22px",
        {
          letterSpacing: "0.92px",
          lineHeight: "30px"
        }
      ],
      28: [
        "28px",
        {
          letterSpacing: "1.36px",
          lineHeight: "38px"
        }
      ]
    },
    extend: {
      colors: {
        gray: {
          ...colors.gray,
          100: "#f8f9fa",
          200: "#e9ecef",
          300: "#f3f3f3",
          333: "#333",
          400: "#eeeeee",
          500: "#dddddd",
          600: "#a9a9a9",
          700: "#7e7e7e",
          800: "#343a40",
          900: "#292929"
        },
        blue: {
          ...colors.blue,
          default: "#1654b9"
        },
        "blue-light": "#4e91ff",
        "blue-lake": "#39c8d0",
        "blue-lake-light": "#e6f9fa",
        "blue-turquoise": "#00afb8",
        "blue-text": "#00b2ba",
        "blue-text-dark": "#19b9c0",
        "blue-oyster": "#d2f2f4",
        "blue-pale": "#8debc8",
        indigo: "#6610f2",
        purple: {
          ...colors.purple,
          default: "#78269f"
        },
        pink: "#e83e8c",
        red: "#ea475b",
        orange: {
          ...colors.orange,
          default: "#ffeedf"
        },
        yellow: "#ffc31b",
        green: "#28a745",
        "green-apple": "#92cf53",
        "green-grass": "#6fb827",
        teal: "#20c997",
        cyan: "#17a2b8",
        indigo: "#6610f2"
      },
      spacing: {
        1: "4px",
        "1p": "1px",
        2: "8px",
        "2p": "2px",
        3: "12px",
        "3p": "3px",
        4: "16px",
        "4p": "4px",
        5: "20px",
        "5p": "5px",
        6: "24px",
        "6p": "6px",
        7: "28px",
        "7p": "7px",
        8: "32px",
        "8p": "8px",
        9: "36px",
        "9p": "9px",
        10: "40px",
        "10p": "10px",
        30: "30px",
        70: "70px",
        100: "100%",
        "100p": "100px"
      }
    }
  },
  variants: {
    textColor: ["responsive", "hover", "focus", "group-hover"]
  },
  plugins: [],
  corePlugins: {
    cLoading: false,
    tag: false,
    tooltip: false
  }
};
