// create rectangles
// split world into latitude of 10 degrees size each
// for each split define longetude that are valid, i.e. not sea and with possible images

const worldMapSplits = [
  {
    max: 67,
    min: 60,
    latInterVal: [
      {
        max: 61.5,
        min: 59,
        lngIntervals: [
          {
            min: -151,
            max: -148, // alaska
          },
          { min: -116, max: -113 }, // canada
          { min: 5, max: 10 }, // norway
        ],
      },
      {
        max: 61,
        min: 60.6,
        lngIntervals: [
          { min: -46, max: -45.3 }, // greenland
        ],
      },
      {
        max: 66.1,
        min: 63.1,
        lngIntervals: [
          {
            min: -23.7,
            max: -13.4, // iceland
          },
        ],
      },
      {
        max: 67,
        min: 58,
        lngIntervals: [
          {
            min: 10,
            max: 18.4,
          }, // sweden

          { min: 21.2, max: 30.9 }, // finland
        ],
      },
      {
        max: 62.5,
        min: 61.5,
        lngIntervals: [
          {
            min: 132,
            max: 135,
          }, // east siberia
        ],
      },
    ],
  },
  {
    max: 60,
    min: 50,
    latInterVal: [
      {
        max: 52.3,
        min: 46.9,
        lngIntervals: [
          { min: -126.8, max: -117.7 }, // west canada
          { min: -107.5, max: -102.7 }, // middle canada
          { min: -119.3, max: -111.3 }, // edmonton
        ],
      },
      {
        max: 50,
        min: 48.9,
        lngIntervals: [
          { min: -100, max: -97.1 }, //winnipeg
          { min: -77.6, max: -76.8 }, // east canada
        ],
      },
      {
        min: 51.5,
        max: 55,
        lngIntervals: [
          { min: -10.4, max: -5.7 }, // Ireland
          { min: -5.1, max: 0.2 }, // middle england
        ],
      },
      {
        min: 55.2,
        max: 58.6,
        lngIntervals: [
          { min: -5.9, max: -2.8 }, // scotland
        ],
      },
      {
        min: 54.8,
        max: 57.5,
        lngIntervals: [
          { min: 8, max: 16.7 }, // DK, sweden
        ],
      },
      {
        min: 55.15,
        max: 59.3,
        lngIntervals: [
          { min: 21.3, max: 28.5 }, // baltics
          { min: 34.1, max: 41.7 }, // moskva
        ],
      },
      {
        max: 55.3,
        min: 52.5,
        lngIntervals: [
          { max: 56.6, min: 48 }, // ufa, samara in russia
        ],
      },
      {
        min: 51.6,
        max: 53.3,
        lngIntervals: [{ min: 103.7, max: 107.4 }], // Lake Baikal
      },
      {
        min: 53.1,
        max: 53.9,
        lngIntervals: [
          { min: 157.9, max: 159 }, // Kamchatskiy
        ],
      },
    ],
  },
  {
    max: 50,
    min: 40,
    latInterVal: [
      {
        max: 50,
        min: 42.1,
        lngIntervals: [
          //USA CANADA
          { min: -124.54, max: -115.49 }, // USA oregon
        ],
      },
      {
        max: 50,
        min: 41.77,
        lngIntervals: [
          { min: -115.4, max: -103.89 }, // montana
        ],
      },
      {
        max: 43.56,
        min: 42.03,
        lngIntervals: [
          { min: -105.56, max: -102.57 }, // dakota
        ],
      },
      {
        max: 46.21,
        min: 44.02,
        lngIntervals: [
          { min: -94.01, max: -90.86 }, // minneapolis
        ],
      },
      {
        max: 44.21,
        min: 39.88,
        lngIntervals: [
          { min: -124.1, max: -117.16 }, // north cali
        ],
      },
      {
        max: 43.17,
        min: 39.74,
        lngIntervals: [
          { min: -117.82, max: -110.66 }, // Utah
        ],
      },
      {
        max: 42.91,
        min: 39.5,
        lngIntervals: [
          { min: -111.27, max: -104.68 }, // colorado
        ],
      },
      {
        max: 43.36,
        min: 40.75,
        lngIntervals: [
          { min: -105.47, max: -95.64 }, // South of minneapolis
        ],
      },
      {
        max: 42.97,
        min: 40.45,
        lngIntervals: [
          { min: -93.22, max: -87.9 }, // millwakee
        ],
      },
      {
        max: 41.48,
        min: 39.64,
        lngIntervals: [
          { min: -87.9, max: -83.25 }, // Ohio
        ],
      },
      {
        max: 45.09,
        min: 41.87,
        lngIntervals: [
          { min: -86.32, max: -83.34 }, // Detroid
        ],
      },
      {
        max: 41.51,
        min: 39.47,
        lngIntervals: [
          { min: -81.93, max: -73.94 }, // NY state
        ],
      },
      {
        max: 44.93,
        min: 42.94,
        lngIntervals: [
          { min: -80.17, max: -71.7 }, // Toronto
        ],
      },
      {
        max: 46.86,
        min: 45.68,
        lngIntervals: [
          { min: -73.89, max: -70.34 }, // Franska canada
        ],
      },
      {
        max: 44.25,
        min: 41.41,
        lngIntervals: [
          { min: -73.5, max: -70.03 }, // boston
        ],
      },
      {
        max: 45.18,
        min: 44.21,
        lngIntervals: [
          { min: -65.94, max: -62.6 }, // halifax
        ],
      },
      {
        max: 47.61,
        min: 47.35,
        lngIntervals: [
          { min: -53.24, max: -52.64 }, // Newfoundland
        ],
      },
      {
        max: 42.1,
        min: 40.38,
        lngIntervals: [
          { min: 42.09, max: 48.24 }, // Georgia
        ],
      },
      {
        max: 41.44,
        min: 39.37,
        lngIntervals: [
          { min: 43.76, max: 48.5 }, // Armania
        ],
      },
      {
        max: 42.23,
        min: 41.79,
        lngIntervals: [
          { min: 57.9, max: 60.44 }, // Uzbekistan, turk
        ],
      },
      {
        max: 41.51,
        min: 40.56,
        lngIntervals: [
          { min: 68.39, max: 69.8 }, // Kyrgistan
        ],
      },
      {
        max: 42.59,
        min: 42.4,
        lngIntervals: [
          { min: 75.81, max: 76.48 }, // Issykul
        ],
      },
      {
        max: 51.26,
        min: 51,
        lngIntervals: [
          { min: 71.2, max: 71.63 }, // Nur sultan
        ],
      },
      {
        max: 48.03,
        min: 47.55,
        lngIntervals: [
          { min: 106.22, max: 107.16 }, // Ulaanbaatar
        ],
      },
      {
        max: 44.47,
        min: 42.84,
        lngIntervals: [
          { min: 131.29, max: 132.91 }, // Vladovstok
        ],
      },
      {
        max: 44.26,
        min: 42.75,
        lngIntervals: [
          { min: 141.08, max: 143.32 }, // North japan
        ],
      },
      {
        max: 43.68,
        min: 42.41,
        lngIntervals: [
          { min: 142.33, max: 145.23 }, // japan
        ],
      },
      {
        max: 40.43,
        min: 38.7,
        lngIntervals: [
          { min: 139.57, max: 141.76 }, // north mainland japan
        ],
      },
    ],
  },
  {
    max: 50,
    min: 40,
    latInterVal: [
      // EUROPE for more liklihood of europe
      {
        max: 43.13,
        min: 37.23,
        lngIntervals: [
          { min: -8.98, max: -5.64 }, // Portugal
        ],
      },
      { max: 42.81, min: 37.3, lngIntervals: [{ min: -7.05, max: -3.18 }] },
      { max: 42.75, min: 36.53, lngIntervals: [{ min: -4.24, max: 0.15 }] }, // spain
      {
        max: 48.34,
        min: 47.81,
        lngIntervals: [
          { min: -3.98, max: -0.29 }, // west france
        ],
      },
      {
        max: 49.38,
        min: 43.33,
        lngIntervals: [
          { min: -1.43, max: 3.14 }, // france
        ],
      },
      {
        max: 51.07,
        min: 49.5,
        lngIntervals: [
          { min: 1.12, max: 4.98 }, // belgium
        ],
      },
      {
        max: 53.07,
        min: 51.45,
        lngIntervals: [
          { min: 3.93, max: 7.62 }, // netherlands
        ],
      },
      {
        max: 47.4,
        min: 43.58,
        lngIntervals: [
          { min: 5.25, max: 10.96 }, // swiss
        ],
      },
      {
        max: 50.23,
        min: 47.4,
        lngIntervals: [
          { min: 5.16, max: 12.45 }, // South ger
        ],
      },
      {
        max: 53.7,
        min: 50.96,
        lngIntervals: [
          { min: 6.57, max: 13.95 }, // North ger
        ],
      },
      {
        max: 48.4,
        min: 44.28,
        lngIntervals: [
          { min: 9.99, max: 16.49 }, // Austria
        ],
      },
      {
        max: 54.27,
        min: 48.86,
        lngIntervals: [
          { min: 13.95, max: 23.7 }, // Poland
        ],
      },
      {
        max: 47.87,
        min: 43.39,
        lngIntervals: [
          { min: 15.88, max: 22.47 }, // Croatia, hungary
        ],
      },
      {
        max: 44.34,
        min: 41.38,
        lngIntervals: [
          { min: 12.19, max: 12.28 }, // Italy
        ],
      },
      {
        max: 42.1,
        min: 36.88,
        lngIntervals: [
          { min: 13.86, max: 15.26 }, // South italy
        ],
      },
      {
        max: 42.81,
        min: 38.94,
        lngIntervals: [
          { min: 8.5, max: 9.53 }, // italian islands
        ],
      },
      {
        max: 46.26,
        min: 36.77,
        lngIntervals: [
          { min: 21.27, max: 23.69 }, // Greece, serbia
        ],
      },
      {
        max: 48.05,
        min: 40.68,
        lngIntervals: [
          { min: 23.69, max: 29.75 }, // Bulgaria
        ],
      },
      {
        max: 50.99,
        min: 46.38,
        lngIntervals: [
          { min: 24.08, max: 39.72 }, // Ukrain
        ],
      },
    ],
  },
  {
    max: 40,
    min: 30,
    lngIntervals: [
      { min: -124, max: -109 }, // west usa, mexico
      { min: -109, max: -90 }, // middle usa, upto mississippi
      { min: -90, max: -73 }, // east usa
      { min: -10, max: 0.5 }, // spain, portugal, marocco
      { min: -1, max: 20 }, // north africa, south italy
      { min: 20, max: 35 }, // greece, turkey, egypt
      { min: 35, max: 48 }, // middle east
      { min: 48, max: 60 }, // iran, turkmenistan
      { min: 60, max: 80 }, // stans
      { min: 80, max: 120 }, // CHINA
      { min: 124, max: 130 }, // Koreas
      { min: 130, max: 140 }, // Japan
    ],
  },
  {
    max: 30,
    min: 20,
    latInterVal: [
      {
        min: 22.7,
        max: 24.0,
        lngIntervals: [
          { min: -110.3, max: -109.6 }, // Maxico, gulf of cali
        ],
      },
      {
        min: 27.9,
        max: 30.4,
        lngIntervals: [
          { min: -111.4, max: -110.7 }, // Mexico
        ],
      },
      {
        min: 29.5,
        max: 30.12,
        lngIntervals: [
          { min: -104.5, max: -102.3 }, // south west texas
        ],
      },
      {
        min: 28.9,
        max: 30.2,
        lngIntervals: [
          { min: -94.3, max: -99.47 }, // Houston, San antionio
        ],
      },
      {
        min: 29.6,
        max: 30.4,
        lngIntervals: [
          { min: -92.2, max: -84.2 }, // NOLA, Tallahassee
        ],
      },
      {
        min: 25.2,
        max: 25.7,
        lngIntervals: [
          { min: -103.6, max: -100.0 }, // Monterrey, Mexico
        ],
      },
      {
        min: 20.1,
        max: 21.2,
        lngIntervals: [
          { min: -90.3, max: -86.5 }, // Cancun, mexico
        ],
      },
      {
        min: 21.5,
        max: 23.0,
        lngIntervals: [
          { min: -84.5, max: -79.2 }, // havana
        ],
      },
      {
        min: 19.9,
        max: 21.0,
        lngIntervals: [
          { min: -77.9, max: -74.2 }, // South east cuba
        ],
      },
      {
        min: 18.05,
        max: 19.6,
        lngIntervals: [
          { min: -73.4, max: -68.4 }, // Dominic republic
        ],
      },
      {
        min: 18.7,
        max: 20.9,
        lngIntervals: [
          { min: -101.4, max: -98.3 }, // Mexico city
        ],
      },
      {
        max: 31.08,
        min: 29.0,
        lngIntervals: [
          { min: 29.5, max: 32.4 }, // Cairo
        ],
      },
      { max: 26.8, min: 24.1, lngIntervals: [{ min: 33.8, max: 35.6 }] }, // river nile
      { min: 22.7, max: 24.9, lngIntervals: [{ min: 43.3, max: 46.7 }] }, // Riyad
      {
        min: 24.2,
        max: 25.7,
        lngIntervals: [
          { min: 54.7, max: 56.9 }, // dubai
        ],
      },
      {
        min: 24.2,
        max: 25.9,
        lngIntervals: [
          { min: 67.5, max: 69.2 }, // pakistan
        ],
      },
      {
        min: 28.1,
        max: 28.9,
        lngIntervals: [
          { min: 76.7, max: 77.8 }, // new dehli
        ],
      },
      { min: 27.37, max: 27.9, lngIntervals: [{ min: 83.1, max: 86.3 }] },
      {
        min: 21.7,
        max: 27.9,
        lngIntervals: [
          { min: 87.7, max: 93.3 }, // Bangladesh
        ],
      },
      {
        min: 16.97,
        max: 25.4,
        lngIntervals: [
          { min: 95.0, max: 121.94 }, // South east asia, fix!!
        ],
      },
    ],
  },
  {
    max: 20,
    min: 10,
    lngIntervals: [
      { min: -104, max: -83 }, // Mexico, Honduras
      { min: -79, max: -60 }, // Jamica, Dominic Republic, Islands
      { min: -16, max: 4 }, // Senegal, Guinea
      { min: 4, max: 22 }, // Niger, north Nigeria, Chad
      { min: 22, max: 51 }, // Sudan, Yemen Ethiopia, Yemen
      { min: 72, max: 88 }, // India
      { min: 94, max: 109 }, // Myanmar, Thailand, Vietname
      { min: 118, max: 125 }, // Philippines
    ],
  },
  {
    max: 10,
    min: 0,
    latInterVal: [
      {
        max: 10.8,
        min: 8.3,
        lngIntervals: [
          { min: -85.3, max: -82.5 }, // Costa rica
        ],
      },
      {
        min: 7.0,
        max: 11.35,
        lngIntervals: [
          { min: -82.9, max: -71.3 }, // Panama, venuzuela
        ],
      },
      { max: 7.9, min: 2.6, lngIntervals: [{ min: -78.0, max: -72.4 }] },
      {
        max: 5.9,
        min: 4.1,
        lngIntervals: [
          { min: -55.6, max: 54.7 }, // suriname
          { min: -76.4, max: -72.6 }, // Bogota
        ],
      },
      {
        max: 1.2,
        min: -2.8,
        lngIntervals: [
          { min: -80.5, max: -76.7 }, // Colombia, Ecuador
        ],
      },
      {
        min: 0.25,
        max: 0.4,
        lngIntervals: [
          { min: 6.5, max: 6.76 }, // Sao Tome
        ],
      },
      {
        min: 3.5,
        max: 4.1,
        lngIntervals: [
          { min: 9.1, max: 11.7 }, // Cameroon
          { min: 18.3, max: 18.5 }, // CAR
        ],
      },
      {
        min: 2.0,
        max: 2.38,
        lngIntervals: [
          { min: 20.1, max: 21.6 }, // DRotC, Bumba
        ],
      },
      {
        min: 2.6,
        max: 2.75,
        lngIntervals: [
          { min: 24.6, max: 24.9 }, // Buta
        ],
      },
      {
        min: 2.3,
        max: 3.6,
        lngIntervals: [
          { min: 30.9, max: 32.1 }, // Uganda
          {
            min: 36.7,
            max: 38.2,
          }, // Kenya
        ],
      },
      {
        min: 2.0,
        max: 2.1,
        lngIntervals: [
          { min: 45.3, max: 45.4 }, // Mogadishu
        ],
      },
      {
        min: 5.5,
        max: 13.1,
        lngIntervals: [
          { min: 34.8, max: 41.5 }, // Ethiopia
        ],
      },
      {
        min: 7.9,
        max: 11.1,
        lngIntervals: [
          { min: 76.2, max: 79.9 }, // South India
        ],
      },
      {
        min: 5.9,
        max: 9.3,
        lngIntervals: [
          { min: 79.8, max: 81.3 }, // Sri Lanka
        ],
      },
      {
        min: 7.8,
        max: 10.5,
        lngIntervals: [
          { min: 98.3, max: 100.0 }, // Malaysia
        ],
      },
      {
        min: 9.5,
        max: 11.6,
        lngIntervals: [
          { min: 122.1, max: 125.9 }, // Philippines
        ],
      },
      {
        min: 5.7,
        max: 9.6,
        lngIntervals: [
          { min: 124.9, max: 126.3 }, // Philippines
        ],
      },
      {
        min: 7.2,
        max: 7.5,
        lngIntervals: [
          { min: 134.4, max: 134.7 }, // Palau
        ],
      },
    ],
  },
  {
    max: 0,
    min: -10,
    latInterVal: [
      {
        max: -0.5,
        min: -3.36,
        lngIntervals: [
          { min: -80.54, max: -78.56 }, // Ecuador
        ],
      },
      {
        max: -6.77,
        min: -6.96,
        lngIntervals: [
          { min: -80.01, max: -79.56 }, // Peru
        ],
      },
      {
        max: -3.08,
        min: -4.09,
        lngIntervals: [
          { min: -40.21, max: -38.4 }, // North brazil
        ],
      },
      {
        max: -5.67,
        min: -8.24,
        lngIntervals: [
          { min: -37.29, max: -34.83 }, // Brazil
        ],
      },
      {
        max: -4.77,
        min: -6.08,
        lngIntervals: [
          { min: 11.77, max: 12.54 }, // west africa
        ],
      },
      {
        max: -4.11,
        min: -4.35,
        lngIntervals: [
          { min: 15.17, max: 15.58 }, // Kinshasa
        ],
      },
      {
        max: -2.91,
        min: -3,
        lngIntervals: [
          { min: 25.9, max: 25.96 }, // kindu congo
        ],
      },
      {
        max: 0.62,
        min: 0.37,
        lngIntervals: [
          { min: 24.91, max: 25.38 }, // Kisangani
        ],
      },
      {
        max: -0.22,
        min: -2.37,
        lngIntervals: [
          { min: 28.86, max: 30.6 }, // Rwanda
        ],
      },
      {
        max: 0.76,
        min: -0.08,
        lngIntervals: [
          { min: 32.16, max: 34.21 }, // Uganda
        ],
      },
      {
        max: -0.07,
        min: -1.1,
        lngIntervals: [
          { min: 34.11, max: 36.13 }, // Kenya
        ],
      },
      {
        max: 0.32,
        min: -1.51,
        lngIntervals: [
          { min: 36.7, max: 38.11 }, // Kenya
        ],
      },
      {
        max: -3.43,
        min: -5.1,
        lngIntervals: [
          { min: 28.84, max: 29.26 }, // Burundi
        ],
      },
      {
        max: -7.21,
        min: -10.12,
        lngIntervals: [
          { min: 13.16, max: 13.25 }, // angola
        ],
      },
      {
        max: -4,
        min: -4.92,
        lngIntervals: [
          { min: 14.13, max: 16.11 }, // Kinshasa, Kongo
        ],
      },
      {
        max: -8.31,
        min: -9.57,
        lngIntervals: [
          { min: 28.06, max: 29.03 }, // Dem Rep Congo
        ],
      },
      {
        max: -6.72,
        min: -7.18,
        lngIntervals: [
          { min: 39.06, max: 39.28 }, // Tanzania
        ],
      },
      {
        max: -5.92,
        min: -6.43,
        lngIntervals: [
          { min: 39.14, max: 39.58 }, // Zanzibar
        ],
      },
      {
        max: -4.98,
        min: -5.41,
        lngIntervals: [
          { min: 39.64, max: 39.84 }, // Island
        ],
      },
      {
        max: -3.88,
        min: -4.24,
        lngIntervals: [
          { min: 39.51, max: 39.83 }, // Mombasa
        ],
      },
      {
        max: -6.1,
        min: -6.32,
        lngIntervals: [
          { min: 35.56, max: 35.85 }, // Dodoma, Tanzania
        ],
      },
      {
        max: 1.82,
        min: 0.98,
        lngIntervals: [
          { min: 102.63, max: 104.74 }, // Singapore
        ],
      },
      {
        max: -0.65,
        min: -1.38,
        lngIntervals: [
          { min: 100.06, max: 100.79 }, // Padang
        ],
      },
      {
        max: -2.6,
        min: -3.87,
        lngIntervals: [
          { min: 103.48, max: 105.29 }, // Plemband
        ],
      },
      {
        max: -5.54,
        min: -7.11,
        lngIntervals: [
          { min: 104.39, max: 107.73 }, // Jakarta
        ],
      },
      {
        max: -7.51,
        min: -7.66,
        lngIntervals: [
          { min: 108.73, max: 112.73 }, // Java
        ],
      },
      {
        max: -8.26,
        min: -8.53,
        lngIntervals: [
          { min: 114.79, max: 115.61 }, // eyja
        ],
      },
      {
        max: -3.27,
        min: -3.44,
        lngIntervals: [
          { min: 114.19, max: 115.02 }, // Banjarmasin
        ],
      },
      {
        max: -4.41,
        min: -5.63,
        lngIntervals: [
          { min: 119.34, max: 120.48 }, // Makassar
        ],
      },
      {
        max: -8.85,
        min: -8.9,
        lngIntervals: [
          { min: 120.27, max: 121.25 }, // Ehv
        ],
      },
      {
        max: -8.65,
        min: -9.48,
        lngIntervals: [
          { min: 124.95, max: 125.96 }, // Timor Leste
        ],
      },
      {
        max: -3.45,
        min: -4.68,
        lngIntervals: [
          { min: 142.79, max: 144.81 }, // Papua new guinea
        ],
      },
      {
        max: -3.1,
        min: -3.54,
        lngIntervals: [
          { min: 151.45, max: 152.24 }, // pap
        ],
      }, // pap
      {
        max: -8.7,
        min: -9.92,
        lngIntervals: [
          { min: 146.43, max: 147.58 }, // Port Moresby
        ],
      },
      {
        max: -8.35,
        min: -9.01,
        lngIntervals: [
          { min: 160.57, max: 160.83 }, // Solomon Islands.
        ],
      },
    ],
  },
  {
    max: -10,
    min: -20,
    lngIntervals: [
      { min: -78, max: -60 }, // Peru, Bolivia
      { min: -60, max: -36 }, // Brazil, Paraguay
      { min: 11, max: 25 }, // Namibia, Angola, Zambia
      { min: 25, max: 40 }, // Mozamique, Zimbabwe, Malawi
      { min: 40, max: 49 }, // Madagascar
      { min: 124, max: 146 }, // North Australia
    ],
  },
  {
    max: -20,
    min: -30,
    lngIntervals: [
      { min: -71, max: -63 }, // Argentina, Chile
      { min: -63, max: -39 }, // Argentina, Brazil
      { min: 14, max: 34 }, // Namimbia, South Africa, Botswana, Eswatini
      { min: 43, max: 47 }, // Madagascar
      { min: 113, max: 135 }, // east Australia
      { min: 135, max: 153 }, // West Australia
    ],
  },
  {
    max: -30,
    min: -40,
    latInterVal: [
      {
        max: -32.99,
        min: -38.2,
        lngIntervals: [
          { min: -73.39, max: -69.96 }, // west chile
        ],
      },
      {
        max: -40.81,
        min: -42,
        lngIntervals: [
          { min: -72.03, max: -71.06 }, // chile
        ],
      },
      {
        max: -38.77,
        min: -39.18,
        lngIntervals: [
          { min: -68.47, max: -67.81 }, // arg
        ],
      },
      {
        max: -37.53,
        min: -38.53,
        lngIntervals: [
          { min: -58.61, max: -57.25 }, // arg
        ],
      },
      {
        max: -34.51,
        min: -35.14,
        lngIntervals: [
          { min: -60.08, max: -58.15 }, // buenos aires
        ],
      },
      {
        max: -31.26,
        min: -31.99,
        lngIntervals: [
          { min: -65.09, max: -63.72 }, // Cordoba
        ],
      },
      {
        max: -32.88,
        min: -33.28,
        lngIntervals: [
          { min: -61.42, max: -60.36 }, // Rosario
        ],
      },
      {
        max: -34.51,
        min: -34.98,
        lngIntervals: [
          { min: -56.56, max: -55.66 }, // Uruguay
        ],
      },
      {
        max: -32.84,
        min: -33.43,
        lngIntervals: [
          { min: -53.23, max: -52.46 }, // east uruguay
        ],
      },
      {
        max: -29.69,
        min: -30.64,
        lngIntervals: [
          { min: -52.58, max: -49.81 }, // Port algere
        ],
      },
      {
        max: -33.5,
        min: -34.11,
        lngIntervals: [
          { min: 18.39, max: 19.82 }, // Cape town
        ],
      },
      {
        max: -28.54,
        min: -31.37,
        lngIntervals: [
          { min: 17.62, max: 17.89 }, // east south africa
        ],
      },
      {
        max: -33.65,
        min: -34.2,
        lngIntervals: [
          { min: 24.52, max: 26.63 }, // Port elizabeth
        ],
      },
      {
        max: -29.04,
        min: -30.47,
        lngIntervals: [
          { min: 26.58, max: 29.35 }, // Lesotho
        ],
      },
      {
        max: -29.44,
        min: -30.71,
        lngIntervals: [
          { min: 30.12, max: 31.28 }, // Eswatini
        ],
      },
      {
        max: -32.05,
        min: -34.89,
        lngIntervals: [
          { min: 115.86, max: 118.85 }, // Perth
        ],
      },
      {
        max: -28.57,
        min: -31.37,
        lngIntervals: [
          { min: 115.27, max: 116.72 }, // Geraldton
        ],
      },
      {
        max: -33.21,
        min: -33.89,
        lngIntervals: [
          { min: 123, max: 124.01 }, // south aust
        ],
      },
      {
        max: -33.32,
        min: -34.11,
        lngIntervals: [
          { min: 135.26, max: 137.34 }, // middle south aust
        ],
      },
      {
        max: -33.89,
        min: -36.01,
        lngIntervals: [
          { min: 136.99, max: 139.67 }, // Adelaide
        ],
      },
      {
        max: -35.6,
        min: -38.03,
        lngIntervals: [
          { min: 140.47, max: 150.22 }, // Melbourne
        ],
      },
      {
        max: -32.73,
        min: -35.46,
        lngIntervals: [
          { min: 147.72, max: 152.2 }, // Sydney
        ],
      },
      {
        max: -27.57,
        min: -32.73,
        lngIntervals: [
          { min: 147.33, max: 153.21 }, // east australia
        ],
      },
      {
        max: -31.82,
        min: -32.19,
        lngIntervals: [
          { min: 141.14, max: 141.63 }, // Broken hill
        ],
      },
    ],
  },
  {
    max: -40,
    min: -50,
    latInterVal: [
      {
        max: -54.12,
        min: -54.9,
        lngIntervals: [
          { min: -68.51, max: -67.1 }, // South argentina
        ],
      },
      {
        max: -43.25,
        min: -44.26,
        lngIntervals: [
          { min: -72.51, max: -71.43 }, // South chile
        ],
      },
      {
        max: -42.31,
        min: -42.91,
        lngIntervals: [
          { min: -65, max: -63.66 }, // south arg
        ],
      },
      {
        max: -51.54,
        min: -52.12,
        lngIntervals: [
          { min: -59.54, max: -57.93 }, // Falkland
        ],
      },
      {
        max: -40.85,
        min: -43.28,
        lngIntervals: [
          { min: 145.7, max: 146.29 }, // west tasmania
        ],
      },
      {
        max: -40.9,
        min: -43.53,
        lngIntervals: [
          { min: 146.43, max: 148.4 }, // east tasmania
        ],
      },
      {
        max: -45.02,
        min: -46.17,
        lngIntervals: [
          { min: 167.53, max: 171.04 }, // Dunedin
        ],
      },
      {
        max: -43.59,
        min: -44.11,
        lngIntervals: [
          { min: 171.56, max: 173.2 }, // CHristchurch
        ],
      },
      {
        max: -43.33,
        min: -43.53,
        lngIntervals: [
          { min: 169.73, max: 170.06 }, // west coast
        ],
      },
      {
        max: -41.28,
        min: -41.59,
        lngIntervals: [
          { min: 173.36, max: 174.37 }, // North south island
        ],
      },
      {
        max: -40.85,
        min: -41.24,
        lngIntervals: [
          { min: 174.79, max: 176.15 }, // South north island
        ],
      },
      {
        max: -37.51,
        min: -39.49,
        lngIntervals: [
          { min: 173.96, max: 178.73 }, // North island
        ],
      },
      {
        max: -35.09,
        min: -36.6,
        lngIntervals: [
          { min: 173.66, max: 174.29 }, // North north island
        ],
      },
    ],
  },
  // Not going more south since it till cause an inbalance because -50, -60 will be only chile argentina and it will appear 1/13 of the time
];

module.exports = {
  worldMapSplits,
};
